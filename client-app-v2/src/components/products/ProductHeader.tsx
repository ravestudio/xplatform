import styles from "./Products.module.css";
import React from "react";
import { Product } from "../../store/Products";
import clsx from "clsx";

interface Props {
  product: Product;
}

const ProductHeader: React.FC<Props> = (props: Props) => {
  return (
    <>
      <div>Product</div>
      <div className={clsx(styles.productHeader, styles.productPosition)}>
        <div className={clsx(styles.posCell, styles.posCode)}>code</div>
        <div className={clsx(styles.posCell, styles.posDate)}>date</div>
        <div className={clsx(styles.posCell, styles.posLimit)}>limit</div>
        <div className={clsx(styles.posCell, styles.posCost)}>cost</div>
        <div className={clsx(styles.posCell, styles.posCost)}>current</div>
        <div className={clsx(styles.posCell, styles.posProfit)}>profit</div>
      </div>
    </>
  );
};

export default ProductHeader;
