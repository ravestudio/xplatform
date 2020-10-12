import React from 'react';
import {Switch, Route } from 'react-router';
import logo from './logo.svg';
import './App.css'
import Layout from './components/blocks/Layout'
import Emitents from './components/emitents/Emitents'
import Deals from './components/deals/Deals'
import DealCreate from './components/deals/DealCreate'
import Portfolio from './components/portfolio/Portfolio'
import Financials from './components/financials/Financials'
import Shares from './components/shares/Shares'

import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru"

import { TestComponent } from "client-libs";

export default () => (
    <Layout>
        
        <MuiPickersUtilsProvider utils={DateFnsUtils} locale={ruLocale}>

            <Route exact path='/' component={Shares} />
            <Route path='/deals' component={Deals} />
            <Route path='/createDeal' component={DealCreate} />
            <Route path='/portfolio' component={Portfolio} />
            <Route path='/financials/:code?' component={Financials} />

        </MuiPickersUtilsProvider>
    </Layout>
)
