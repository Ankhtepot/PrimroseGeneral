import { useState, useEffect, useContext, useCallback } from 'react';
import { AdministrationContext } from '../store/contexts.tsx';
import Config from '../config.ts';

interface CrudOptions {
    basePath: string;
    adminPath?: string; // Kept for backward compatibility, same as fetchPath
    fetchPath?: string;
    createPath?: string;
    updatePath?: string;
    deletePath?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

async function getErrorFromBody(response: Response) : Promise<string> {
    const error = await response.text();
    return error ? `\n${error}` : '';
}

export const useCrud = <T extends { id: number | string }, C = Omit<T, 'id'>, U = Partial<C>>(options: CrudOptions) => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { loginToken } = useContext(AdministrationContext);

    const { 
        basePath, 
        fetchPath,
        createPath,
        updatePath,
        deletePath,
        onSuccess, 
        onError 
    } = options;

    const fetchData = useCallback(async () => {
        if (!loginToken) return;
        setIsLoading(true);
        setError(null);
        try {
            const finalFetchPath = fetchPath || basePath;
            const response = await fetch(`${Config.apiUrl}${finalFetchPath}`, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                },
            });
            if (!response.ok) {
                let errMessage = `Failed to fetch data from ${finalFetchPath}`;
                errMessage += await getErrorFromBody(response);
                setError(errMessage);
                onError?.(errMessage);
                setIsLoading(false);
                return;
            }
            const result = await response.json();
            setData(result);
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errMessage);
            onError?.(errMessage);
        } finally {
            setIsLoading(false);
        }
    }, [loginToken, basePath, fetchPath, onError]);

    const createItem = async (newItem: C) => {
        if (!loginToken) return;
        setIsUpdating(true);
        setError(null);
        try {
            const finalCreatePath = createPath || basePath;
            const response = await fetch(`${Config.apiUrl}${finalCreatePath}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginToken}`,
                },
                body: JSON.stringify(newItem),
            });
            if (!response.ok) {
                let errMessage = 'Failed to create item';
                errMessage += await getErrorFromBody(response);
                setError(errMessage);
                onError?.(errMessage);
                setIsUpdating(false);
                return;
            }
            onSuccess?.();
            await fetchData();
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errMessage);
            onError?.(errMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const updateItem = async (id: number | string, updatedItem: U) => {
        if (!loginToken) return;
        setIsUpdating(true);
        setError(null);
        try {
            const finalUpdatePath = updatePath || `${basePath}/${id}`;
            const response = await fetch(`${Config.apiUrl}${finalUpdatePath}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginToken}`,
                },
                body: JSON.stringify(updatedItem),
            });
            if (!response.ok) {
                let errMessage = 'Failed to update item';
                errMessage += await getErrorFromBody(response);
                setError(errMessage);
                onError?.(errMessage);
                setIsUpdating(false);
                return;
            }
            onSuccess?.();
            await fetchData();
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errMessage);
            onError?.(errMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    const deleteItem = async (id: number | string) => {
        if (!loginToken) return;
        setIsUpdating(true);
        setError(null);
        try {
            const finalDeletePath = deletePath || `${basePath}/${id}`;
            const response = await fetch(`${Config.apiUrl}${finalDeletePath}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                },
            });
            if (!response.ok) {
                let errMessage = 'Failed to delete item';
                errMessage += await getErrorFromBody(response);
                setError(errMessage);
                onError?.(errMessage);
                setIsUpdating(false);
                return;
            }
            onSuccess?.();
            await fetchData();
        } catch (err) {
            const errMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errMessage);
            onError?.(errMessage);
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return {
        data,
        isLoading,
        isUpdating,
        error,
        fetchData,
        createItem,
        updateItem,
        deleteItem
    };
};
