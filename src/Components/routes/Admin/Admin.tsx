import { useContext, useMemo } from 'react';
import styles from './Admin.module.scss';
import DatabaseTab, { type ColumnDefinition } from "../../Common/DatabaseTab/DatabaseTab.tsx";
import { useAdministration, type UserAdminData } from "./useAdministration.ts";
import { AdministrationContext } from "../../../store/contexts.tsx";
import { DATA_ROLE_ADMIN, DATA_ROLE_WEBAPP } from "../../../store/constants.tsx";
import { ETableFieldType } from "../../Common/DatabaseTab/ETableFieldType.tsx";
import ButtonRefresh from "../../Common/ButtonRefresh/ButtonRefresh.tsx";

export interface UserUpdateData extends Omit<UserAdminData, 'id' | 'createdAt' | 'passwordHash'> {
    password?: string;
}

const allSystemRoles: string[] = [
    DATA_ROLE_ADMIN,
    DATA_ROLE_WEBAPP,
];

function Admin() {
    const { users, isLoading, isUpdating, error, fetchUsers, createUser, updateUser, deleteUser } = useAdministration();
    const { allowedRoles, isSystemAdmin } = useContext(AdministrationContext);

    const filteredUsers = useMemo(() => {
        if (isSystemAdmin) return users;
        
        return users.filter((user, index) => {
            // The first line is always visible (protected system account)
            if (index === 0) return true;
            
            // Check if any of the user's roles are present in the row's role string
            const rowRoles = (user.role || '').split(',').map(r => r.trim().toLowerCase());
            return allowedRoles.some(role => rowRoles.includes(role.toLowerCase()));
        });
    }, [users, isSystemAdmin, allowedRoles]);

    const handleUpdate = (index: number, updatedItem: UserUpdateData) => {
        const user = filteredUsers[index];
        updateUser(user.id, updatedItem);
    };

    const handleDelete = (index: number) => {
        const user = filteredUsers[index];
        deleteUser(user.id);
    };

    const handleCreate = (newItem: UserUpdateData) => {
        createUser(newItem);
    };

    const columnDefinitions: ColumnDefinition<UserAdminData>[] = [
        { key: 'username' },
        { 
            key: 'password', 
            fieldType: ETableFieldType.PASSWORD,
            cellContent: () => <span>******</span>
        },
        { key: 'passwordHash' },
        { key: 'isAdmin', fieldType: ETableFieldType.BOOLEAN },
        { 
            key: 'role', 
            fieldType: ETableFieldType.SELECT,
            selectOptions: allowedRoles.includes(DATA_ROLE_ADMIN) ? allSystemRoles : allSystemRoles.filter(r =>
                allowedRoles.some(ar => ar.toLowerCase() === r.toLowerCase())
            )
        },
        { key: 'createdAt' }
    ];

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
                    data={filteredUsers}
                    editable={true}
                    deletable={isSystemAdmin}
                    creatable={isSystemAdmin}
                    isUpdating={isUpdating}
                    excludeFields={['id', 'passwordHash']}
                    createFields={['username', 'password', 'isAdmin', 'role']}
                    editFields={['username', 'password', 'isAdmin', 'role']}
                    readOnlyFields={['createdAt']}
                    disabledLines={[0]} // The first line is not editable
                    columnDefinitions={columnDefinitions}
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