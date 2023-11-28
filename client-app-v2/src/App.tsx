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
import Products from "./components/products/Products";
import Admin from "./components/admin/admin";
import "./app.scss";
import ProtectedRoute from "./ProtectedRoute";

export default connect((state: ApplicationState) => ({
  loggedIn: state.auth?.token !== undefined,
}))((props: { loggedIn: boolean }) => (
  <Layout>
    <BrowserRouter>
      {props.loggedIn && (
        <div className="mainMenu">
          <Link to="/">Home</Link>

          <Link to="portfolio">Portfolio</Link>

          <Link to="products">Products</Link>

          <Link to="import">Import</Link>

          <Link to="positions">Positions</Link>

          <Link to="admin">Admin</Link>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <Shares />
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <Portfolio />
            </ProtectedRoute>
          }
        />
        <Route
          path="/financials/:code"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <Financials />
            </ProtectedRoute>
          }
        />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/import"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <Import />
            </ProtectedRoute>
          }
        />
        <Route
          path="/positions"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <Positions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </Layout>
));
