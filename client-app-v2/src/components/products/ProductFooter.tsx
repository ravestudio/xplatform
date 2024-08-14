import styles from "./Products.module.css";
import React from "react";
import { Product } from "../../store/Products";
import clsx from "clsx";

interface Props {
  product: Product;
}

const ProductFooter: React.FC<Props> = (props: Props) => {
  return (
    <div className={styles.productFooter}>
      <div
        className={clsx(
          styles.total,
          styles.posWithIcon,
          props.product.profit > 0 ? "green" : "red"
        )}
      >
        <div className={styles.posIcon}>
          <img src="/icons/money.png" />
        </div>
        <div className={styles.posText}>{props.product.profit}</div>
      </div>
    </div>
  );
};

export default ProductFooter;
