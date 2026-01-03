import { useContext } from 'react';
import styles from './HealthCheck.module.scss';
import { RefreshCw, CheckCircle2, XCircle } from 'lucide-react';
import { AdministrationContext } from '../../../store/contexts';

function HealthCheck() {
    const { isHealthy, isHealthCheckInProgress, checkHealthStatus } = useContext(AdministrationContext);

    return (
        <div className={styles.container}>
            <div className={styles.textPart}>
                <div className={styles.title}>Health Check</div>
                <p className={styles.checkTimeText}>Check Time: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className={styles.statusPart}>
                <button className={styles.refreshButton} onClick={checkHealthStatus} disabled={isHealthCheckInProgress}>
                    <RefreshCw className={`${styles.icon} ${isHealthCheckInProgress ? styles.spinning : ''}`} />
                </button>
                {!isHealthCheckInProgress && (
                    isHealthy ? (
                        <CheckCircle2 className={`${styles.icon} ${styles.healthy}`} />
                    ) : (
                        <XCircle className={`${styles.icon} ${styles.unhealthy}`} />
                    )
                )}
            </div>
        </div>
    );
}

export default HealthCheck;
