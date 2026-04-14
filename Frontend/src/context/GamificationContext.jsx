import { createContext, useContext, useState, useCallback } from "react";
import { MoveUp } from "lucide-react";

const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
    const [animations, setAnimations] = useState([]);

    const showPointsAwarded = useCallback((amount) => {
        const id = Date.now();
        setAnimations((prev) => [...prev, { id, amount }]);

        // Remove animation after 2.5 seconds
        setTimeout(() => {
            setAnimations((prev) => prev.filter((anim) => anim.id !== id));
        }, 2500);
    }, []);

    return (
        <GamificationContext.Provider value={{ showPointsAwarded }}>
            {children}

            {/* Animation Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[9999] flex items-center justify-center">
                {animations.map((anim) => (
                    <div
                        key={anim.id}
                        className="flex flex-col items-center animate-bounce-up"
                    >
                        <div className="bg-orange-500 border-4 border-black px-6 py-3 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                            <MoveUp className="text-white" size={24} strokeWidth={4} />
                            <span className="text-2xl font-black text-white italic uppercase">
                                +{anim.amount} XP
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
        @keyframes bounce-up {
          0% { transform: translateY(40px) scale(0.5); opacity: 0; }
          20% { transform: translateY(-20px) scale(1.1); opacity: 1; }
          80% { transform: translateY(-40px) scale(1); opacity: 1; }
          100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
        }
        .animate-bounce-up {
          animation: bounce-up 2.5s forwards ease-out;
        }
      `}</style>
        </GamificationContext.Provider>
    );
};

export const useGamification = () => {
    const context = useContext(GamificationContext);
    if (!context) {
        throw new Error("useGamification must be used within a GamificationProvider");
    }
    return context;
};
