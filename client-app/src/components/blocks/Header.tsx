import * as React from 'react';
import clsx from 'clsx';
import AppBar from '@material-ui/core/AppBar'
import ToolBar from '@material-ui/core/Toolbar'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { useStyles } from './Layout'
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { ReactComponent as Logo } from '../../logo2.svg';
import SvgIcon from "@material-ui/core/SvgIcon";

const DrawList = () => (
    <List>
        {['Common info', 'Documents', 'Address', 'Contacts'].map((text, index) => (
            <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
            </ListItem>
        ))}
    </List>
)

export default function Header() {
    const classes = useStyles();
    const theme = useTheme();

    const matches = useMediaQuery(theme.breakpoints.up('sm'));

    const [open, setOpen] = React.useState(false);

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerOpen = () => {

        if (!matches) {
            setMobileOpen(true)
        }

        else {
            setOpen(true);
        }
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <ToolBar>

                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>

                    <SvgIcon component={Logo} viewBox="100 80 750 450" fontSize="large" />

                    <Typography variant="h6" noWrap>
                        XPlatform.Net
                    </Typography>
                </ToolBar>
            </AppBar>

            <Hidden smUp implementation="css">
                <Drawer
                    variant="temporary"
                    anchor='left'
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    classes={{
                        paper: classes.drawerPaper,
                    }}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                >

                </Drawer>
            </Hidden>

            <Hidden xsDown implementation="css">
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar}>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />

                </Drawer>
            </Hidden>
        </React.Fragment>
    )
    
}