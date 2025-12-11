import React, { useState, useEffect, useMemo } from 'react';
import { Square, Circle, Triangle, Star, Trophy } from 'lucide-react';

const SHAPES = [
    { name: 'Square', component: Square },
    { name: 'Circle', component: Circle },
    { name: 'Triangle', component: Triangle },
    { name: 'Star', component: Star },
] as const;

const COLORS = [
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#22c55e' },
    { name: 'Yellow', value: '#facc15' },
] as const;

type ShapeName = typeof SHAPES[number]['name'];
type ColorName = typeof COLORS[number]['name'];

interface Target {
    shape: ShapeName;
    color: ColorName;
}

interface ShapeOption {
    shape: ShapeName;
    color: ColorName;
}

const generateLevel = (): { target: Target, options: ShapeOption[] } => {
    const targetShapeIndex = Math.floor(Math.random() * SHAPES.length);
    const targetColorIndex = Math.floor(Math.random() * COLORS.length);
    const target: Target = {
        shape: SHAPES[targetShapeIndex].name,
        color: COLORS[targetColorIndex].name,
    };

    let options: ShapeOption[] = [target];
    while (options.length < 9) {
        const randomShapeIndex = Math.floor(Math.random() * SHAPES.length);
        const randomColorIndex = Math.floor(Math.random() * COLORS.length);
        const newOption: ShapeOption = {
            shape: SHAPES[randomShapeIndex].name,
            color: COLORS[randomColorIndex].name,
        };
        // Avoid duplicates
        if (!options.some(opt => opt.shape === newOption.shape && opt.color === newOption.color)) {
            options.push(newOption);
        }
    }

    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    return { target, options };
};

const ShapeMatchGame: React.FC = () => {
    const [level, setLevel] = useState(generateLevel());
    const [score, setScore] = useState(0);
    const [feedbackIndex, setFeedbackIndex] = useState<number | null>(null);
    const [feedbackType, setFeedbackType] = useState<'correct' | 'wrong' | null>(null);
    const [showConfetti, setShowConfetti] = useState(false);

    const { target, options } = level;

    const shapeMap = useMemo(() => {
        const map = new Map<ShapeName, React.ElementType>();
        SHAPES.forEach(s => map.set(s.name, s.component));
        return map;
    }, []);
    
    const colorMap = useMemo(() => {
        const map = new Map<ColorName, string>();
        COLORS.forEach(c => map.set(c.name, c.value));
        return map;
    }, []);

    const handleShapeClick = (index: number, clickedOption: ShapeOption) => {
        if (feedbackType || showConfetti) return; // Prevent clicking during feedback or win state

        setFeedbackIndex(index);
        if (clickedOption.shape === target.shape && clickedOption.color === target.color) {
            setFeedbackType('correct');
            const newScore = score + 1;

            setTimeout(() => {
                if (newScore === 10) {
                    setScore(newScore);
                    setShowConfetti(true);
                } else {
                    setScore(newScore);
                    setLevel(generateLevel());
                    setFeedbackIndex(null);
                    setFeedbackType(null);
                }
            }, 800); // Delay after correct click animation finishes
        } else {
            setFeedbackType('wrong');
            setTimeout(() => {
                setFeedbackIndex(null);
                setFeedbackType(null);
            }, 800);
        }
    };
    
    const handlePlayAgain = () => {
        setShowConfetti(false);
        setScore(0);
        setLevel(generateLevel());
        setFeedbackIndex(null);
        setFeedbackType(null);
    };

    return (
        <div className="relative max-w-md mx-auto p-4 bg-slate-100/50 dark:bg-slate-700/50 rounded-2xl">
            {showConfetti && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl z-20 animate-fade-in overflow-hidden">
                    <Trophy 
                        className="w-24 h-24 text-amber-400 mb-4 animate-fade-in-down" 
                        style={{ filter: 'drop-shadow(0 0 15px rgba(251, 191, 36, 0.7))' }} 
                    />
                    <h2 className="text-5xl font-extrabold text-white mb-8 animate-fade-in-down" style={{animationDelay: '0.2s'}}>You Won!</h2>
                    <button
                        onClick={handlePlayAgain}
                        className="bg-green-500 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-green-600 transition-all transform hover:scale-105 duration-300 shadow-lg animate-fade-in-up"
                        style={{animationDelay: '0.4s'}}
                    >
                        Play Again
                    </button>
                    {Array.from({ length: 100 }).map((_, i) => {
                        const confettiColors = ['#ef4444', '#3b82f6', '#22c55e', '#facc15', '#a855f7', '#ec4899'];
                        const style = {
                            left: `${Math.random() * 100}%`,
                            backgroundColor: confettiColors[Math.floor(Math.random() * confettiColors.length)],
                            animationDelay: `${Math.random() * 2}s`,
                            width: `${Math.floor(Math.random() * 6) + 8}px`,
                            height: `${Math.floor(Math.random() * 4) + 6}px`,
                        };
                        return <div key={i} className="confetti-particle" style={style}></div>;
                    })}
                </div>
            )}
            <div className="flex justify-between items-center mb-6 p-4 bg-white/50 dark:bg-slate-800/50 rounded-lg shadow-inner">
                <p className="text-xl font-bold text-slate-800 dark:text-white">
                    Find the <span style={{ color: colorMap.get(target.color) }}>{target.color} {target.shape}</span>
                </p>
                <div className="text-lg font-bold bg-amber-400 text-slate-900 px-4 py-1 rounded-full">
                    Score: {score}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {options.map((option, index) => {
                    const ShapeComponent = shapeMap.get(option.shape);
                    const colorValue = colorMap.get(option.color);
                    if (!ShapeComponent || !colorValue) return null;

                    let animationClass = '';
                    if (feedbackIndex === index) {
                        if (feedbackType === 'correct') animationClass = 'correct-burst-animation';
                        if (feedbackType === 'wrong') animationClass = 'shake-animation';
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => handleShapeClick(index, option)}
                            disabled={!!feedbackType || showConfetti}
                            className={`flex items-center justify-center aspect-square bg-white/60 dark:bg-slate-800/60 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 active:scale-95 ${animationClass}`}
                            aria-label={`Select ${option.color} ${option.shape}`}
                        >
                            <ShapeComponent 
                                style={{ color: colorValue }}
                                className={`w-12 h-12 ${option.shape === 'Triangle' ? 'fill-current' : ''}`}
                                strokeWidth={4}
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default ShapeMatchGame;