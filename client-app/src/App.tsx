import React from "react";
import { Switch, Route } from "react-router";
import logo from "./logo.svg";
import "./App.css";
import Layout from "./components/blocks/2Layout";
import Emitents from "./components/emitents/Emitents";
import Deals from "./components/deals/Deals";
import DealCreate from "./components/deals/DealCreate";
import Portfolio from "./components/portfolio/Portfolio";
import Financials from "./components/financials/Financials";
import Shares from "./components/shares/2Shares";
import ImportSecurities from "./components/import";
import ImgViewer from "./components/imageViewer";
import Auth from "./components/auth/Login";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import ruLocale from "date-fns/locale/ru";

export default () => (
  <Layout>
    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
      <Route exact path="/" component={Shares} />

      <Route path="/deals" component={Deals} />
      <Route path="/createDeal" component={DealCreate} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/financials/:code?" component={Financials} />
      <Route path="/import" component={ImportSecurities} />
      <Route path="/img" component={ImgViewer} />
      <Route path="/auth" component={Auth} />
    </MuiPickersUtilsProvider>
  </Layout>
);
