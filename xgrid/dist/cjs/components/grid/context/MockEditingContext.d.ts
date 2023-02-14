import React from "react";
export type TMockOperation = "new" | "edit";
export interface IMockEditingContext {
    mockEditingId: string;
    setMockEditingId: (id: string, operation: TMockOperation) => void;
}
export declare const MockEditingContext: React.Context<IMockEditingContext>;
