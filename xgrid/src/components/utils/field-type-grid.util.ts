export enum FieldTypeGrid {
  String = 0,
  Number = 1,
  Date = 2,
  Boolean = 3,
  Object = 4,
  DateTime = 5,
}

export function getTypeForDxGrid(
  type: any
):
  | "string"
  | "number"
  | "date"
  | "boolean"
  | "object"
  | "datetime"
  | undefined {
  switch (type) {
    case FieldTypeGrid.String:
      return "string";
    case FieldTypeGrid.Date:
      return "date";
    case FieldTypeGrid.Object:
      return "object";
    case FieldTypeGrid.Number:
      return "number";
    case FieldTypeGrid.DateTime:
      return "datetime";
    case FieldTypeGrid.Boolean:
      return "boolean";
  }

  return undefined;
}
