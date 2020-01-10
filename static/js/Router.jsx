import React from 'react';
import {Router,Route,hashHistory,IndexRoute} from 'react-router';
import { createHashHistory } from 'history';
var routerHistory = require('react-router').useRouterHistory;   //去掉?_k=****
const appHistory = routerHistory(createHashHistory)({ queryKey: false }) ;
// page
import Index from './pages/index.jsx';

export default class InitialRouters extends React.Component {
  constructor(props) {
    super(props);
    this.state={'routes':{}}
  }
  initRoute = () => {
    const routes = {};
    routes.childRoutes = []
    routes.path = '/';
    routes.indexRoute = {component : Index};
    routes.childRoutes.push({'path' : '/:id','component' : Index});
    this.setState({
      routes : routes
    })
  }
  componentWillMount = () => {
    this.initRoute()
  }
  render () {
    return (
      <div>
        <Router routes={this.state.routes} history={hashHistory} />
      </div>
    )
  }
}








