import * as React from 'react'

import { Field, change, reduxForm, formValueSelector } from 'redux-form'

import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@material-ui/core'

interface LoginProps {
    open: boolean
}

interface TFProps {
    label: any,
    input: any,
    meta: any,
    custom: any
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


const AuthForm = reduxForm({
    // a unique name for the form
    form: 'authForm'
})(() => {

    return (
        <form>
            <Field
                fullWidth
                name="userName"
                component={renderTextField}
                label="User Name"

            />

            <Field
                fullWidth
                name="password"
                component={renderTextField}
                label="Password"
            />
        </form>
    )
})

const Login: React.SFC<LoginProps> = (props) => {

    return (
        <Dialog open={props.open}>
            <DialogTitle>Login</DialogTitle>

            <DialogContent>
                <AuthForm/>
            </DialogContent>
        </Dialog>
    )
}

export default Login