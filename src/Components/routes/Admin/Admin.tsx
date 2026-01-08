import styles from './Admin.module.scss';
import DatabaseTab from "../../Common/DatabaseTab/DatabaseTab.tsx";
import { useAdministration, type UserAdminData, type UserUpdateData } from "./useAdministration.ts";
import ButtonRefresh from "../../Common/ButtonRefresh/ButtonRefresh.tsx";

function Admin() {
    const { 
        users, 
        isLoading, 
        isUpdating, 
        error, 
        isAdmin, 
        fetchUsers, 
        handleUpdate, 
        handleDelete, 
        handleCreate, 
        columnDefinitions,
        isMainAdmin
    } = useAdministration();

    const finalColumnDefinitions = columnDefinitions.map(col => {
        if (col.key === 'password') {
            return {
                ...col,
                cellContent: () => <span>******</span>,
            };
        }
        return col;
    });

    return (
        <div className={styles.container}>
            <h1>Administration</h1>
            <p>Welcome to the administration panel.</p>

            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.tableSection}>
                <div className={styles.pagesTabHeader}>
                    <h2>User Management</h2>
                    <ButtonRefresh
                        onClick={fetchUsers}
                        isLoading={isLoading}
                        tooltip="Refresh users list"/>
                </div>
                <DatabaseTab<UserAdminData, UserUpdateData, UserUpdateData>
                    data={users}
                    editable={isAdmin}
                    deletable={isAdmin}
                    creatable={isAdmin}
                    isUpdating={isUpdating}
                    excludeFields={['id', 'passwordHash']}
                    createFields={['username', 'password', 'isAdmin', 'role']}
                    editFields={['username', 'password', 'isAdmin', 'role']}
                    readOnlyFields={['createdAt']}
                    disabledLines={isMainAdmin ? [0] : []} // The first line is not editable
                    columnDefinitions={finalColumnDefinitions}
                    maxHeight="600px"
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    onCreate={handleCreate}
                />
            </div>
        </div>
    );
}

export default Admin;