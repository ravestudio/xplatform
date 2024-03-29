import * as React from "react";
import Header from "./Header";
import Container from "@mui/material/Container";

import Login from "../auth/Login";
import InfoBlock from "./InfoBlock";

import { createStyles, Theme, makeStyles } from "@mui/material/styles";

const drawerWidth = 240;

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9) + 1,
      },
    },
    drawerPaper: {
      width: drawerWidth,
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    //toolbar: theme.mixins.toolbar,
    content: {
      flexGrow: 0,
      width: "100%",

      backgroundColor: theme.palette.background.default,
      padding: theme.spacing(3),
    },
  })
);

export default (props: { children?: React.ReactNode }) => {
  const styles = useStyles();

  return (
    <div className={styles.root}>
      <Header />

      <Container maxWidth="md">
        <div className={styles.toolbar} />
        {props.children}

        <InfoBlock />
      </Container>
    </div>
  );
};
