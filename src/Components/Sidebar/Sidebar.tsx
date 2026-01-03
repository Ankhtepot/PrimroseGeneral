import styles from './Sidebar.module.scss';
import HealthCheck from "./HealthCheck/HealthCheck.tsx";
import LoginPanel from "../LoginPanel/LoginPanel.tsx";
import {useContext, useEffect} from "react";
import {AdministrationContext} from "../../store/contexts.tsx";
import {LogOutIcon} from "lucide-react";
import ButtonCommon from "../ButtonCommon/ButtonCommon.tsx";

function Sidebar() {
    const {isHealthy, isLoggingInInProgress, isLoggedIn, checkHealthStatus, logout} = useContext(AdministrationContext);
    
    useEffect(() => {
        checkHealthStatus();
    }, [])

    return (
        <div className={styles.container}>
            <h2>Navigation</h2>
            <HealthCheck/>
            {isHealthy && !isLoggedIn && !isLoggingInInProgress &&
                <LoginPanel/>}
            {isHealthy && !isLoggingInInProgress && isLoggedIn &&
                <div className={`${styles.loggedInContainer} flexRowCenter`}>
                    <div className={styles.loggedInText}>Logged in as admin.</div>
                    <ButtonCommon className={styles.logoutButton} onClick={logout}>
                        <LogOutIcon className={styles.logoutIcon}/>
                    </ButtonCommon>
                </div>
            }
            {isHealthy && isLoggingInInProgress &&
                <h3>Logging in...</h3>}
        </div>
    )
}

export default Sidebar;