import React from 'react';
import { Route } from 'react-router';
import logo from './logo.svg';
import './App.css'
import Layout from './components/blocks/Layout'
import Emitents from './components/emitents/Emitents'
import Deals from './components/deals/Deals'
import DealCreate from './components/deals/DealCreate'

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru"

export default () => (
    <Layout>
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>
            <Route exact path='/deals' component={Deals} />
            <Route path='/deals/create' component={DealCreate} />
        </MuiPickersUtilsProvider>
    </Layout>
)
