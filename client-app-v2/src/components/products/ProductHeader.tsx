import React from "react";
import { Product } from "../../store/Products";

interface Props {
  product: Product;
}

const ProductHeader: React.FC<Props> = (props: Props) => {
  return (
    <>
      <div>Product</div>
      <div className="product-header product-position">
        <div className="pos-cell pos-code">code</div>
        <div className="pos-cell pos-date">date</div>
        <div className="pos-cell pos-limit">limit</div>
        <div className="pos-cell pos-cost">cost</div>
        <div className="pos-cell pos-cost">current</div>
        <div className="pos-cell pos-profit">profit</div>
      </div>
    </>
  );
};

export default ProductHeader;
