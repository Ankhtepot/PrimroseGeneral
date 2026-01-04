import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.scss';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, delay = 300 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState<'right' | 'left'>('right');
    const timeoutRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const spaceOnRight = window.innerWidth - rect.right;
                // If space on right is less than 150px (approx tooltip width), flip to left
                setPosition(spaceOnRight < 150 ? 'left' : 'right');
            }
            setIsVisible(true);
        }, delay);
    };

    const hideTooltip = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsVisible(false);
    };

    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    return (
        <div 
            className={styles.container} 
            onMouseEnter={showTooltip} 
            onMouseLeave={hideTooltip}
            ref={containerRef}
        >
            {children}
            {isVisible && (
                <div className={`${styles.tooltip} ${styles[position]}`}>
                    {text}
                </div>
            )}
        </div>
    );
};

export default Tooltip;
