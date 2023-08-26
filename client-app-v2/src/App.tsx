import React from "react";
import logo from "./logo.svg";

import Layout from "./components/blocks/2Layout";
import Shares from "./components/shares/2Shares";
import Auth from "./components/auth/Login";
import Portfolio from "./components/portfolio/Portfolio";
import Import from "./components/import/import";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "./store";
import Financials from "./components/financials/Financials";
import Positions from "./components/positions/Positions";
import Admin from "./components/admin/admin";
import "./app.scss";

export default connect((state: ApplicationState) => ({
  loggedIn: state.auth?.token !== undefined,
}))((props: { loggedIn: boolean }) => (
  <Layout>
    <BrowserRouter>
      {props.loggedIn && (
        <div className="mainMenu">
          <Link to="/">Home</Link>

          <Link to="portfolio">Portfolio</Link>

          <Link to="import">Import</Link>

          <Link to="positions">Positions</Link>

          <Link to="admin">Admin</Link>
        </div>
      )}
      <Routes>
        <Route path="/" element={<Shares />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/financials/:code" element={<Financials />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/import" element={<Import />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </Layout>
));
