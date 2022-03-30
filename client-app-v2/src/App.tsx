import React from "react";
import logo from "./logo.svg";

import Layout from "./components/blocks/2Layout";
import Shares from "./components/shares/2Shares";

import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { connect } from "react-redux";
import { ApplicationState } from "./store";

export default connect((state: ApplicationState) => ({
  loggedIn: state.auth?.token !== undefined,
}))((props: { loggedIn: boolean }) => (
  <Layout>
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

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Shares />} />
      </Routes>
    </BrowserRouter>
  </Layout>
));
