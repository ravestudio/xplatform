import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  loadAsync,
  selectBalancingLog,
} from "../../../features/balancingLog/balancingLogSlice";

export const BalancingLogList = () => {
  const balancingLog = useAppSelector(selectBalancingLog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAsync());
  }, []);

  return (
    <div>
      {balancingLog.map((log) => (
        <div>{log.changeDate}</div>
      ))}
    </div>
  );
};
