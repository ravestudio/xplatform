import React, { useState, useEffect } from 'react'
import { Field, change, reduxForm, formValueSelector } from 'redux-form'
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
import { SecuritiesState, Security } from '../../store/Securities';

import NumberFormat from 'react-number-format';

interface NumberFormatCustomProps {
    inputRef: (instance: NumberFormat | null) => void;
    //onChange: (event: { target: { value: string } }) => void;
    onChange: (value: string) => void
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
    const { inputRef, onChange, ...other } = props;

    return (
        <NumberFormat
            {...other}
            getInputRef={inputRef}
            onValueChange={(values) => {
                onChange(values.value);
            }}
            isNumericString
        />
    );
}

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
            InputProps={{
                inputComponent: NumberFormatCustom as any,
            }}

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

    useEffect(() => {
        console.log("change");

        props.dispatch(change("dealForm", "dealVolume",
            props.nominalPrice ? props.price * props.nominalPrice * props.count / 100
                : props.price * props.count));
    });

    return (
        <form onSubmit={handleSubmit}>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={3}>

                    <Field
                        fullWidth
                        name="dealNumber"
                        component={renderTextField}
                        label="Number"
                        
                    />
                </Grid>

                <Grid item xs={3}>

                    <Field
                        name="dealAccount"
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
                        name="dealSecurity"
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
                        name="dealPrice"
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

                    <Field
                        fullWidth
                        name="dealNkd"
                        component={renderTextField}
                        label="NKD"
                    />
                </Grid>

            </Grid>

            <Grid
                container
                justify="flex-start"
                spacing={3}>

                <Grid item xs={6}>{props.nominalPrice ? `nominal price:${props.nominalPrice}`: null}
                </Grid>

                <Grid item xs={3}>

                    <Field
                        fullWidth
                        disabled
                        name="dealVolume"
                        component={renderTextField}
                        label="Volume"
                    />
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

const SelectingDealForm = reduxForm({
    // a unique name for the form
    form: 'dealForm'
})(DealForm)

const selector = formValueSelector('dealForm') // <-- same as form name


export default connect(
    (state: ApplicationState) => {

        const selectedSecurityId = selector(state, 'dealSecurity')

        const price = selector(state, 'dealPrice')
        const count = selector(state, 'dealCount')

        const getNominalPrice = (securities: Security[] | undefined, secId: number | undefined) => {

            if (securities === undefined || secId === undefined) {
                return 0
            }

            return securities.find(s => s.id === selectedSecurityId)?.nominalPrice
        }

        return {
            securities: state.securities?.securities,
            accounts: state.accounts?.accounts,
            nominalPrice: getNominalPrice(state.securities?.securities, selectedSecurityId),
            price: price,
            count: count,
            initialValues: {
                dealOperation: "1",
                dealDate: new Date().toISOString(),
                deliveryDate: null,
                //dealDate: "lll",
                dealTime: null,
                nominalPrice: null,
                dealVolume: null
            }
        }
    }
)(SelectingDealForm);