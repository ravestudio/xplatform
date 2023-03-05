import React from "react";
import {
  ICellRenderer,
  ICellRendererParams,
  CellMouseOverEvent,
  CellMouseOutEvent,
} from "ag-grid-community";

//import "./ActionsRenderer.scss";

import {
  IMockEditingContext,
  MockEditingContext,
} from "../../context/MockEditingContext";
import WithMockCellRenderer, {
  WithMockCellRendererProps,
} from "../../HOC/WithMockCellRenderer";

interface ActionsRendererProps
  extends ICellRendererParams,
    WithMockCellRendererProps {
  commit: () => null;

  rollback: () => null;

  delete: (item: any) => void;

  actionButtons: any[];
}

interface ActionsRendererState {
  visible: boolean;
}

class ActionsRenderer extends React.Component<
  ActionsRendererProps,
  ActionsRendererState
> {
  state: ActionsRendererState;

  static contextType: React.Context<IMockEditingContext> = MockEditingContext;

  public constructor(props: ActionsRendererProps) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  private enterMockEditMode: React.MouseEventHandler<HTMLSpanElement> =
    (): void => {
      if (this.context.mockEditingId !== null) {
        alert("You can only edit one todo at a time");
        return;
      }
      const nodeId: string = this.props.node.id;
      this.context.setMockEditingId(nodeId, "edit");
    };

  private deleteItem: React.MouseEventHandler<HTMLSpanElement> = (): void => {
    if (window.confirm("Удалить?")) {
      const item = this.props.data;
      this.props.delete(item);
    }
  };

  private saveChanges: React.MouseEventHandler<HTMLSpanElement> = (): void => {
    this.props.commit();

    setTimeout(() => this.context.setMockEditingId(null, null), 0);
  };

  private undoChanges: React.MouseEventHandler<HTMLSpanElement> = (): void => {
    this.props.rollback();
    setTimeout(() => this.context.setMockEditingId(null, null), 0);
  };

  public render(): React.ReactElement {
    if (!this.state.visible) {
      return null;
    }

    const getActionSettings = (actionName: string) => {
      const btn = this.props.actionButtons?.filter(
        (btn: any) => btn.name === actionName
      );

      return btn && btn.length > 0 ? btn[0] : undefined;
    };

    const mockEditingIcons = (
      <>
        <button className="save-icon" onClick={this.saveChanges}>
          save
        </button>

        <button className="cancel-icon" onClick={this.undoChanges}>
          cancel
        </button>
      </>
    );

    const editBtnSettings = getActionSettings("edit");

    const nonMockEditingIcons = (
      <>
        {this.props.actionButtons.map((btn: any, index: number) => {
          if (btn.name === "edit") {
            return (
              <button
                className="edit-icon"
                onClick={
                  editBtnSettings && editBtnSettings.onClick
                    ? () =>
                        editBtnSettings.onClick({
                          item: this.props.data,
                        })
                    : this.enterMockEditMode
                }
              >
                edit
              </button>
            );
          }

          if (btn.name === "delete") {
            return (
              <button className="delete-icon" onClick={this.deleteItem}>
                delete
              </button>
            );
          }
        })}
      </>
    );

    return (
      <div className="actions-wrapper">
        {this.props.isMockEditing ? mockEditingIcons : nonMockEditingIcons}
      </div>
    );
  }
}

export default WithMockCellRenderer(ActionsRenderer);
