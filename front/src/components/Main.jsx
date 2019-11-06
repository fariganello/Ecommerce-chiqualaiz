import React from 'react';
import { Route } from 'react-router-dom';

import SingleBookContainer from '../containers/SingleBookContainer';
import NavBarContainer from '../containers/NavbarContainer';

import LoginContainer from '../containers/LoginContainer';


export default() => {
    return (
        <div id='main'>
            <Route path='/' component={NavBarContainer} />
            <Route exact path='/login' component={LoginContainer} />
            <Route path='/book' component={SingleBookContainer}/>
        </div>
    
}