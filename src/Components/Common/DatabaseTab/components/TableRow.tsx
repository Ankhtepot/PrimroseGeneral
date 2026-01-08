import { Check, Edit2, Trash2, X } from 'lucide-react';
import styles from '../DatabaseTab.module.scss';
import { TableCell } from './TableCell';
import { type ColumnDefinition } from '../DatabaseTab';

interface TableRowProps<T> {
    row: T;
    rowIndex: number;
    allTableKeys: string[];
    keys: string[];
    editFields?: string[];
    isFieldEditable: (key: string, isCreationMode?: boolean) => boolean;
    isDisabled: boolean;
    editingIndex: number | null;
    editValues: Record<string, unknown>;
    editable: boolean;
    deletable: boolean;
    getColDef: (key: string) => ColumnDefinition<T>;
    onEdit: (index: number) => void;
    onSave: (index: number) => void;
    onCancel: () => void;
    onDelete?: (index: number) => void;
    onInputChange: (key: string, value: string | boolean) => void;
}

export const TableRow = <T extends object>({
    row,
    rowIndex,
    allTableKeys,
    keys,
    editFields,
    isFieldEditable,
    isDisabled,
    editingIndex,
    editValues,
    editable,
    deletable,
    getColDef,
    onEdit,
    onSave,
    onCancel,
    onDelete,
    onInputChange,
}: TableRowProps<T>) => {
    return (
        <tr className={isDisabled ? styles.disabled : ''}>
            {allTableKeys.map((key) => {
                const colDef = getColDef(key);
                const isShown = keys.includes(key);
                const isEditable = isShown && (editFields ? editFields.includes(key) : isFieldEditable(key));
                const isEditing = editingIndex === rowIndex && isEditable && !isDisabled;

                return (
                    <td key={key} className={colDef.cellStyle}>
                        <TableCell
                            row={row}
                            keyName={key}
                            colDef={colDef}
                            isEditing={isEditing}
                            isShown={isShown}
                            editValue={editValues[key]}
                            onInputChange={onInputChange}
                        />
                    </td>
                );
            })}
            {(editable || deletable) && (
                <td className={styles.actions}>
                    {editingIndex === rowIndex ? (
                        <>
                            <button onClick={() => onSave(rowIndex)} className={styles.saveBtn}>
                                <Check size={18} />
                            </button>
                            <button onClick={onCancel} className={styles.cancelBtn}>
                                <X size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            {editable && !isDisabled && (
                                <button onClick={() => onEdit(rowIndex)} className={styles.editBtn}>
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
};
