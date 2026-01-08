import { useContext, useMemo } from 'react';
import { useCrud } from '../../../hooks/useCrud.ts';
import { AdministrationContext } from "../../../store/contexts.tsx";
import { ROLE_ADMIN, ROLE_WEBAPP } from "../../../store/constants.tsx";
import { ETableFieldType } from "../../Common/DatabaseTab/ETableFieldType.tsx";
import type { ColumnDefinition } from "../../Common/DatabaseTab/DatabaseTab.tsx";

export interface UserAdminData {
    id: number;
    username: string;
    passwordHash: string;
    isAdmin: boolean;
    role: string;
    createdAt: string;
}

export interface UserUpdateData extends Omit<UserAdminData, 'id' | 'createdAt' | 'passwordHash'> {
    password?: string;
}

const allSystemRoles: string[] = [
    ROLE_ADMIN,
    ROLE_WEBAPP,
];

const isMainAdmin = (allowedRoles: string[]) => allowedRoles.includes(ROLE_ADMIN);

export const useAdministration = () => {
    const {
        data: users,
        isLoading,
        isUpdating,
        error,
        fetchData: fetchUsers,
        createItem: createUser,
        updateItem: updateUser,
        deleteItem: deleteUser
    } = useCrud<UserAdminData, UserUpdateData, UserUpdateData>({
        basePath: '/api/admins'
    });

    const { allowedRoles, loggedInUserHasAdminRights: isAdmin } = useContext(AdministrationContext);

    const filteredUsers = useMemo(() => {
        if (isMainAdmin(allowedRoles)) return users;

        return users.filter((user) => {
            const rowRoles = (user.role || '').split(',').map(r => r.trim().toLowerCase());
            return allowedRoles.some(role => rowRoles.includes(role));
        });
    }, [users, allowedRoles]);

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
        { key: 'username', displayName: 'User Name' },
        { 
            key: 'password', 
            fieldType: ETableFieldType.PASSWORD,
            displayName: 'Password',
        },
        { key: 'passwordHash' },
        { key: 'isAdmin', fieldType: ETableFieldType.BOOLEAN, displayName: 'Is Admin' },
        { 
            key: 'role',
            displayName: 'Roles',
            fieldType: ETableFieldType.SELECT,
            selectOptions: allowedRoles.includes(ROLE_ADMIN) ? allSystemRoles : allSystemRoles.filter(r =>
                allowedRoles.some(ar => ar === r)
            )
        },
        { key: 'createdAt', displayName: 'Created At' }
    ];

    return {
        users: filteredUsers,
        isLoading,
        isUpdating,
        error,
        isAdmin,
        allowedRoles,
        fetchUsers,
        handleUpdate,
        handleDelete,
        handleCreate,
        columnDefinitions,
        isMainAdmin: isMainAdmin(allowedRoles)
    };
};
