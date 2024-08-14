import * as React from "react";
import * as ReactDOM from "react-dom";

import Grid from "./components/grid";
import "./Grid.scss";
import "./ActionsRenderer.scss";
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-alpine.css";

function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = React.useState(0);

  const [selectedKeys, setSelectedKeys] = React.useState([3]);

  const items = [
    {
      number: 7307610883,
      board: "TQTF",
      symbol: "TMOS",
      operation: "Купля",
      date: "14.02.2023",
      time: "10:08:52",
      delivery_date: "16.02.2023",
      price: 4.342,
      count: 25,
      volume: 108.55,
      nkd: 0.0,
      client: "1468165",
    },
  ];

  const gridConfig = {
    columns: [
      {
        field: "number",
        headerName: "number",
        width: 50,
      },
      {
        field: "board",
        headerName: "board",
        width: 150,
      },
      {
        field: "symbol",
        headerName: "symbol",
        width: 50,
      },
      {
        field: "operation",
        headerName: "operation",
        width: 50,
      },
      {
        field: "date",
        headerName: "date",
        width: 100,
      },
      {
        field: "time",
        headerName: "time",
        width: 100,
      },
      {
        field: "delivery_date",
        headerName: "delivery_date",
        width: 100,
      },
      {
        field: "price",
        headerName: "price",
        width: 100,
      },
      {
        field: "count",
        headerName: "count",
        width: 100,
      },
      {
        field: "volume",
        headerName: "volume",
        width: 100,
      },
      {
        field: "nkd",
        headerName: "nkd",
        width: 100,
      },
      {
        field: "client",
        headerName: "client",
        width: 100,
      },
    ],
  };

  const onSelectionChanged = (selctedRows: any) => {
    console.log(selctedRows);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div>AG-grid</div>
      <div style={{ height: 300, width: 1300 }}>
        {
          /* @ts-ignore */
          <Grid
            keyField={"id"}
            data={items}
            gridConfig={gridConfig}
            agGridProps={{
              rowSelection: "multiple",
            }}
            onSelectionChanged={onSelectionChanged}
            checkboxSelection={true}
            selectedKeys={selectedKeys}
          />
        }
      </div>

      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

const t = window as any;

t.render = function (settings: any) {
  ReactDOM.render(
    <App />,
    document.getElementById(settings.elementId) as HTMLElement
  );
};
