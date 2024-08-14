import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";

import { ApplicationState } from "../../store";

import * as ProductsStore from "../../store/Products";
import ProductItem from "./ProductItem";
import styles from "./Products.module.css";
import ProductHeader from "./ProductHeader";
import ProductFooter from "./ProductFooter";

type ProductsProps = ProductsStore.ProductsState &
  typeof ProductsStore.actionCreators;

class Products extends React.PureComponent<ProductsProps> {
  constructor(props: ProductsProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.requestProducts();
  }

  public render() {
    return (
      <div>
        {this.props.products.map((product) => (
          <div className={styles.product}>
            <ProductHeader product={product} />
            <div>
              {product.positions.map((position) => (
                <ProductItem position={position} />
              ))}
            </div>
            <ProductFooter product={product} />
          </div>
        ))}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return bindActionCreators(ProductsStore.actionCreators, dispatch);
};

export default connect(
  (state: ApplicationState) => state.products,
  mapDispatchToProps
)(Products as any);
