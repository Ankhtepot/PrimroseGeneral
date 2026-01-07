import styles from "./EntryPage.module.scss";
import {useContext} from "react";
import {AdministrationContext} from "../../../store/contexts.tsx";
import LoginPanel from "../../LoginPanel/LoginPanel.tsx";
import {ArrowBigLeft} from "lucide-react";

function EntryPage() {
    const {isHealthy, isLoggedIn, loginName} = useContext(AdministrationContext);

    return (
        <div className={styles.entryPageContainer}>
            <h1>Welcome to the Primrose General</h1>
            {!isHealthy &&
                <p>Application is not healthy. Refresh state in the Sidebar, if the issue persist, Please contact administrator.</p>}
            {isHealthy && !isLoggedIn &&
                <>
                    <p>Log in using the form to access the administration areas.</p>
                    <LoginPanel />
                </>
            }
            {isHealthy && isLoggedIn &&
                <>
                    <p>You are logged in as {loginName}.</p>
                    <div className={styles.choseAdministrationAreaBlock}>
                        <ArrowBigLeft className={styles.icon} />
                        <p>Choose an administration area in the Sidebar.</p>
                    </div>
                </>
            }
        </div>
    );
}

export default EntryPage;