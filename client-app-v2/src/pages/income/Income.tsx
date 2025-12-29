import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { loadAsync } from "../../features/income/incomeSlice";
import { Sales } from "../../widgets/sales";
import { Income } from "../../widgets/income";
import css from "./income.module.css";

export const IncomePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAsync(2025));
  }, []);

  return (
    <div className={css.container}>
      <div className={css.sales}>
        <Sales />
      </div>

      <div className={css.income}>
        <Income />
      </div>
    </div>
  );
};
