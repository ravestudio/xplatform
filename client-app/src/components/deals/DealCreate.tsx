import React from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as SecuritiesStore from '../../store/Securities'
import {
    Paper, Button, TextField, FormControl, InputLabel, Select, MenuItem
} from '@material-ui/core'
import { Security } from '../../store/Securities'
import { Account } from '../../store/Accounts'
import { ApplicationState } from '../../store'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

interface EditDealDialogProps {
    securities: Security[],
    accounts: Account[]
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

const DealCreate: React.FC<EditDealDialogProps> = (props) => {

    const classes = useStyles();
    return (
        <Paper>

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
                <div>
                    <Button color="primary">
                        Cancel
                    </Button>
                    <Button color="primary">
                        Subscribe
                    </Button>
                </div>
            </form>

        </Paper>
    )
}

export default connect(
    (state: ApplicationState) => ({
        securities: state.securities?.securities,
        accounts: state.accounts?.accounts
    }),
    (dispatch) => bindActionCreators({
        requestSecurities: SecuritiesStore.actionCreators.requestSecurities
    }, dispatch)
)(DealCreate as any);