import { type ColumnDefinition } from '../DatabaseTab';
import { ETableFieldType } from '../ETableFieldType';
import styles from '../DatabaseTab.module.scss';

interface InputFieldProps<T> {
    colDef: ColumnDefinition<T>;
    keyName: string;
    value: unknown;
    onChange: (key: string, value: string | boolean) => void;
    placeholder?: string;
}

export const InputField = <T,>({ colDef, keyName, value, onChange, placeholder }: InputFieldProps<T>) => {
    const getPlaceholder = () => {
        if (placeholder) return placeholder;
        if (typeof colDef.displayName === 'string') return colDef.displayName;
        return '';
    };

    if (colDef.fieldType === ETableFieldType.BOOLEAN) {
        return (
            <select
                value={String(value ?? false)}
                onChange={(e) => onChange(keyName, e.target.value === 'true')}
                className={styles.input}
            >
                <option value="true" className={styles.option}>true</option>
                <option value="false" className={styles.option}>false</option>
            </select>
        );
    }

    if (colDef.fieldType === ETableFieldType.SELECT && colDef.selectOptions) {
        return (
            <select
                multiple
                value={Array.isArray(value) ? value : String(value ?? '').split(',').map(s => s.trim()).filter(Boolean)}
                onChange={(e) => {
                    const values = Array.from(e.target.selectedOptions).map(opt => opt.value);
                    onChange(keyName, values.join(','));
                }}
                className={styles.selectMultiple}
            >
                {colDef.selectOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        );
    }

    if (colDef.selectOptions) {
        return (
            <select
                value={String(value ?? (colDef.selectOptions.length > 0 ? colDef.selectOptions[0] : ''))}
                onChange={(e) => onChange(keyName, e.target.value)}
                className={styles.input}
            >
                {colDef.selectOptions.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        );
    }

    if (colDef.fieldType === ETableFieldType.PASSWORD) {
        return (
            <input
                type="password"
                value={String(value ?? '')}
                onChange={(e) => onChange(keyName, e.target.value)}
                className={styles.input}
                autoComplete="new-password"
                placeholder={getPlaceholder()}
            />
        );
    }

    return (
        <input
            type="text"
            value={String(value ?? '')}
            onChange={(e) => onChange(keyName, e.target.value)}
            className={styles.input}
            placeholder={getPlaceholder()}
        />
    );
};
