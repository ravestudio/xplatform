import * as React from 'react'
import NavMenu from './NavMenu'
import Container from '@material-ui/core/Container'

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <NavMenu />
        <Container maxWidth="md">
            {props.children}
        </Container>
    </React.Fragment>
);