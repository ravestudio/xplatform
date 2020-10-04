import * as React from "react";
import { Snackbar, Button, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const Message = (props: { bottom: number }) => (
  <Snackbar
    style={{ bottom: props.bottom }}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    open={true}
    autoHideDuration={6000}
    //onClose={handleClose}
    message="Note archived"
    action={
      <React.Fragment>
        <Button color="secondary" size="small">
          UNDO
        </Button>
        <IconButton size="small" aria-label="close" color="inherit">
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>
    }
  />
);

const InfoBlock: React.SFC = () => {
  return (
    <React.Fragment>
      <Message bottom={80} />

      <Message bottom={24} />
    </React.Fragment>
  );
};

export default InfoBlock;
