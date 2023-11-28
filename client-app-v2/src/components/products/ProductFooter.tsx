import React from "react";
import { Product } from "../../store/Products";
import clsx from "clsx";

interface Props {
  product: Product;
}

const ProductFooter: React.FC<Props> = (props: Props) => {
  return (
    <div className="product-footer">
      <div
        className={clsx(
          "total",
          "pos-with-icon",
          props.product.profit > 0 ? "green" : "red"
        )}
      >
        <div className="pos-icon">
          <img src="/icons/money.png" />
        </div>
        <div className="pos-text">{props.product.profit}</div>
      </div>
    </div>
  );
};

export default ProductFooter;
