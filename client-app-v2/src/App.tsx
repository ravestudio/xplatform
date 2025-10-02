import React from "react";

import Layout from "./components/blocks/2Layout";
import Shares from "./components/shares/2Shares";
import Auth from "./features/auth/ui/Login";
import Portfolio from "./components/portfolio/Portfolio";
import Import from "./components/import/import";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "./store";
import Financials from "./pages/financials/Financials";
import Positions from "./components/positions/Positions";
import Products from "./components/products/Products";
import Admin from "./components/admin/admin";
import styles from "./app.module.css";
import ProtectedRoute from "./ProtectedRoute";
import { BalancingLog } from "./pages/balancingLog/BalancingLog";
import { FinancialUtils } from "./pages/financialUtils";

export default connect((state: ApplicationState) => ({
  loggedIn: state.auth?.token !== undefined,
}))((props: { loggedIn: boolean }) => (
  <Layout>
    <BrowserRouter>
      {props.loggedIn && (
        <div className={styles.mainMenu}>
          <Link to="/">Home</Link>

          <Link to="portfolio">Portfolio</Link>

          <Link to="products">Products</Link>

          <Link to="balancingLog">BalancingLog</Link>

          <Link to="import">Import</Link>

          <Link to="positions">Positions</Link>

          <Link to="admin">Admin</Link>

          <Link to="financialUtils">FinancialUtils</Link>
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
          path="/balancingLog"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <BalancingLog />
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
        <Route
          path="/financialUtils"
          element={
            <ProtectedRoute isLoggedIn={props.loggedIn}>
              <FinancialUtils />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  </Layout>
));
