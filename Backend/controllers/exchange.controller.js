import Exchange from "../models/exchange.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import { awardPoints } from "../utils/gamification.js";

// create exchange request
export const createExchange = async (req, res) => {
  try {
    const { postId, proposedDuration, requestNote } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ❌ Prevent self-exchange
    if (post.user.toString() === req.user.id) {
      return res
        .status(400)
        .json({ message: "You cannot request exchange on your own post" });
    }

    // ❌ Prevent duplicate requests
    const existing = await Exchange.findOne({
      post: postId,
      requester: req.user.id,
      status: "pending",
    });

    if (existing) {
      return res
        .status(400)
        .json({ message: "Exchange request already sent" });
    }

    const exchange = await Exchange.create({
      post: postId,
      owner: post.user,
      requester: req.user.id,
      status: "pending",
      proposedDuration,
      requestNote,
    });

    // Notify post owner
    await Notification.create({
      recipient: post.user,
      sender: req.user.id,
      type: "exchange_request",
      post: post._id,
    });

    res.status(201).json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// incoming requests (for post owner)
export const getIncomingExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      owner: req.user._id,
      status: { $in: ["pending", "accepted"] },
    })
      .populate("post")
      .populate("requester", "name email");

    res.json(exchanges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// outgoing requests (sent by user)
export const getOutgoingExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      requester: req.user._id,
    })
      .populate("post")
      .populate("owner", "name email");

    res.json(exchanges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// completed exchanges
export const getCompletedExchanges = async (req, res) => {
  try {
    const exchanges = await Exchange.find({
      $or: [{ requester: req.user._id }, { owner: req.user._id }],
      status: "accepted",
    }).populate("post");

    res.json(exchanges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// accept exchange
export const acceptExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    exchange.status = "accepted";
    await exchange.save();

    // Notify requester
    await Notification.create({
      recipient: exchange.requester,
      sender: req.user.id,
      type: "exchange_accepted",
      post: exchange.post,
    });

    res.json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// reject exchange
export const rejectExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    exchange.status = "rejected";
    await exchange.save();

    res.json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// confirm exchange completion
export const confirmExchange = async (req, res) => {
  try {
    const exchange = await Exchange.findById(req.params.id);

    if (!exchange) {
      return res.status(404).json({ message: "Exchange not found" });
    }

    if (exchange.status !== "accepted") {
      return res.status(400).json({ message: "Exchange must be accepted before confirmation" });
    }

    const userId = req.user.id;

    if (exchange.owner.toString() === userId) {
      exchange.ownerConfirmed = true;
    } else if (exchange.requester.toString() === userId) {
      exchange.requesterConfirmed = true;
    } else {
      return res.status(401).json({ message: "Not authorized to confirm this exchange" });
    }

    // If both confirmed, mark as completed
    if (exchange.ownerConfirmed && exchange.requesterConfirmed) {
      exchange.status = "completed";

      // Mark post as NOT available for exchange anymore
      await Post.findByIdAndUpdate(exchange.post, { exchangeAvailable: false });

      // Award 10 points to both parties
      await awardPoints(exchange.owner, 10);
      await awardPoints(exchange.requester, 10);
    }

    await exchange.save();
    res.json(exchange);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// discovery: GET all books available for exchange from other users
export const getAvailableExchanges = async (req, res) => {
  try {
    const userId = req.user.id;
    const posts = await Post.find({
      exchangeAvailable: true,
      user: { $ne: userId }
    })
    .populate("user", "name avatar")
    .populate("book")
    .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// my inventory: GET all books I am sharing and any associated requests
export const getMyLendings = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find all posts where I'm the user and I marks as exchangeAvailable
    const posts = await Post.find({
      user: userId,
      exchangeAvailable: true
    })
    .populate("book")
    .sort({ createdAt: -1 });

    // For each post, find if there are any active/pending exchanges
    const postIds = posts.map(p => p._id);
    const exchanges = await Exchange.find({
      post: { $in: postIds }
    })
    .populate("requester", "name avatar email")
    .populate("post");

    // We can either return just the exchanges or the posts with exchange info
    // For simplicity, let's return the exchanges if they exist, or the post wrapped in a dummy exchange object if not
    // This allows the frontend to use ExchangeCard consistently
    const results = [];
    
    posts.forEach(post => {
      const associatedExchanges = exchanges.filter(ex => ex.post?._id.toString() === post._id.toString());
      
      if (associatedExchanges.length > 0) {
        // Add each active/pending request
        results.push(...associatedExchanges);
      } else {
        // Add a "placeholder" exchange so the user sees their book in the list
        results.push({
          _id: `post_${post._id}`,
          post: post,
          owner: req.user,
          status: "none", // Special status for listed but not requested
          isPostOnly: true
        });
      }
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
