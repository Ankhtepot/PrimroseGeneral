import React from 'react';
import styles from './ButtonCommon.module.scss';

interface ButtonCommonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

function ButtonCommon({ children, className, ...props }: ButtonCommonProps) {
    return (
        <button 
            className={`${styles.button} ${className || ''}`} 
            {...props}
        >
            {children}
        </button>
    );
}

export default ButtonCommon;