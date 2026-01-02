import styles from './MainPage.module.scss';
import Sidebar from "../Sidebar/Sidebar.tsx";

function MainPage() {
    return (
        <>
            <div className={styles.container}>
                <Sidebar />
                <div className={styles.content}></div>
            </div>
        </>
    )
}

export default MainPage;