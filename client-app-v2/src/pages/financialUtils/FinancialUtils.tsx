import { useAppDispatch } from "../../app/hooks";
import { Toolbar } from "../../entities/toolbar";
import { FinancialEdit } from "../../features/financial-edit";
import { uiAction } from "../../features/financial-edit/store";
import css from "./FinancialUtils.module.css";

export const FinancialUtils = () => {
  const dispatch = useAppDispatch();

  const onAction = (key: string) => {
    if (key === "saveDraft") {
      dispatch(uiAction({ type: "saveDraft" }));
    }

    if (key === "loadDraft") {
      dispatch(uiAction({ type: "loadDraft" }));
    }
  };

  return (
    <div className={css.root}>
      <Toolbar
        actions={[
          {
            key: "saveDraft",
            caption: "Save Draft",
          },
          {
            key: "loadDraft",
            caption: "Load Draft",
          },
        ]}
        onAction={onAction}
      />

      <FinancialEdit />
    </div>
  );
};
