import React from "react";
export interface WithMockEditingIdProps {
    mockEditingId: string;
}
declare const WithMockEditingContext: <P extends {}>(WrappedComponent: React.ComponentClass<P>) => React.ComponentClass<P>;
export default WithMockEditingContext;
