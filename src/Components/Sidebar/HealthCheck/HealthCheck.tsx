import { useContext, useEffect, useRef } from 'react';
import styles from './HealthCheck.module.scss';
import { RefreshCw, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { AdministrationContext } from '../../../store/contexts';
import Tooltip from '../../Common/Tooltip/Tooltip';

function HealthCheck() {
    const { isHealthy, isHealthCheckInProgress, isRateLimited, lastHealthcheckTime, checkHealthStatus } = useContext(AdministrationContext);
    const initialCheckDone = useRef(false);

    useEffect(() => {
        if (!initialCheckDone.current) {
            checkHealthStatus();
            initialCheckDone.current = true;
        }
    }, [checkHealthStatus]);

    return (
        <div className={styles.container}>
            {!isRateLimited &&
                <div className={styles.textPart}>
                <div className={styles.title}>Health Check</div>
                <p className={styles.checkTimeText}>Check Time: {lastHealthcheckTime.toLocaleTimeString()}</p>
            </div>}
            {isRateLimited && (
                <div className={styles.rateLimitNotice}>
                    <AlertTriangle size={14} />
                    <span>Rate limited. Wait 60s.</span>
                </div>
            )}
            {!isRateLimited && <div className={styles.statusPart}>
                <Tooltip text="Refresh health status">
                    <button
                        className={styles.refreshButton}
                        onClick={checkHealthStatus}
                        disabled={isHealthCheckInProgress || isRateLimited}
                    >
                        <RefreshCw className={`${styles.icon} ${isHealthCheckInProgress ? styles.spinning : ''}`}/>
                    </button>
                </Tooltip>
                {!isHealthCheckInProgress && (
                    isHealthy ? (
                        <CheckCircle2 className={`${styles.icon} ${styles.healthy}`}/>
                    ) : (
                        <XCircle className={`${styles.icon} ${styles.unhealthy}`}/>
                    )
                )}
            </div>}
        </div>
    );
}

export default HealthCheck;
