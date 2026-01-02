import styles from './HealthCheck.module.scss';

function HealthCheck() {
    return (
        <div className={styles.container}>
            <div className={styles.textPart}>
                <div className={styles.title}>Health Check</div>
                <p className={styles.checkTimeText}>Check Time: {new Date().toLocaleTimeString()}</p>
            </div>
            <div className={styles.statusPart}>

            </div>
        </div>
    );
}

export default HealthCheck;
