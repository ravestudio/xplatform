import React from "react";

import NoteItem from "../../../entities/note/ui/NoteItem";
import { NoteAdd } from "../../../features/note-add";
import { ActionProps, StateProps } from "../model/model";

type NoteListProps = StateProps & ActionProps;

class NoteList extends React.PureComponent<NoteListProps> {
  constructor(props: NoteListProps) {
    super(props);
  }

  public componentDidUpdate() {
    if (this.props.code) {
      this.props.requestNotes(this.props.code);
    }
  }

  public componentWillUnmount() {
    this.props.reset();
  }

  public render() {
    if (!this.props.notes) {
      return;
    }

    return (
      <div>
        <div>NoteList</div>
        <div>
          {this.props.notes.map((n, index) => (
            <NoteItem key={index} note={n} />
          ))}
        </div>

        <div>{this.props.code && <NoteAdd code={this.props.code} />}</div>
      </div>
    );
  }
}

export default NoteList;
