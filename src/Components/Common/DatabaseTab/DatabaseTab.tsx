import {type JSX} from 'react';
import styles from './DatabaseTab.module.scss';
import {Check, Loader2, Plus, X} from 'lucide-react';
import { ETableFieldType } from "./ETableFieldType.tsx";
import { useDatabaseTab } from './useDatabaseTab.ts';
import { TableRow } from './components/TableRow';
import { InputField } from './components/InputField';

export interface ColumnDefinition<T> {
    key: keyof T | string;
    headerStyle?: string;
    headerContent?: JSX.Element;
    cellStyle?: string;
    cellContent?: (row: T) => JSX.Element;
    fieldType?: ETableFieldType;
    selectOptions?: string[];
    displayName?: string;
}

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
    const {
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
        allTableKeys,
        setIsCreating,
    } = useDatabaseTab<T, C, U>({
        data,
        headers,
        excludeFields,
        excludeOnCreate,
        createFields,
        readOnlyFields,
        columnDefinitions,
    });

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
                        {data.map((row, rowIndex) => (
                            <TableRow
                                key={rowIndex}
                                row={row}
                                rowIndex={rowIndex}
                                allTableKeys={allTableKeys}
                                keys={keys}
                                editFields={editFields}
                                isFieldEditable={isFieldEditable}
                                isDisabled={disabledLines.includes(rowIndex)}
                                editingIndex={editingIndex}
                                editValues={editValues}
                                editable={editable}
                                deletable={deletable}
                                getColDef={getColDef}
                                onEdit={handleEdit}
                                onSave={(index) => handleSave(index, onUpdate)}
                                onCancel={handleCancel}
                                onDelete={onDelete}
                                onInputChange={handleInputChange}
                            />
                        ))}
                        {isCreating && (
                            <tr>
                                {allTableKeys.map((key) => {
                                    const colDef = getColDef(key);
                                    const isEditable = isFieldEditable(key, true);
                                    const value = newValues[key];
                                    
                                    return (
                                        <td key={key} className={colDef.cellStyle}>
                                            {isEditable ? (
                                                <InputField
                                                    colDef={colDef}
                                                    keyName={key}
                                                    value={value}
                                                    onChange={(k, v) => handleInputChange(k, v, true)}
                                                />
                                            ) : (
                                                '-'
                                            )}
                                        </td>
                                    );
                                })}
                                <td className={styles.actions}>
                                    <button onClick={() => handleCreate(onCreate)} className={styles.saveBtn}>
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
