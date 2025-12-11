import React from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface AnimateOnScrollProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'slide-in-from-left' | 'slide-in-from-right';
    delay?: number; // in ms
    duration?: number; // in ms
    threshold?: number;
    triggerOnce?: boolean;
    style?: React.CSSProperties;
}

const AnimateOnScroll: React.FC<AnimateOnScrollProps> = ({
    children,
    className = '',
    animation = 'fade-in-up',
    delay = 0,
    duration = 800,
    threshold = 0.1,
    triggerOnce = true,
    style = {}
}) => {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold, triggerOnce });

    const animationClassMap = {
        'fade-in': '', // No transform needed for fade-in
        'fade-in-up': 'fade-in-up',
        'fade-in-down': 'fade-in-down',
        'slide-in-from-left': 'slide-in-from-left',
        'slide-in-from-right': 'slide-in-from-right',
    };
    
    const animationTypeClass = animationClassMap[animation] || '';

    // Base classes for the new transition effect
    const baseClasses = 'scroll-reveal';
    
    // Add 'is-visible' class when the element is intersecting to trigger the transition
    const visibilityClass = isIntersecting ? 'is-visible' : '';

    const finalClassName = `${baseClasses} ${animationTypeClass} ${visibilityClass} ${className}`;

    const combinedStyle: React.CSSProperties = {
        ...style,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
    };

    return (
        <div
            ref={ref}
            className={finalClassName}
            style={combinedStyle}
        >
            {children}
        </div>
    );
};

export default AnimateOnScroll;