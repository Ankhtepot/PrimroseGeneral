import styles from './WebViewApp.module.scss';
import DatabaseTab from "../../Common/DatabaseTab/DatabaseTab.tsx";
import {useWebViewApp, type PageData} from "./useWebViewApp.ts";
import ButtonRefresh from "../../Common/ButtonRefresh/ButtonRefresh.tsx";

function WebViewApp() {
    const {pages,
        isLoading,
        isUpdating,
        error,
        fetchPages,
        handleCreate,
        handleUpdate,
        handleDelete
    } = useWebViewApp();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleWrapper}>
                    <h1>Web View App</h1>
                    <p>Manage pages displayed in the web view.</p>
                </div>
            </div>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.pagesTabHeader}>
                <h2>Pages table to manage what web pages show in the WebView carrier app</h2>
                <ButtonRefresh
                    onClick={fetchPages}
                    isLoading={isLoading}
                    tooltip="Refresh pages list"/>
            </div>

            <div className={styles.tableSection}>
                <DatabaseTab<PageData>
                    data={pages}
                    headers={['Description', 'Url']}
                    editable={true}
                    deletable={true}
                    creatable={true}
                    isUpdating={isUpdating}
                    excludeFields={['id']}
                    maxHeight="600px"
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                />
            </div>
        </div>
    );
}

export default WebViewApp;