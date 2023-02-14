import React from "react";
export interface WithMockEditingIdProps {
    mockEditingId: string;
}
declare const WithMockEditingContext: <P extends {}>(WrappedComponent: React.ComponentClass<P, any>) => React.ComponentClass<P, any>;
export default WithMockEditingContext;
