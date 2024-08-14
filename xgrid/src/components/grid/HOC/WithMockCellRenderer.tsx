import React from "react";
import {
  IMockEditingContext,
  MockEditingContext,
} from "../context/MockEditingContext";
import { ICellRenderer, ICellRendererParams } from "ag-grid-community";

export interface WithMockCellRendererProps {
  isMockEditing: boolean;
}

interface WithMockCellRendererState {
  isMockEditing: boolean;
}

const WithMockCellRenderer = <P extends ICellRendererParams>(
  WrappedComponent: React.ComponentClass<P>
): React.ComponentClass<P> =>
  class extends React.Component<P> implements ICellRenderer {
    state: WithMockCellRendererState;

    static contextType: React.Context<IMockEditingContext> = MockEditingContext;
    context!: React.ContextType<typeof MockEditingContext>;

    constructor(props: P) {
      super(props);
      this.state = {
        isMockEditing: false,
      };
    }

    public refresh(): boolean {
      this.setState({
        isMockEditing: this.context.mockEditingId === this.props.node.id,
      });
      return true;
    }

    render(): React.ReactElement<P & WithMockCellRendererProps> {
      return (
        <WrappedComponent
          {...(this.props as P)}
          isMockEditing={this.state.isMockEditing}
        />
      );
    }
  };

export default WithMockCellRenderer;
