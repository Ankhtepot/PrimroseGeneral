import React, { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './Tooltip.module.scss';

interface TooltipProps {
    text: string;
    children: React.ReactNode;
    delay?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ text, children, delay = 300 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [side, setSide] = useState<'right' | 'left'>('right');
    const timeoutRef = useRef<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const updatePosition = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceOnRight = window.innerWidth - rect.right;
            const newSide = spaceOnRight < 150 ? 'left' : 'right';
            setSide(newSide);

            if (newSide === 'right') {
                setPosition({
                    top: rect.top,
                    left: rect.right + 10,
                });
            } else {
                setPosition({
                    top: rect.top,
                    left: rect.left - 10,
                });
            }
        }
    }, []);

    useLayoutEffect(() => {
        if (isVisible) {
            // Handle window resize or scroll
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true);
        }
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition, true);
        };
    }, [isVisible, updatePosition]);

    const showTooltip = () => {
        timeoutRef.current = setTimeout(() => {
            updatePosition();
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
            {isVisible && createPortal(
                <div 
                    ref={tooltipRef}
                    className={`${styles.tooltip} ${styles[side]}`}
                    style={{ 
                        top: `${position.top}px`, 
                        left: side === 'right' ? `${position.left}px` : 'auto',
                        right: side === 'left' ? `${window.innerWidth - position.left}px` : 'auto'
                    }}
                >
                    {text}
                </div>,
                document.body
            )}
        </div>
    );
};

export default Tooltip;
