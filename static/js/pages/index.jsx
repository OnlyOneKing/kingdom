import React from 'react';
import ReactDom from 'react-dom';
import Content from './Content.jsx';
import Bottom from './bottom.jsx';
import Top from './top.jsx';
import Pclogin from './pclogin.jsx';
import Store from '../store.js';
import StoreEvent from '../base/storeEvent.js';
import 'react-dynamic-swiper/lib/styles.css';
import $ from 'jquery';
import WeChatUtil from '../../../../../common/utils/wechatUtil.js';
import {
	hashHistory
} from 'react-router';
import fn from '../../../../../common/utils/fn.js';
export default class Index extends React.Component{
	constructor(props) {
		super(props);
		this.state = {
			showlogin:false,
			is_open:-1
		}
		if(!this.props.location.pathname||this.props.location.pathname=='/'){
			hashHistory.replace('index');
		}
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		WeChatUtil.getInstance();
		let w = document.documentElement.clientWidth;
		if (document.documentElement.clientWidth>550) {w=414;}
		$('html').css('font-size',20 * (w / 320) + 'px');
		if(fn.isMobile()){
			Store.getInstance().clientWidth = parseInt(2*$(document).width());
		}else{
			Store.getInstance().clientWidth = 414;
		}
		let $this = this;
		StoreEvent.getInstance().addEvent(
            "PC_LOGIN", function getdataOver() {
            	if(!$this.state.showlogin)
            	$this.setState({showlogin:true});
            }
        );
        StoreEvent.getInstance().addEvent(
            "PC_LOGIN_HIDE", function getdataOver() {
            	if($this.state.showlogin)
            	$this.setState({showlogin:false});
            }
        );
	}
	componentWillReceiveProps(newProps){
		
	}	
	render() {
		return(
			<div className="body">
				<Content {...this.props}></Content>
				<Bottom {...this.props}></Bottom>
				<Top {...this.props}></Top>
				<Pclogin {...this.state}>></Pclogin>
			</div>
		)
	}
}
