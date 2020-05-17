import * as React from 'react'
import Header from './Header'



import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';

const drawerWidth = 300;

export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
        },
        drawerPaper: {
            width: drawerWidth,
        },

        toolbar: theme.mixins.toolbar,
        content: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing(3),
        }
    })
)

export default (props: { children?: React.ReactNode }) => {

    const styles = useStyles()

    return (
        <div className={styles.root}>
            <Header />

            <div className={styles.content}>
                <div className={styles.toolbar} />
                {props.children}
            </div>

        </div>
    )
};