import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { loadAsync } from "../../features/income/incomeSlice";
import { Sales } from "../../widgets/sales";
import { Income } from "../../widgets/income";

export const IncomePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAsync(2025));
  }, []);

  return (
    <div>
      <Sales />
      <Income />
    </div>
  );
};
