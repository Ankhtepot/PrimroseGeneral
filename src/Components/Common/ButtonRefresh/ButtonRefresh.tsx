import React from 'react';
import { RefreshCw } from 'lucide-react';
import styles from './ButtonRefresh.module.scss';
import Tooltip from '../Tooltip/Tooltip.tsx';

interface ButtonRefreshProps {
    onClick: () => void;
    isLoading?: boolean;
    className?: string;
    tooltip?: string;
}

const ButtonRefresh: React.FC<ButtonRefreshProps> = ({ 
    onClick, 
    isLoading = false, 
    className = '',
    tooltip = 'Refresh data'
}) => {
    return (
        <Tooltip text={tooltip}>
            <button 
                onClick={onClick} 
                className={`${styles.button} ${isLoading ? styles.loading : ''} ${className}`}
                disabled={isLoading}
            >
                <RefreshCw size={20} className={styles.icon} />
            </button>
        </Tooltip>
    );
};

export default ButtonRefresh;
