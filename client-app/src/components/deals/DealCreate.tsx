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
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';

interface EditDealDialogProps {
    securities: Security[],
    accounts: Account[],
    classes: {
        root: string
    }
}

const styles = (theme: Theme) =>({
        root: {
            '& .MuiFormControl-root': {
                margin: theme.spacing(1),
                width: 200,
            },
        },
    })

class DealCreate extends React.PureComponent<EditDealDialogProps & typeof SecuritiesStore.actionCreators> {

    public componentDidMount() {
        this.props.requestSecurities();
    }

    public render() {

        return (
            <Paper>

                <form className={this.props.classes.root}>
                    <div>
                        <TextField id="deal-number" label="Number" />

                        <FormControl>
                            <InputLabel id="account-select-label">Account</InputLabel>
                            <Select
                                labelId="account-select-label"
                                id="account-select"
                            >
                                {this.props.accounts.map(s => (
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
                                {this.props.securities.map(s => (
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
}

export default connect(
    (state: ApplicationState) => ({
        securities: state.securities?.securities,
        accounts: state.accounts?.accounts
    }),
    (dispatch) => bindActionCreators({
        requestSecurities: SecuritiesStore.actionCreators.requestSecurities
    }, dispatch)
)(withStyles(styles)(DealCreate as any));