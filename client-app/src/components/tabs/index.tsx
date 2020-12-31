import React, { useState, useRef, useEffect } from "react";

import "./tabs.scss";

interface ITabsProps {
  value: any;
  children: React.ReactElement[];
}

interface ITab {
  label: string;
  icon: string;
  value: string;
  active?: boolean;
  onSelect?: (value: string) => void;
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
  }

  return (
    <div className="tabs">
      <div className="tab-header">
        {props.children.map((child) =>
          React.cloneElement(child, {
            onSelect,
            active: child.props.value === activeTab,
          })
        )}
      </div>

      <div
        className="tab-indicator"
        style={{ left: `calc(calc(100% / ${values.length}) * ${activeIndex})` }}
      ></div>
    </div>
  );
};

export default Tabs;
