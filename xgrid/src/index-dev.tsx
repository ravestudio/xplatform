import * as React from "react";
import * as ReactDOM from "react-dom";

import Grid from "./components/grid";
import "./Grid.scss";
import "./ActionsRenderer.scss";

function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = React.useState(0);

  const [selectedKeys, setSelectedKeys] = React.useState([3]);

  const items = [
    {
      id: 1,
      lastName: "Ivanov",
      firstName: "Anton",
    },
    {
      id: 2,
      lastName: "Petrov",
      firstName: "Egor",
    },
    {
      id: 3,
      lastName: "Sidorov",
      firstName: "Ivan",
    },
  ];

  const gridConfig = {
    columns: [
      {
        field: "id",
        headerName: "id",
        width: 50,
      },
      {
        field: "lastName",
        headerName: "lastName",
        width: 150,
      },
      {
        field: "firstName",
        headerName: "firstName",
        width: 150,
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
