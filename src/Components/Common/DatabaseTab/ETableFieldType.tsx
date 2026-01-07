export const ETableFieldType = {
    TEXT: "text",
    BOOLEAN: "boolean",
    SELECT: "select",
    PASSWORD: "password"
} as const;

export type ETableFieldType = typeof ETableFieldType[keyof typeof ETableFieldType];