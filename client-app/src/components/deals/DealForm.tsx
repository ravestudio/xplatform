import React from 'react'
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import Grid from '@material-ui/core/Grid';
import { Button, TextField, FormControl, FormControlLabel, FormLabel, InputLabel, Select, MenuItem } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors';
import Radio, { RadioProps } from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import { createStyles, makeStyles, Theme, withStyles } from '@material-ui/core/styles';
import {
    KeyboardDatePicker, KeyboardTimePicker
} from '@material-ui/pickers';
import { ApplicationState } from '../../store';


const GreenRadio = withStyles({
    root: {
        color: green[400],
        '&$checked': {
            color: green[600],
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);

const RedRadio = withStyles({
    root: {
        color: red[400],
        '&$checked': {
            color: red[600],
        },
    },
    checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);


interface TFProps {
    label: any,
    input:any,
    meta: any,
    custom:any
}

const renderTextField: React.FC<TFProps> = (props) => {
    const { input, label, meta: { touched, invalid, error }, ...custom } = props
    return (
        <TextField
            label={label}
            placeholder={label}
            error={touched && invalid}
            helperText={touched && error}
            {...input}
            {...custom}
        />
    )
}

interface SelectProps {
    label: any,
    input: any,
    meta: any,
    children: any,
    custom: any
}

const renderSelectField: React.FC<SelectProps> = (props) => {
    const {
        input,
        label,
        meta: { touched, error },
        children,
        ...custom } = props

    return (
        <FormControl error={touched && error} {...custom}>
            <InputLabel htmlFor="age-native-simple">{label}</InputLabel>
            <Select
                {...input}
                inputProps={{
                    name: 'age',
                    id: 'age-native-simple'
                }}
            >
                {children}
            </Select>
        </FormControl>
    )
}

const DealForm = (props: any) => {

    const { handleSubmit, accounts = [], securities=[] } = props

    return (
        <form onSubmit={handleSubmit}>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>

                    <Field
                        fullWidth
                        name="deal-number"
                        component={renderTextField}
                        label="Number"
                        
                    />
                </Grid>

                <Grid item xs={3}>

                    <Field
                        
                        name="deal-account"
                        component={renderSelectField}
                        label="Account"
                        fullWidth
                    >
                        {accounts.map((s: any) => (
                            <MenuItem value={s.id}>{s.name}</MenuItem>
                        ))}
                        
                    </Field>
                </Grid>

                <Grid item xs={3}>
                    <FormControl fullWidth>
                        <InputLabel id="security-select-label">Security</InputLabel>
                        <Select
                            labelId="security-select-label"
                            id="security-select"
                        >
                            {securities.map((s:any) => (
                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>
                    <FormControl component="fieldset" fullWidth>
                        <FormLabel component="legend">Operation</FormLabel>
                        <RadioGroup row aria-label="position" name="position" defaultValue="top">
                            <FormControlLabel
                                value="top"
                                control={<GreenRadio />}
                                label="Buy"
                                labelPlacement="end"
                            />
                            <FormControlLabel
                                value="start"
                                control={<RedRadio />}
                                label="Sell"
                                labelPlacement="end"
                            />
                        </RadioGroup>
                    </FormControl>
                </Grid>
            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>
                    <KeyboardDatePicker
                        fullWidth
                        id="dealDate"
                        label="Deal Date"
                        variant="inline"
                        format="dd.MM.yyyy"
                        value={new Date()}
                        onChange={(date) => console.log(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </Grid>
                <Grid item xs={3}>
                    <KeyboardTimePicker
                        fullWidth
                        disableToolbar
                        variant="inline"
                        ampm={false}
                        id="dealTime"
                        label="Deal Time"
                        value={new Date()}
                        onChange={(date) => console.log(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </Grid>

                <Grid item xs={3}>
                    <KeyboardDatePicker
                        fullWidth

                        id="deliveryDate"
                        label="Delivery Date"
                        variant="inline"
                        format="dd.MM.yyyy"
                        value={new Date()}
                        onChange={(date) => console.log(date)}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
                </Grid>
            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>
                    <TextField id="deal-price" label="Price" fullWidth />
                </Grid>

                <Grid item xs={3}>
                    <TextField id="deal-count" label="Count" fullWidth />
                </Grid>

                <Grid item xs={3}>
                    <TextField id="deal-nkd" label="NKD" fullWidth />
                </Grid>

            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={6}>
                </Grid>

                <Grid item xs={3}>
                    <TextField id="deal-volume" label="Volume" fullWidth disabled />
                </Grid>

            </Grid>
            <div>
                <Button color="primary" type="submit">
                    Submit
                        </Button>
                <Button color="secondary">
                    Cancel
                        </Button>
            </div>
        </form>
    )
}

let dealForm = reduxForm({
    // a unique name for the form
    form: 'deal'
})(DealForm as any)

export default connect(
    (state: ApplicationState) => ({
        securities: state.securities?.securities,
        accounts: state.accounts?.accounts
    })
)(dealForm);