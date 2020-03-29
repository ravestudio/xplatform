import React, { useState } from 'react'
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

type OperProps = {
    input: any,
    rest: any
}

const radioButton = ({ input, ...rest }: OperProps) => (

    <FormControl>
        <FormLabel component="legend">Operation</FormLabel>
        <RadioGroup {...input} {...rest} defaultValue="1">
            <FormControlLabel value="1" control={<GreenRadio />} label="Buy" labelPlacement="end" />
            <FormControlLabel value="2" control={<Radio />} label="Sell" labelPlacement="end" />
        </RadioGroup>
    </FormControl>
    
)

const DateField = (props:any) => {
    const {
        meta: { submitting, error, touched },
        input: { onBlur, value, ...inputProps },
        ...others
    } = props;

    const onChange = (date:any) => {
        Date.parse(date) ? inputProps.onChange(date.toISOString()) : inputProps.onChange(null);
    };

    return (
        <KeyboardDatePicker
            {...inputProps}
            {...others}
            disableToolbar
            format="dd/MM/yyyy"
            value={value ? new Date(value) : null}
            disabled={submitting}
            onBlur={() => onBlur(value ? new Date(value).toISOString() : null)}
            error={error && touched}
            onChange={onChange}
        />
    );
};

const TimeField = (props: any) => {
    const {
        meta: { submitting, error, touched },
        input: { onBlur, value, ...inputProps },
        ...others
    } = props;

    const onChange = (date: any) => {
        Date.parse(date) ? inputProps.onChange(date.toISOString()) : inputProps.onChange(null);
    };

    return (
        <KeyboardTimePicker
            {...inputProps}
            {...others}
            disableToolbar
            value={value ? new Date(value) : null}
            disabled={submitting}
            onBlur={() => onBlur(value ? new Date(value).toISOString() : null)}
            error={error && touched}
            onChange={onChange}
        />
    );
};



const DealForm = (props: any) => {

    const { handleSubmit, accounts = [], securities = [] } = props

    const [date, setDate] = useState(new Date());

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
                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))}
                        
                    </Field>
                </Grid>

                <Grid item xs={3}>
                    <Field
                        name="deal-security"
                        component={renderSelectField}
                        label="Security"
                        fullWidth
                    >
                        {securities.map((s: any) => (
                            <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                        ))}
                    </Field>
                </Grid>
            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>
                    <Field name="dealOperation" component={radioButton} row />
                </Grid>
            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>

                    <Field name="dealDate"
                        component={DateField}
                        fullWidth
                        label="Deal Date"
                        variant="inline"
                    />
                </Grid>

                <Grid item xs={3}>

                    <Field name="dealTime"
                        component={TimeField}
                        ampm={false}
                        variant="inline"
                        fullWidth
                        label="Deal Time"
                        />
                </Grid>

                <Grid item xs={3}>

                    <Field name="deliveryDate"
                        component={DateField}
                        fullWidth
                        label="Delivery Date"
                        variant="inline"
                    />
                </Grid>
            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>

                    <Field
                        fullWidth
                        name="dealPrie"
                        component={renderTextField}
                        label="Price"
                    />
                </Grid>

                <Grid item xs={3}>

                    <Field
                        fullWidth
                        name="dealCount"
                        component={renderTextField}
                        label="Count"
                    />
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
        accounts: state.accounts?.accounts,
        initialValues: {
            dealOperation: "1",
            dealDate: new Date().toISOString(),
            deliveryDate: null,
            //dealDate: "lll",
            dealTime: null
        }
    })
)(dealForm);