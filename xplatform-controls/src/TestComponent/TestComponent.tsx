import React from "react";
import {    TextField } from "@material-ui/core";
import { TestComponentProps } from "./TestComponent.types";
import renderTextField from "../Field/TextField";

const TestComponent: React.FC<TestComponentProps> = ({ theme }) => (
  <div
    data-testid="test-component"
    className={`test-component test-component-${theme}`}
  >
    <h1 className="heading">I'm the test component</h1>
    <h2>Made with love by Harvey</h2>

    <TextField label="Hello" defaultValue="Stas"/>
  </div>
);

export default TestComponent;