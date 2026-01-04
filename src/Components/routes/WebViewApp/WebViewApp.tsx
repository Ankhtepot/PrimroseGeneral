import styles from './WebViewApp.module.scss';

function WebViewApp() {
    return (
        <div className={styles.container}>
            <div className={styles.titleWrapper}>
                <h1>Web View App</h1>
                <p>Welcome to the administration panel.</p>
            </div>
        </div>
    );
}

export default WebViewApp;