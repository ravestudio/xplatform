import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Form, ISubmitResult, IValues, minLength, required } from "../form";
import { ApplicationState } from "../../store";
import * as SecuritiesStore from "../../store/Securities";
import { Grid } from "@ravestudio/xgrid";
import "./Securities.scss";
import { updateSecurity } from "../../store/Securities";

const mapDispatchToProps = (dispatch: any) => {
  return {
    actions: bindActionCreators(SecuritiesStore.actionCreators, dispatch),
  };
};

type AuthProps = SecuritiesStore.SecuritiesState &
  ReturnType<typeof mapDispatchToProps>;

const Securities: React.FC<AuthProps> = (props: AuthProps) => {
  /*const [parameters, setParameters] = React.useState<string[]>([
    "code",
    "name",
    "isin",
  ]);*/
  const [checked, setChecked] = React.useState<string[]>([]);

  const handleSubmit = async (values: IValues): Promise<ISubmitResult> => {
    const obj = checked.reduce(
      (acc: any, current: string) => ({ ...acc, [current]: values[current] }),
      {}
    );

    const result = await updateSecurity({
      code: props.editModel.code,
      values: obj,
    });

    props.actions.updateSucces();

    return { success: true };
  };

  const onEditClick = (e: any) => {
    props.actions.requestEditModel(e.item.code);
  };

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
          field: "isin",
          headerName: "isin",
          width: 150,
        },
      ],
    },
    items: props.securities,
    //onSelectionChanged: this.onOpen.bind(this),
  };

  return (
    <div className="admin-securities">
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
                name: "edit",
                onClick: onEditClick,
              },
              {
                name: "delete",
              },
            ],
            width: 225,
          }}
          onSaving={onSaving}
        />
      </div>
      <div className="upd-form">
        {props.editModel && (
          <Form
            defaultValues={props.editModel}
            validationRules={{
              userName: { validator: required },
              password: [{ validator: required }],
            }}
            onSubmit={handleSubmit}
          >
            {Object.keys(props.editModel).map((pr) => (
              <div className="upd-param">
                <div className="current-value form-group">
                  <label>{pr}</label>
                  <div>{props.editModel[pr]}</div>
                </div>
                <div className="check-newv-alue">
                  <input
                    type="checkbox"
                    checked={checked.includes(pr)}
                    onChange={handleChange(pr)}
                  />
                </div>
                <Form.Field
                  name={pr}
                  label={pr}
                  disabled={!checked.includes(pr)}
                />
              </div>
            ))}
          </Form>
        )}
      </div>
    </div>
  );
};

export default connect(
  (state: ApplicationState) => state.securities,
  mapDispatchToProps
)(Securities);
