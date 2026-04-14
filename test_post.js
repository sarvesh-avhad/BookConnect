import axios from 'axios';

const testPost = async () => {
  try {
    const res = await axios.post('http://localhost:8080/api/posts', {
      caption: 'Test post without image',
    }, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // I need a token, which I don't have easily.
      }
    });
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error:', err.response?.status, err.response?.data);
  }
};

// I'll skip this script for now as I don't have a valid token.
