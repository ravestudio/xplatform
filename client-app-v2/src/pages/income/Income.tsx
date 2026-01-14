import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadAsync, selectYear } from "../../features/income/incomeSlice";
import { Sales } from "../../widgets/sales";
import { Income } from "../../widgets/income";
import css from "./income.module.css";
import { YearSelect } from "../../features/income";

export const IncomePage = () => {
  const dispatch = useAppDispatch();

  const year = useAppSelector(selectYear);

  useEffect(() => {
    if (year) {
      dispatch(loadAsync(year));
    }
  }, [year]);

  return (
    <div className={css.container}>
      <YearSelect />

      <div className={css.sales}>
        <Sales />
      </div>

      <div className={css.income}>
        <Income />
      </div>
    </div>
  );
};
