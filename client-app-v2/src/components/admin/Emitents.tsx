import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { ApplicationState } from "../../store";
import * as EmitentsStore from "../../store/Emitents";
import { Grid } from "@ravestudio/xgrid";

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(EmitentsStore.actionCreators, dispatch),
  };
};

type EmitentsProps = EmitentsStore.EmitentsState &
  ReturnType<typeof mapDispatchToProps>;

const Emitents: React.FC<EmitentsProps> = (props: EmitentsProps) => {
  /*const [parameters, setParameters] = React.useState<string[]>([
    "code",
    "name",
    "isin",
  ]);*/
  const [checked, setChecked] = React.useState<string[]>([]);

  const handleChange = (pr: string) => (e: any) => {
    if (e.target.checked) {
      setChecked((old) => [pr, ...old]);
    }

    if (e.target.checked === false) {
      setChecked((old) => old.filter((el) => el !== pr));
    }
  };

  const onSaving = (changes: any) => {
    const promise = props.actions.saveChanges(changes);
  };

  const gridProps = {
    keyField: "code",
    gridConfig: {
      columns: [
        {
          field: "id",
          headerName: "id",
          width: 50,
        },
        {
          field: "code",
          headerName: "code",
          width: 50,
        },
        {
          field: "name",
          headerName: "name",
          width: 150,
        },
        {
          field: "financialPage",
          headerName: "financialPage",
          width: 150,
        },
      ],
    },
    items: props.emitents,
    //onSelectionChanged: this.onOpen.bind(this),
  };

  return (
    <div>
      <div style={{ height: 300 }}>
        {/* @ts-ignore */}
        <Grid
          keyField={gridProps.keyField}
          data={gridProps.items}
          gridConfig={gridProps.gridConfig}
          //onSelectionChanged={props.onSelectionChanged}

          actionButtons={{
            actions: [
              {
                name: "delete",
              },
            ],
            width: 225,
          }}
          onSaving={onSaving}
        />
      </div>
    </div>
  );
};

export default connect(
  (state: ApplicationState) => state.emitents,
  mapDispatchToProps
)(Emitents);
