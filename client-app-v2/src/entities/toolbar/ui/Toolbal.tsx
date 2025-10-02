import css from "./Toolbar.module.css";

type ToolbarProps = {
  actions: { key: string; caption: string }[];
  onAction: (key: string) => void;
};
export const Toolbar = ({ actions, onAction }: ToolbarProps) => {
  const onClickHandler = (key: string) => () => {
    onAction(key);
  };

  return (
    <div className={css.toolbar}>
      {actions.map((action) => (
        <button onClick={onClickHandler(action.key)}>{action.caption}</button>
      ))}
    </div>
  );
};
