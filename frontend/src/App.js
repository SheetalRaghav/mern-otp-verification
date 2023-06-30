import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Verification from './components/Verification';
import ForgetPassword from './components/ForgetPassword';

function App() {
  return (
    <Router>
        <Switch>
          <Route exact path="/" component={Register} />
          <Route path="/login" component={Login} exact={true} />
          <Route path="/verify" component={Verification} exact={true} />
          <Route path="/forgot-password" component={ForgetPassword} exact={true} />
        </Switch>
    </Router>
  );
}

export default App;



                         