import styles from './Sidebar.module.scss';
import HealthCheck from "./HealthCheck/HealthCheck.tsx";

function Sidebar() {
    return (
        <div className={styles.container}>
            <h2>Navigation</h2>
            <HealthCheck />
        </div>
    )
}

export default Sidebar;