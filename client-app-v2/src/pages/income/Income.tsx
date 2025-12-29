import { useEffect } from "react";
import { useAppDispatch } from "../../app/hooks";
import { loadAsync } from "../../features/income/incomeSlice";
import { Sales } from "../../widgets/sales";

export const Income = () => {
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
