import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import Dropdown from "../../../components/dropdown";
import { selectYear, setYear } from "../incomeSlice";

export const YearSelect = () => {
  const year = useAppSelector(selectYear);
  const dispatch = useAppDispatch();

  const years = [
    {
      id: 2025,
      label: "2025",
    },

    {
      id: 2026,
      label: "2026",
    },
  ];

  return (
    <div style={{ width: 200 }}>
      <Dropdown
        options={years}
        id="id"
        label="label"
        prompt="Select year..."
        value={year ? years.find((y) => y.id === year) : null}
        onChange={(val) => dispatch(setYear(val.id))}
      />
    </div>
  );
};
