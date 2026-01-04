import styles from './MainPage.module.scss';
import Sidebar from "../../Sidebar/Sidebar.tsx";
import {Outlet} from "react-router-dom";

function MainPage() {

    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.pageContainer}>
                <Outlet/>
            </div>
        </div>
    );
}

export default MainPage;