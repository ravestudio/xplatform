import css from "./FinancialEdit.module.css";
import { Form, FormContext, IFormContext } from "../../../entities/form";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { addYear, removeYear, selectYears } from "../store";
import { Button } from "../../../entities/button";
import { config } from "../model";
import { useContext } from "react";

export const YearAdd = () => {
  const context = useContext(FormContext);
  const years = useAppSelector(selectYears);
  const dispatch = useAppDispatch();

  const onAddClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(addYear());
  };

  const onRemoveClick =
    (year: number, context: IFormContext) =>
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      if (context.reset) {
        context.reset([
          "year" + year,
          ...config.fields.map((field) => field.fieldName + year),
        ]);
      }

      dispatch(removeYear(year));
    };

  return (
    <div className={css.row}>
      <div className={css.fieldTitle}>Year</div>
      {years.map((year, index) => {
        return (
          <div className={css.fieldWithButton} key={index}>
            <Form.Field
              name={"year" + year}
              label=""
              className={css.fieldSmall}
            />
            <Button
              onClick={onRemoveClick(year, context)}
              text="x"
              style="red"
            />
          </div>
        );
      })}

      <Button onClick={onAddClick} text="add" style="green" />
    </div>
  );
};
