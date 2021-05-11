import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import { NotFound, Profile, Settings } from './Pages/';
import { Header } from './Components';

const App : React.FunctionComponent = () : React.ReactElement =>
{
    return (
        <div>
            <Header/>
            
            <Router>
                <Switch>
                    <Route exact path={`/dashboard/${ process.env.SERVICE_NAME }/`} component={ Settings } />
                    <Route exact path={`/dashboard/${ process.env.SERVICE_NAME }/profile`} component={ Profile } />
                    <Route path={`/dashboard/${ process.env.SERVICE_NAME }/`} component={ NotFound } />
                </Switch>
            </Router>
        </div>
    );
};

export default App;
