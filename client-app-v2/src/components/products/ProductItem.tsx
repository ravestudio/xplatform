import styles from "./Products.module.css";
import React from "react";
import { ProductPosition } from "../../store/Products";
import { format } from "date-fns";
import clsx from "clsx";

interface Props {
  position: ProductPosition;
}

const ProductItem: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.productPosition}>
      <div className={clsx(styles.posCell, styles.posCode, styles.posWithIcon)}>
        <div className={styles.posIcon}>
          <img src={`/icons/${props.position.code}.png`} />
        </div>
        <div className={styles.posText}>{props.position.code}</div>
      </div>
      <div className={clsx(styles.posCell, styles.posDate)}>
        {format(new Date(props.position.date), "dd-MM-yyyy")}
      </div>
      <div className={clsx(styles.posCell, styles.posLimit)}>
        {props.position.limit}
      </div>
      <div className={clsx(styles.posCell, styles.posCost)}>
        {props.position.cost}
      </div>
      <div className={clsx(styles.posCell, styles.posCost)}>
        {props.position.currentCost}
      </div>
      <div className={clsx(styles.posCell, styles.posProfit)}>
        {props.position.profit}
      </div>
    </div>
  );
};

export default ProductItem;
