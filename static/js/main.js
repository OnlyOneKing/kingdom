import React from 'react';
import ReactDom from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import $ from 'jquery';
injectTapEventPlugin();

import Router from "./Router.jsx"

ReactDom.render(
	<Router />,
	document.getElementById('app-container')
)
