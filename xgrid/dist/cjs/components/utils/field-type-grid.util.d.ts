export declare enum FieldTypeGrid {
    String = 0,
    Number = 1,
    Date = 2,
    Boolean = 3,
    Object = 4,
    DateTime = 5
}
export declare function getTypeForDxGrid(type: any): "string" | "number" | "date" | "boolean" | "object" | "datetime" | undefined;
