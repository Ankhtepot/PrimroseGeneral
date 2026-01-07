import { useCrud } from '../../../hooks/useCrud.ts';
import type { UserUpdateData } from './Admin.tsx';

export interface UserAdminData {
    id: number;
    username: string;
    passwordHash: string;
    isAdmin: boolean;
    role: string;
    createdAt: string;
}

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

    return {
        users,
        isLoading,
        isUpdating,
        error,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser
    };
};
