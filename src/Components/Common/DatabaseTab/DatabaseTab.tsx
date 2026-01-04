import { useState } from 'react';
import styles from './DatabaseTab.module.scss';
import { Edit2, Trash2, Plus, Check, X, Loader2 } from 'lucide-react';

interface DatabaseTabProps<T extends object> {
    headers?: string[];
    data: T[];
    editable?: boolean;
    deletable?: boolean;
    creatable?: boolean;
    isUpdating?: boolean;
    excludeFields?: Array<keyof T>;
    readOnlyFields?: Array<keyof T>;
    maxWidth?: string;
    maxHeight?: string;
    onUpdate?: (index: number, updatedItem: T) => void;
    onDelete?: (index: number) => void;
    onCreate?: (newItem: T) => void;
}

const DatabaseTab = <T extends object>({
    headers,
    data,
    editable = false,
    deletable = false,
    creatable = false,
    isUpdating = false,
    excludeFields = [],
    readOnlyFields = [],
    maxWidth,
    maxHeight,
    onUpdate,
    onDelete,
    onCreate,
}: DatabaseTabProps<T>) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Partial<T>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [newValues, setNewValues] = useState<Partial<T>>({});

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditValues({ ...data[index] });
    };

    const handleSave = (index: number) => {
        if (onUpdate) {
            onUpdate(index, { ...data[index], ...editValues } as T);
        }
        setEditingIndex(null);
    };

    const handleCancel = () => {
        setEditingIndex(null);
        setIsCreating(false);
    };

    const handleInputChange = (key: keyof T, value: string, isNew: boolean = false) => {
        const typedValue = value as unknown as T[keyof T];
        if (isNew) {
            setNewValues({ ...newValues, [key]: typedValue });
        } else {
            setEditValues({ ...editValues, [key]: typedValue });
        }
    };

    const handleCreate = () => {
        if (onCreate) {
            onCreate(newValues as T);
        }
        setIsCreating(false);
        setNewValues({});
    };

    const getKeys = () => {
        let keys: Array<keyof T> = [];
        if (headers && headers.length > 0) {
            keys = headers.map(h => h.toLowerCase().replace(/\s+/g, '_')) as Array<keyof T>;
        } else if (data.length > 0) {
            keys = Object.keys(data[0]) as Array<keyof T>;
        } else if (isCreating && Object.keys(newValues).length > 0) {
            keys = Object.keys(newValues) as Array<keyof T>;
        }
        return keys.filter(key => !excludeFields.includes(key));
    };

    const getDisplayName = (key: keyof T) => {
        if (headers && headers.length > 0) {
            const index = headers.map(h => h.toLowerCase().replace(/\s+/g, '_')).indexOf(key as string);
            if (index !== -1) return headers[index];
        }
        const s = String(key);
        return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
    };

    const keys = getKeys();

    return (
        <div className={styles.wrapper} style={{ maxWidth }}>
            {isUpdating && (
                <div className={styles.overlay}>
                    <Loader2 className={styles.spinner} size={48} />
                </div>
            )}
            <div className={styles.container} style={{ maxHeight }}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            {keys.map((key) => (
                                <th key={String(key)}>{getDisplayName(key)}</th>
                            ))}
                            {(editable || deletable) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {keys.map((key) => (
                                    <td key={String(key)}>
                                        {editingIndex === rowIndex && !readOnlyFields.includes(key) ? (
                                            <input
                                                type="text"
                                                value={String(editValues[key] ?? '')}
                                                onChange={(e) => handleInputChange(key, e.target.value)}
                                                className={styles.input}
                                            />
                                        ) : (
                                            String(row[key] ?? '')
                                        )}
                                    </td>
                                ))}
                                {(editable || deletable) && (
                                    <td className={styles.actions}>
                                        {editingIndex === rowIndex ? (
                                            <>
                                                <button onClick={() => handleSave(rowIndex)} className={styles.saveBtn}>
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={handleCancel} className={styles.cancelBtn}>
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {editable && (
                                                    <button onClick={() => handleEdit(rowIndex)} className={styles.editBtn}>
                                                        <Edit2 size={18} />
                                                    </button>
                                                )}
                                                {deletable && (
                                                    <button onClick={() => onDelete && onDelete(rowIndex)} className={styles.deleteBtn}>
                                                        <Trash2 size={18} />
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </td>
                                )}
                            </tr>
                        ))}
                        {isCreating && (
                            <tr>
                                {keys.map((key) => (
                                    <td key={String(key)}>
                                        {!readOnlyFields.includes(key) ? (
                                            <input
                                                type="text"
                                                value={String(newValues[key] ?? '')}
                                                onChange={(e) => handleInputChange(key, e.target.value, true)}
                                                className={styles.input}
                                                placeholder={getDisplayName(key)}
                                            />
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                ))}
                                <td className={styles.actions}>
                                    <button onClick={handleCreate} className={styles.saveBtn}>
                                        <Check size={18} />
                                    </button>
                                    <button onClick={handleCancel} className={styles.cancelBtn}>
                                        <X size={18} />
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {creatable && !isCreating && (
                <div className={styles.addBtnWrapper}>
                    <button className={styles.addBtn} onClick={() => setIsCreating(true)}>
                        <Plus size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default DatabaseTab;
