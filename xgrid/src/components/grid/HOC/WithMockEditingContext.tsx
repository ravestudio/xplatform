import React from "react";
import { IMockEditingContext, MockEditingContext } from "../context/MockEditingContext";

export interface WithMockEditingIdProps {
  mockEditingId: string;
}

const WithMockEditingContext = <P extends {}>(
  WrappedComponent: React.ComponentClass<P>
): React.ComponentClass<P> =>
  class extends React.Component<P, IMockEditingContext> {
    state: IMockEditingContext;

    constructor(props: P) {
      super(props);
      this.state = {
        mockEditingId: null,

        setMockEditingId: this.setMockEditingId,
      };
    }

    /** updates {@link MockEditingContext.mockEditingId} */
    setMockEditingId = (id: string): void => {
      this.setState((prevState) => ({
        ...prevState,
        mockEditingId: id,
      }));
    };

    render(): React.ReactElement<P & WithMockEditingIdProps> {
      return (
        <MockEditingContext.Provider value={this.state}>
          <WrappedComponent {...(this.props as P)} mockEditingId={this.state.mockEditingId} />
        </MockEditingContext.Provider>
      );
    }
  };

export default WithMockEditingContext;
