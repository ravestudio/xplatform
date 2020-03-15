import * as React from 'react'
import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    TextField, FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core'
import { Security } from '../../store/Securities'
import { Account } from '../../store/Accounts'

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface EditDealDialogProps {
    securities: Security[],
    accounts: Account[],
    open: boolean
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            '& .MuiFormControl-root': {
                margin: theme.spacing(1),
                width: 200,
            },
        },
    }),
);

const EditDealDialog: React.FC<EditDealDialogProps> = (props) => {

    const classes = useStyles();
    return (
        <Dialog open={props.open}>
            <DialogTitle id="EditDeal-dialog-title">Add Deal</DialogTitle>
            <DialogContent>
                <form className={classes.root}>
                    <div>
                        <TextField id="deal-number" label="Number" />

                        <FormControl>
                            <InputLabel id="account-select-label">Account</InputLabel>
                            <Select
                                labelId="account-select-label"
                                id="account-select"
                            >
                                {props.accounts.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl>
                            <InputLabel id="security-select-label">Security</InputLabel>
                            <Select
                                labelId="security-select-label"
                                id="security-select"
                            >
                                {props.securities.map(s => (
                                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </form>
            </DialogContent>
            <DialogActions>
                <Button color="primary">
                    Cancel
          </Button>
                <Button color="primary">
                    Subscribe
          </Button>
            </DialogActions>
        </Dialog>
    )
}

export default EditDealDialog