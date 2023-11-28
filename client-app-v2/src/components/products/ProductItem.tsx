import React from "react";
import { ProductPosition } from "../../store/Products";
import { format } from "date-fns";

interface Props {
  position: ProductPosition;
}

const ProductItem: React.FC<Props> = (props: Props) => {
  return (
    <div className="product-position">
      <div className="pos-cell pos-code pos-with-icon">
        <div className="pos-icon">
          <img src={`/icons/${props.position.code}.png`} />
        </div>
        <div className="pos-text">{props.position.code}</div>
      </div>
      <div className="pos-cell pos-date">
        {format(new Date(props.position.date), "dd-MM-yyyy")}
      </div>
      <div className="pos-cell pos-limit">{props.position.limit}</div>
      <div className="pos-cell pos-cost">{props.position.cost}</div>
      <div className="pos-cell pos-cost">{props.position.currentCost}</div>
      <div className="pos-cell pos-profit">{props.position.profit}</div>
    </div>
  );
};

export default ProductItem;
