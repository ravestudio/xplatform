import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  loadAsync,
  selectBalancingLog,
} from "../../../features/balancingLog/balancingLogSlice";
import { BalancingLogView } from "../../../entities/balancingLog";
import css from "./BalancingLogList.module.css";

export const BalancingLogList = () => {
  const balancingLog = useAppSelector(selectBalancingLog);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadAsync());
  }, []);

  return (
    <div className={css.logList}>
      {balancingLog.map((log) => (
        <BalancingLogView value={log} />
      ))}
    </div>
  );
};
