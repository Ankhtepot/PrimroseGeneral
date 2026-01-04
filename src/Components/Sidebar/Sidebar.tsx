import styles from './Sidebar.module.scss';
import HealthCheck from "./HealthCheck/HealthCheck.tsx";
import LoginPanel from "../LoginPanel/LoginPanel.tsx";
import {useContext, useEffect} from "react";
import {AdministrationContext} from "../../store/contexts.tsx";
import {LogOutIcon} from "lucide-react";
import ButtonCommon from "../Common/ButtonCommon/ButtonCommon.tsx";
import Tooltip from "../Common/Tooltip/Tooltip.tsx";
import ButtonPageSelect from "../ButtonPageSelect/ButtonPageSelect.tsx";
import {ADMINISTRATION_PAGE, WEB_VIEW_PAGE} from "../../store/constants.tsx";
import {useLocation} from "react-router-dom";

function Sidebar() {
    const location = useLocation();
    const {
        isHealthy,
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
                <div className={styles.loggedInContainer}>
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
            {isHealthy && isLoggedIn && (
                <>
                    <h2>Pages</h2>
                    <div className={`flexColCenter ${styles.linksContainer}`}>
                        <ButtonPageSelect text={"Administration"} linkTo={ADMINISTRATION_PAGE}
                                          active={location.pathname === ADMINISTRATION_PAGE}/>
                        <ButtonPageSelect text={"Web View App"} linkTo={WEB_VIEW_PAGE}
                                          active={location.pathname === WEB_VIEW_PAGE}/>
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar;