import { type JSX } from 'react';
import { type ColumnDefinition } from '../DatabaseTab';
import { InputField } from './InputField';

interface TableCellProps<T> {
    row: T;
    keyName: string;
    colDef: ColumnDefinition<T>;
    isEditing: boolean;
    isShown: boolean;
    editValue: unknown;
    onInputChange: (key: string, value: string | boolean) => void;
}

export const TableCell = <T,>({
    row,
    keyName,
    colDef,
    isEditing,
    isShown,
    editValue,
    onInputChange,
}: TableCellProps<T>): JSX.Element => {
    if (isEditing) {
        return (
            <InputField
                colDef={colDef}
                keyName={keyName}
                value={editValue}
                onChange={onInputChange}
            />
        );
    }

    const rawValue = row[keyName as keyof T];
    const displayValue = colDef.cellContent 
        ? colDef.cellContent(row) 
        : (rawValue !== null && rawValue !== undefined ? String(rawValue) : '');

    return <>{isShown ? displayValue : ''}</>;
};
