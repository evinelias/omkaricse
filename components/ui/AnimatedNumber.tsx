import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface AnimatedNumberProps {
    value: number;
    suffix?: string;
    className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value, suffix, className }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5, triggerOnce: true });

    useEffect(() => {
        if (!isVisible) return;

        let start = 0;
        const end = value;
        if (start === end) {
            setDisplayValue(end);
            return;
        };

        const duration = 2000;
        const steps = Math.min(end, 100); 
        if (steps === 0) {
            setDisplayValue(end);
            return;
        }
        const increment = end / steps;
        const stepTime = duration / steps;
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.ceil(start));
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value, isVisible]);
    
    return <span ref={ref} className={className}>{displayValue.toLocaleString()}{suffix}</span>;
}

export default AnimatedNumber;
