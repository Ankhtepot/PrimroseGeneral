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

    const handleUpdate = (_index: number, updatedItem: PageData) => {
        updatePage(updatedItem.id, updatedItem);
    };

    const handleCreate = (newItem: PageData) => {
        createPage(newItem);
    };

    const handleDelete = (index: number) => {
        const pageToDelete = pages[index];
        if (pageToDelete) {
            deletePage(pageToDelete.id);
        }
    };

    return {
        pages,
        isLoading,
        isUpdating,
        error,
        fetchPages,
        handleCreate,
        handleUpdate,
        handleDelete
    };
};
