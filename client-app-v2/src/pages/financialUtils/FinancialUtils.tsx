import { useAppDispatch } from "../../app/hooks";
import { Toolbar } from "../../entities/toolbar";
import { FinancialEdit } from "../../features/financial-edit";
import { save } from "../../features/financial-edit/store";
import css from "./FinancialUtils.module.css";

export const FinancialUtils = () => {
  const dispatch = useAppDispatch();

  const onAction = (key: string) => {
    if (key === "save") {
      dispatch(save());
    }
  };

  return (
    <div className={css.root}>
      <Toolbar
        actions={[
          {
            key: "save",
            caption: "Save",
          },
        ]}
        onAction={onAction}
      />

      <FinancialEdit />
    </div>
  );
};
