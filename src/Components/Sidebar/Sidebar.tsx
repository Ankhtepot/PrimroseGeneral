import styles from './Sidebar.module.scss';
import HealthCheck from "./HealthCheck/HealthCheck.tsx";
import LoginPanel from "../LoginPanel/LoginPanel.tsx";
import {useContext, useEffect} from "react";
import {AdministrationContext} from "../../store/contexts.tsx";
import {LogOutIcon} from "lucide-react";
import ButtonCommon from "../Common/ButtonCommon/ButtonCommon.tsx";
import Tooltip from "../Common/Tooltip/Tooltip.tsx";

function Sidebar() {
    const {isHealthy,
        isLoggingInInProgress,
        isLoggedIn,
        checkHealthStatus,
        logout,
        tryLoadStoredToken,
    } = useContext(AdministrationContext);
    
    useEffect(() => {
        checkHealthStatus();
        tryLoadStoredToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <Tooltip text="Logout of current session">
                        <ButtonCommon className={styles.logoutButton} onClick={logout}>
                            <LogOutIcon className={styles.logoutIcon}/>
                        </ButtonCommon>
                    </Tooltip>
                </div>
            }
            {isHealthy && isLoggingInInProgress &&
                <h3>Logging in...</h3>}
        </div>
    )
}

export default Sidebar;