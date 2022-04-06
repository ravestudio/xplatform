import React from "react";
import logo from "./logo.svg";

import Layout from "./components/blocks/2Layout";
import Shares from "./components/shares/2Shares";
import Auth from "./components/auth/Login";
import Portfolio from "./components/portfolio/Portfolio";

import { BrowserRouter, Link, Route, Routes, useMatch } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "./store";
import Financials from "./components/financials/Financials";

export default connect((state: ApplicationState) => ({
  loggedIn: state.auth?.token !== undefined,
}))((props: { loggedIn: boolean }) => (
  <Layout>
    <BrowserRouter>
      {props.loggedIn && (
        <div>
          <div>
            <Link to="/">Home</Link>
          </div>
          <div>
            <Link to="portfolio">Portfolio</Link>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Shares />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/financials/:code" element={<Financials />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  </Layout>
));
