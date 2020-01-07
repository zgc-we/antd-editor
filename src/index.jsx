
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './App.css';

import Editor from './pages/editor.jsx';
import preview from './pages/preview.jsx';
import { Router, Route, hashHistory,IndexRoute } from 'react-router'
ReactDOM.render(
(<Router>
	<Route path="/" component={Editor}/>
    <Route path="/editor" component={Editor}/>
    <Route path="/preview" component={preview}/>
  </Router>
),
  document.getElementById('root')
);
