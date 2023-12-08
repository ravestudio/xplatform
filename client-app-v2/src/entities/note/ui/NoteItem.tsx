import React from "react";
import { Note } from "../model/model";

interface Props {
  note: Note;
}

const NoteItem: React.FC<Props> = ({ note }: Props) => {
  return <div className="note-item">{note.data}</div>;
};

export default NoteItem;
