import React, { PropTypes } from 'react';
import {hashHistory} from 'react-router';
import $ from 'jquery';
import Store from '../store.js'
import StoreEvent from '../base/storeEvent.js';
import Commonservice from './commonservice.js';
export default class Pclogin extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			show:false
		}
	}
	componentDidMount(){
		
	}
	componentWillUnmount(){
	}
	componentWillReceiveProps(newProps){
		this.setState({
			show:newProps.showlogin
		});
	}
	// 检查是否显示返回顶部或者返回首页
	
	
	render () {
		return (
			<div className="pclogin-page" style={{padding:'0 40px',display:this.state.show?'block':'none'}}>
				<div className="pclogin-background flex-column flex-center flex-ver-center">
					<div className="pclogin-title">选择登录方式</div>
					<a href={'http://photo.dili365.com/user/webWxLogin?getRedirectUrl='+encodeURIComponent(window.location.href)} className='pclogin-btn wx flex flex-ver-center'>
						<img src="img/wx.svg" alt=""/>
						<div>微信登录</div>
					</a>
					<a href={'http://photo.dili365.com/user/webWbLogin?getRedirectUrl='+encodeURIComponent(window.location.href)} className='pclogin-btn wb flex flex-ver-center'>
						<img src="img/wb.svg" alt=""/>
						<div>微博登录</div>
					</a>
				</div>
			</div>
		)
	}
	
}