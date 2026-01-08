import { useState } from 'react';
import { type ColumnDefinition } from './DatabaseTab.tsx';
import { ETableFieldType } from './ETableFieldType.tsx';

const DEFAULT_COLUMN_DEFINITION = {
    fieldType: ETableFieldType.TEXT
};

interface UseDatabaseTabProps<T> {
    data: T[];
    headers?: string[];
    excludeFields?: Array<keyof T>;
    excludeOnCreate?: Array<keyof T>;
    createFields?: string[];
    readOnlyFields?: Array<keyof T>;
    columnDefinitions?: ColumnDefinition<T>[];
}

export const useDatabaseTab = <T extends object, C = T, U = T>({
    data,
    headers,
    excludeFields = [],
    excludeOnCreate = [],
    createFields,
    readOnlyFields = [],
    columnDefinitions = [],
}: UseDatabaseTabProps<T>) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Record<string, unknown>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [newValues, setNewValues] = useState<Record<string, unknown>>({});

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditValues(Object.fromEntries(
            Object.entries(data[index])
        ));
    };

    const handleSave = (index: number, onUpdate?: (index: number, updatedItem: U) => void) => {
        if (onUpdate) {
            const updatedItem = { ...data[index], ...editValues } as unknown as T;
            
            // Basic type conversion based on original data types if necessary
            Object.keys(editValues).forEach(key => {
                const originalValue = data[index][key as keyof T];
                const colDef = getColDef(key);
                
                if (typeof (originalValue as unknown) === 'number' && typeof editValues[key] === 'string') {
                    (updatedItem as Record<string, unknown>)[key] = Number(editValues[key]);
                } else if (colDef.fieldType === ETableFieldType.BOOLEAN) {
                    (updatedItem as Record<string, unknown>)[key] = editValues[key] === true || editValues[key] === 'true';
                }
            });

            onUpdate(index, updatedItem as unknown as U);
        }
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setIsCreating(false);
    };

    const handleInputChange = (key: string, value: string | boolean, isNew: boolean = false) => {
        if (isNew) {
            setNewValues({ ...newValues, [key]: value });
        } else {
            setEditValues({ ...editValues, [key]: value });
        }
    };

    const handleCreate = (onCreate?: (newItem: C) => void) => {
        if (onCreate) {
            const newItem = { ...newValues };
            
            // Type conversion for creation
            Object.keys(newValues).forEach(key => {
                const colDef = getColDef(key);
                if (colDef.fieldType === ETableFieldType.BOOLEAN) {
                    (newItem as Record<string, unknown>)[key] = newValues[key] === true || newValues[key] === 'true';
                }
                // We don't have original data to compare with for numeric fields, 
                // but we could potentially infer it if needed.
            });

            onCreate(newItem as unknown as C);
        }
        setIsCreating(false);
        setNewValues({});
    };

    const getKeys = (isCreationMode: boolean = false) => {
        let baseKeys: string[] = [];
        if (columnDefinitions.length > 0) {
            baseKeys = columnDefinitions.map(cd => String(cd.key));
        } else if (headers && headers.length > 0) {
            baseKeys = headers.map(h => h.toLowerCase().replace(/\s+/g, '_'));
        } else if (data.length > 0) {
            baseKeys = Object.keys(data[0]);
        } else if (isCreating && Object.keys(newValues).length > 0) {
            baseKeys = Object.keys(newValues);
        }

        if (isCreationMode) {
            if (createFields && createFields.length > 0) return createFields;
            if (excludeOnCreate.length > 0) {
                const excludes = excludeOnCreate.map(String);
                return baseKeys.filter(key => !excludes.includes(key));
            }
            return baseKeys;
        } else {
            const excludes = excludeFields.map(String);
            return baseKeys.filter(key => !excludes.includes(key));
        }
    };

    const keys = getKeys();
    const creationKeys = getKeys(true);
    const allTableKeys = Array.from(new Set([...keys, ...creationKeys]));

    const getDisplayName = (key: string) => {
        const colDef = columnDefinitions.find(cd => String(cd.key) === key);
        if (colDef?.displayName) return colDef.displayName;
        if (colDef?.headerContent) return colDef.headerContent;
        // Headers array has priority over default display names if no colDef display name
        if (headers && headers.length > 0) {
            const index = headers.map(h => h.toLowerCase().replace(/\s+/g, '_')).indexOf(key);
            if (index !== -1) return headers[index];
        }

        const s = String(key);
        return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
    };

    const getColDef = (key: string): ColumnDefinition<T> => {
        const found = columnDefinitions.find(cd => String(cd.key) === key);
        if (found) return found;
        
        const displayName = getDisplayName(key);
        return { 
            ...DEFAULT_COLUMN_DEFINITION, 
            key, 
            displayName: typeof displayName === 'string' ? displayName : undefined 
        };
    };

    const isFieldEditable = (key: string, isCreationMode: boolean = false) => {
        const stringKey = String(key);
        if (isCreationMode) {
            if (createFields && createFields.length > 0) return createFields.includes(stringKey);
            if (readOnlyFields.map(String).includes(stringKey)) return false;
            return creationKeys.includes(stringKey) || keys.includes(stringKey);
        } else {
            // Edit mode
            // If editFields is provided, it takes priority (though it's currently passed to TableRow directly, 
            // we should probably handle it here if we want to centralize). 
            // For now, let's stick to what's used in TableRow.
            return !readOnlyFields.map(String).includes(stringKey);
        }
    };

    return {
        editingIndex,
        editValues,
        isCreating,
        newValues,
        handleEdit,
        handleSave,
        handleCancel,
        handleInputChange,
        handleCreate,
        getDisplayName,
        getColDef,
        isFieldEditable,
        keys,
        creationKeys,
        allTableKeys,
        setIsCreating,
    };
};
