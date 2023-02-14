import React from "react";
import { ICellRendererParams } from "ag-grid-community";
import WithMockCellEditor, { WithMockCellEditorProps } from "../../HOC/WithMockCellEditor";

import clsx from "clsx";

interface TextFieldRendererProps extends ICellRendererParams, WithMockCellEditorProps {}

interface TextFieldRendererState {
  value: string;
}

class TextFieldRenderer extends React.Component<TextFieldRendererProps, TextFieldRendererState> {
  state: TextFieldRendererState;

  private inputRef: React.RefObject<HTMLInputElement>;

  public constructor(props: TextFieldRendererProps) {
    super(props);
    this.state = {
      value: "",
    };
    this.inputRef = React.createRef<HTMLInputElement>();
  }

  public refresh(): boolean {
    throw new Error("DescriptionRenderer not wrapped with WithMockCellEditor");
    return true;
  }

  public componentDidMount(): void {
    this.setState({
      value: this.props.getValue(),
    });
  }

  public componentDidUpdate(): void {
    if (this.props.isMockEditing) {
      this.inputRef.current!.focus();
    }
  }

  public getValue(): [any, any] {
    const field = this.props.column.getColId();
    return [field, this.state.value];
  }

  public reset(): void {
    this.setState({ value: this.props.getValue() });
  }

  private inputChangedHandler: React.ChangeEventHandler<HTMLInputElement> = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    this.setState({ value: event.target.value });
  };

  public render(): React.ReactElement {
    let component: React.ReactElement;

    const isSelected: boolean = this.props.node.isSelected();

    if (this.props.isMockEditing) {
      const inputStyles: React.CSSProperties = {
        background: isSelected ? "#D5F1D1" : "whitesmoke",
      };
      component = (
        <input ref={this.inputRef} value={this.state.value} onChange={this.inputChangedHandler} />
      );
    } else {
      component = <span>{this.state.value}</span>;
    }

    return (
      <div className={clsx("cmp", this.props.isMockEditing && "cmp-edit-mode")}>{component}</div>
    );
  }
}

export default WithMockCellEditor(TextFieldRenderer);
