import React from "react";

export type TMockOperation = "new" | "edit";

export interface IMockEditingContext {
  mockEditingId: string;

  setMockEditingId: (id: string, operation: TMockOperation) => void;
}

export const MockEditingContext: React.Context<IMockEditingContext> =
  React.createContext({
    mockEditingId: null,

    setMockEditingId: (id: string, operation: TMockOperation): void => {},
  });
