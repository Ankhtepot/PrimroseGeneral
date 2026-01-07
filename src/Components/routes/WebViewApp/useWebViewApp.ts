import { useCrud } from '../../../hooks/useCrud.ts';

export interface PageData {
    id: number;
    description: string;
    url: string;
}

export const useWebViewApp = () => {
    const {
        data: pages,
        isLoading,
        isUpdating,
        error,
        fetchData: fetchPages,
        createItem: createPage,
        updateItem: updatePage,
        deleteItem: deletePage
    } = useCrud<PageData>({
        basePath: '/api/pages',
        fetchPath: '/api/pages/admin'
    });

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
