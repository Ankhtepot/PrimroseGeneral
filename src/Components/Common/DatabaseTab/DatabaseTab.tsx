import {type JSX, useState} from 'react';
import styles from './DatabaseTab.module.scss';
import {Check, Edit2, Loader2, Plus, Trash2, X} from 'lucide-react';
import { ETableFieldType } from "./ETableFieldType.tsx";

export interface ColumnDefinition<T> {
    key: keyof T | string;
    headerStyle?: string;
    headerContent?: JSX.Element;
    cellStyle?: string;
    cellContent?: (row: T) => JSX.Element;
    fieldType?: ETableFieldType;
    selectOptions?: string[];
}

const DEFAULT_COLUMN_DEFINITION = {
    fieldType: ETableFieldType.TEXT
};

interface DatabaseTabProps<T extends object, C = T, U = T> {
    headers?: string[];
    data: T[];
    editable?: boolean;
    deletable?: boolean;
    creatable?: boolean;
    isUpdating?: boolean;
    excludeFields?: Array<keyof T>;
    excludeOnCreate?: Array<keyof T>;
    createFields?: string[];
    editFields?: string[];
    readOnlyFields?: Array<keyof T>;
    maxWidth?: string;
    maxHeight?: string;
    onUpdate?: (index: number, updatedItem: U) => void;
    onDelete?: (index: number) => void;
    onCreate?: (newItem: C) => void;
    disabledLines?: number[];
    columnDefinitions?: ColumnDefinition<T>[];
}

const DatabaseTab = <T extends object, C = T, U = T>({
    headers,
    data,
    editable = false,
    deletable = false,
    creatable = false,
    isUpdating = false,
    excludeFields = [],
    excludeOnCreate = [],
    createFields,
    editFields,
    readOnlyFields = [],
    maxWidth,
    maxHeight,
    onUpdate,
    onDelete,
    onCreate,
    disabledLines = [],
    columnDefinitions = [],
}: DatabaseTabProps<T, C, U>) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editValues, setEditValues] = useState<Record<string, any>>({});
    const [isCreating, setIsCreating] = useState(false);
    const [newValues, setNewValues] = useState<Record<string, any>>({});

    const handleEdit = (index: number) => {
        setEditingIndex(index);
        setEditValues({ ...data[index] });
    };

    const handleSave = (index: number) => {
        if (onUpdate) {
            onUpdate(index, { ...data[index], ...editValues } as unknown as U);
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

    const handleCreate = () => {
        if (onCreate) {
            onCreate(newValues as unknown as C);
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

    const getDisplayName = (key: string) => {
        const colDef = columnDefinitions.find(cd => String(cd.key) === key);
        if (colDef?.headerContent) return colDef.headerContent;

        if (headers && headers.length > 0) {
            const index = headers.map(h => h.toLowerCase().replace(/\s+/g, '_')).indexOf(key);
            if (index !== -1) return headers[index];
        }
        const s = String(key);
        return s.charAt(0).toUpperCase() + s.slice(1).replace(/_/g, ' ');
    };

    const getColDef = (key: string) => {
        return columnDefinitions.find(cd => String(cd.key) === key) || { ...DEFAULT_COLUMN_DEFINITION, key };
    };

    const keys = getKeys();
    const creationKeys = getKeys(true);
    const allTableKeys = Array.from(new Set([...keys, ...creationKeys]));

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
                            {allTableKeys.map((key) => {
                                const colDef = getColDef(key);
                                return (
                                    <th key={key} className={colDef.headerStyle}>
                                        {getDisplayName(key)}
                                    </th>
                                );
                            })}
                            {(editable || deletable) && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => {
                            const isDisabled = disabledLines.includes(rowIndex);
                            return (
                                <tr key={rowIndex} className={isDisabled ? styles.disabled : ''}>
                                    {allTableKeys.map((key) => {
                                        const colDef = getColDef(key);
                                        const isShown = keys.includes(key);
                                        const isEditable = isShown && (editFields ? editFields.includes(key) : !readOnlyFields.map(String).includes(key));
                                        const isEditing = editingIndex === rowIndex && isEditable && !isDisabled;
                                        return (
                                            <td key={key} className={colDef.cellStyle}>
                                                {isEditing ? (
                                                    colDef.fieldType === ETableFieldType.BOOLEAN ? (
                                                        <select
                                                            value={String(editValues[key] ?? false)}
                                                            onChange={(e) => handleInputChange(key, e.target.value === 'true')}
                                                            className={styles.input}
                                                        >
                                                            <option value="true" className={styles.option}>true</option>
                                                            <option value="false" className={styles.option}>false</option>
                                                        </select>
                                                    ) : colDef.fieldType === ETableFieldType.SELECT && colDef.selectOptions ? (
                                                        <select
                                                            multiple
                                                            value={String(editValues[key] ?? '').split(',').map(s => s.trim()).filter(Boolean)}
                                                            onChange={(e) => {
                                                                const values = Array.from(e.target.selectedOptions).map(opt => opt.value);
                                                                handleInputChange(key, values.join(','));
                                                            }}
                                                            className={styles.selectMultiple}
                                                        >
                                                            {colDef.selectOptions.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : colDef.selectOptions ? (
                                                        <select
                                                            value={String(editValues[key] ?? '')}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            className={styles.input}
                                                        >
                                                            {colDef.selectOptions.map(opt => (
                                                                <option key={opt} value={opt}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : colDef.fieldType === ETableFieldType.PASSWORD ? (
                                                        <input
                                                            type="password"
                                                            value={String(editValues[key] ?? '')}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            className={styles.input}
                                                            autoComplete="new-password"
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={String(editValues[key] ?? '')}
                                                            onChange={(e) => handleInputChange(key, e.target.value)}
                                                            className={styles.input}
                                                        />
                                                    )
                                                ) : (
                                                    isShown ? (colDef.cellContent ? colDef.cellContent(row) : String((row as any)[key] ?? '')) : ''
                                                )}
                                            </td>
                                        );
                                    })}
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
                                                    {editable && !isDisabled && (
                                                        <button onClick={() => handleEdit(rowIndex)} className={styles.editBtn}>
                                                            <Edit2 size={18} />
                                                        </button>
                                                    )}
                                                    {deletable && !isDisabled && (
                                                        <button onClick={() => onDelete && onDelete(rowIndex)} className={styles.deleteBtn}>
                                                            <Trash2 size={18} />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                        {isCreating && (
                            <tr>
                                {allTableKeys.map((key) => {
                                    const colDef = getColDef(key);
                                    const isEditable = createFields ? createFields.includes(key) : (!readOnlyFields.map(String).includes(key) && creationKeys.includes(key));
                                    return (
                                        <td key={key} className={colDef.cellStyle}>
                                            {isEditable ? (
                                                colDef.fieldType === ETableFieldType.BOOLEAN ? (
                                                    <select
                                                        value={String(newValues[key] ?? false)}
                                                        onChange={(e) => handleInputChange(key, e.target.value === 'true', true)}
                                                        className={styles.input}
                                                    >
                                                        <option value="true">true</option>
                                                        <option value="false">false</option>
                                                    </select>
                                                ) : colDef.fieldType === ETableFieldType.SELECT && colDef.selectOptions ? (
                                                    <select
                                                        multiple
                                                        value={String(newValues[key] ?? '').split(',').map(s => s.trim()).filter(Boolean)}
                                                        onChange={(e) => {
                                                            const values = Array.from(e.target.selectedOptions).map(opt => opt.value);
                                                            handleInputChange(key, values.join(','), true);
                                                        }}
                                                        className={styles.selectMultiple}
                                                    >
                                                        {colDef.selectOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : colDef.selectOptions ? (
                                                    <select
                                                        value={String(newValues[key] ?? colDef.selectOptions[0])}
                                                        onChange={(e) => handleInputChange(key, e.target.value, true)}
                                                        className={styles.input}
                                                    >
                                                        {colDef.selectOptions.map(opt => (
                                                            <option key={opt} value={opt}>{opt}</option>
                                                        ))}
                                                    </select>
                                                ) : colDef.fieldType === ETableFieldType.PASSWORD ? (
                                                    <input
                                                        type="password"
                                                        value={String(newValues[key] ?? '')}
                                                        onChange={(e) => handleInputChange(key, e.target.value, true)}
                                                        className={styles.input}
                                                        autoComplete="new-password"
                                                        placeholder={typeof getDisplayName(key) === 'string' ? (getDisplayName(key) as string) : ''}
                                                    />
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={String(newValues[key] ?? '')}
                                                        onChange={(e) => handleInputChange(key, e.target.value, true)}
                                                        className={styles.input}
                                                        placeholder={typeof getDisplayName(key) === 'string' ? (getDisplayName(key) as string) : ''}
                                                    />
                                                )
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    );
                                })}
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
