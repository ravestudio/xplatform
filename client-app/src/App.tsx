import React from "react";
import { Route } from "react-router";
import logo from "./logo.svg";
import "./App.css";
import Layout from "./components/blocks/2Layout";
import Emitents from "./components/emitents/Emitents";
import Deals from "./components/deals/Deals";
import DealCreate from "./components/deals/DealCreate";
import Portfolio from "./components/portfolio/Portfolio";
import Positions from "./components/positions/Positions";
import Financials from "./components/financials/Financials";
import Shares from "./components/shares/2Shares";
import ImportSecurities from "./components/import";
import ImgViewer from "./components/imageViewer";
import Auth from "./components/auth/Login";

import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateAdapter from "@mui/lab/AdapterDateFns";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "./store";

export default connect((state: ApplicationState) => ({
  loggedIn: state.auth?.token !== undefined,
}))((props: { loggedIn: boolean }) => (
  <Layout>
    <LocalizationProvider dateAdapter={DateAdapter}>
      {props.loggedIn && (
        <div>
          <div>
            <Link to={"/"}>Home</Link>
          </div>
          <div>
            <Link to={"portfolio"}>Portfolio</Link>
          </div>
        </div>
      )}

      <Route exact path="/" component={Shares} />

      <Route path="/deals" component={Deals} />
      <Route path="/createDeal" component={DealCreate} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/positions" component={Positions} />
      <Route path="/financials/:code?" component={Financials} />
      <Route path="/import" component={ImportSecurities} />
      <Route path="/img" component={ImgViewer} />
      <Route path="/auth" component={Auth} />
    </LocalizationProvider>
  </Layout>
));
