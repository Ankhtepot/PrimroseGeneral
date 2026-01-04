import { useState, useEffect, useContext, useCallback } from 'react';
import { AdministrationContext } from '../../../store/contexts.tsx';
import Config from '../../../config.ts';

export interface PageData {
    id: number;
    description: string;
    url: string;
}

export const useWebViewApp = () => {
    const [pages, setPages] = useState<PageData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { loginToken } = useContext(AdministrationContext);

    const fetchPages = useCallback(async () => {
        if (!loginToken) return;
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${Config.apiUrl}/api/pages/admin`, {
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                },
            });
            if (!response.ok) {
                setError('Failed to fetch pages');
                setIsLoading(false);
                return;
            }
            const data = await response.json();
            setPages(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }, [loginToken]);

    const createPage = async (newPage: Omit<PageData, 'id'>) => {
        if (!loginToken) return;
        setIsUpdating(true);
        setError(null);
        try {
            const response = await fetch(`${Config.apiUrl}/api/pages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginToken}`,
                },
                body: JSON.stringify(newPage),
            });
            if (!response.ok) {
                setError('Failed to create page');
                setIsUpdating(false);
                return;
            }
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsUpdating(false);
        }
    };

    const updatePage = async (id: number, updatedPage: Partial<PageData>) => {
        if (!loginToken) return;
        setIsUpdating(true);
        setError(null);
        try {
            const response = await fetch(`${Config.apiUrl}/api/pages/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginToken}`,
                },
                body: JSON.stringify({ id, ...updatedPage }),
            });
            if (!response.ok) {
                setError('Failed to update page');
                setIsUpdating(false);
                return;
            }
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsUpdating(false);
        }
    };

    const deletePage = async (id: number) => {
        if (!loginToken) return;
        setIsUpdating(true);
        setError(null);
        try {
            const response = await fetch(`${Config.apiUrl}/api/pages/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${loginToken}`,
                },
            });
            if (!response.ok) {
                setError('Failed to delete page');
                setIsUpdating(false);
                return;
            }
            await fetchPages();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, [fetchPages]);

    return {
        pages,
        isLoading,
        isUpdating,
        error,
        fetchPages,
        createPage,
        updatePage,
        deletePage
    };
};
