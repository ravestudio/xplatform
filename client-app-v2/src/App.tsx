import React from "react";
import logo from "./logo.svg";

import Layout from "./components/blocks/2Layout";
import Shares from "./components/shares/2Shares";
import Auth from "./components/auth/Login";
import Portfolio from "./components/portfolio/Portfolio";
import Import from "./components/import/import";

import { BrowserRouter, Link, Route, Routes, useMatch } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "./store";
import Financials from "./components/financials/Financials";
import Positions from "./components/positions/Positions";

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
          <div>
            <Link to="import">Import</Link>
          </div>
          <div>
            <Link to="positions">Positions</Link>
          </div>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Shares />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/financials/:code" element={<Financials />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/import" element={<Import />} />
        <Route path="/positions" element={<Positions />} />
      </Routes>
    </BrowserRouter>
  </Layout>
));
