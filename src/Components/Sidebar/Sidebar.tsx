import styles from './Sidebar.module.scss';
import HealthCheck from "./HealthCheck/HealthCheck.tsx";
// import LoginPanel from "../LoginPanel/LoginPanel.tsx";
import {useContext, useEffect} from "react";
import {AdministrationContext} from "../../store/contexts.tsx";
import {LogOutIcon} from "lucide-react";
import ButtonCommon from "../Common/ButtonCommon/ButtonCommon.tsx";
import Tooltip from "../Common/Tooltip/Tooltip.tsx";
import ButtonPageSelect from "../ButtonPageSelect/ButtonPageSelect.tsx";
import {useLocation} from "react-router-dom";
import {pageRoutes} from "../../routing.tsx";

import logo from '@public/logo.svg';

function Sidebar() {
    const location = useLocation();
    const {
        isHealthy,
        isLoggingInInProgress,
        isLoggedIn,
        loginName,
        allowedRoles,
        loggedInUserHasAdminRights : isAdmin,
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
            <div className={styles.titleWrapper}>
                <h2>Primrose</h2>
                <img src={logo} alt="Primrose Logo" className={styles.logo}/>
            </div>
            <HealthCheck/>
            {isHealthy && !isLoggingInInProgress && isLoggedIn &&
                <div className={styles.loggedInContainer}>
                    <div className={styles.loggedInText}>Logged in as {loginName}.</div>
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
                        {pageRoutes.map((route) => {
                            const hasAccess = isAdmin || !route.requiredRoles || route.requiredRoles.some(role => allowedRoles.includes(role));
                            return (route.showInSidebar !== false && hasAccess &&
                                <ButtonPageSelect
                                    key={route.path}
                                    text={route.displayText || 'Add name!'}
                                    linkTo={route.path}
                                    active={location.pathname === route.path}
                                />
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    )
}

export default Sidebar;