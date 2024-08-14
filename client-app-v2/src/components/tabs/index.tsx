import React, { useState, useRef, useEffect } from "react";

import css from "./tabs.module.css";

interface ITabsProps {
  value: any;
  children: React.ReactElement[];

  onSelect?: (value: string) => void;
}

interface ITab {
  label: string;
  icon: string;
  value: string;
  active?: boolean;
  onSelect?: (value: string) => void;
  style?: any;
}

export const Tab = (props: ITab) => {
  function onClick() {
    if (props.onSelect === undefined) return;

    props.onSelect(props.value);
  }

  return (
    <div
      className={`${props.active === true ? "active" : null}`}
      onClick={onClick}
      style={props.style}
    >
      <i className={`fa ${props.icon}`}></i>
      {props.label}
    </div>
  );
};

const Tabs: React.FC<ITabsProps> = (props) => {
  const [activeTab, setActiveTab] = useState(props.value);

  const values = props.children.map((child: any) => child.props.value);

  const activeIndex = values.findIndex((v) => v === activeTab);

  function onSelect(tab: string) {
    setActiveTab(tab);

    if (props.onSelect !== undefined) {
      props.onSelect(tab);
    }
  }

  return (
    <div className={css.tabs}>
      <div className={css.tabHeader}>
        {props.children.map((child) =>
          React.cloneElement(child, {
            onSelect,
            active: child.props.value === activeTab,
            style: { width: `calc(100% / ${values.length})` },
          })
        )}
      </div>

      <div
        className={css.tabIndicator}
        style={{
          width: `calc(100% / ${values.length})`,
          left: `calc(calc(100% / ${values.length}) * ${activeIndex})`,
        }}
      ></div>
    </div>
  );
};

export default Tabs;
