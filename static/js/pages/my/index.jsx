import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './myService.js';
import Commonfn from '../../base/commonfn.js'
import Store from '../../store.js';
import Tips from '../../../../../../common/utils/Tips.jsx';
export default class My extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			tips:'',
			loading: false,
			myData: {}, // 页面数据
			userData: {}, // 用户信息
		}
	}
	componentWillMount () {
		document.title = '我的'
	}
	componentDidUpdate () {
		
	}
	componentDidMount () {
		this.loadData()
	}
	componentWillReceiveProps (newProps) {

	}
	componentWillUnmount () {
		
	}
	/**
	 * [加载页面数据]
	 */
	loadData = () => {
		this.getData()
		this.getMyInfo()
	}
	showTips=(tips)=>{
		this.setState({
            tips:tips
        });
        let _this = this;
        setTimeout(function(){
            _this.setState({tips:''});
        },4500);
	}
	/**
	 * [获得页面数据]
	 */
	getData = () => {
		let _this = this
		this.setState({
			loading: true
		})
		Service.getMy().then((resp) => {
			console.log('resp', resp)
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let myData = resp.data
					_this.setState({
						myData
					})
					break;
				case 111:
					Commonfn.aotoLogin()
					break;
				default:
					alert(resp.msg)
					break;

			}
		})
	}
	/**
	 * [获得我的信息]
	 */
	getMyInfo = () => {
		let _this = this
		this.setState({
			loading: true
		})
		Service.getMyInfo().then((resp) => {
			console.log('resp2', resp)
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let userData = resp.data
					_this.setState({
						userData
					})
					break;
				case 111:
					Commonfn.aotoLogin()
					break;
				default:
					alert(resp.msg)
					break;
			}
		})
	}
	/**
	 * [跳转全部或者精华页面]
	 */
	goto = (e) => {
		let type = e.currentTarget.getAttribute("data-type")
		Store.instance.initAllPhotos()
		hashHistory.push({
			pathname: 'allphotos',
			query: {
				type
			}
		})
	}
	/**
	 * [跳转页面]
	 */
	gotoUrl = (e) => {
		let router = e.currentTarget.getAttribute("data-router")
		hashHistory.push(router)
	}
	showWait=()=>{
		this.showTips("敬请期待");
	}
	render () {
		return (
			<div className='my-content'>
				{/*头部用户*/}
				<div className='top flex flex-center'>
					<div className='user flex flex-column'>
						<div className='user-bg flex flex-center flex-ver-center'>
							
							{
								this.state.userData.avatar ? <img src={this.state.userData.avatar} /> : <img src='img/headExample.jpg'/>
							}
						</div>
						<p className='user-name'>{this.state.userData.username}</p>
					</div>
				</div>
				{/*中间我的图片及选项*/}
				<div className='mid'>
					<div className='bottomline'>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<span>我的图片</span>
							</div>
							<div className='item-right flex flex-ver-center' data-type='-1' onClick={this.goto.bind(this)}>
								<span>全部</span>
								<img src="img/icon-right.png"/>
							</div>
					 	</div>
					</div>
					{/*选项*/}
					<div className='meun flex flex-space-around flex-ver-center'>
						<div className='meun-item flex flex-ver-center flex-column flex-center' data-type='-1' onClick={this.goto.bind(this)}>
							<div>{this.state.myData.all}</div>
							<span>全部</span>
						</div>
						<div className='meun-item flex flex-ver-center flex-column flex-center' data-type='1' onClick={this.goto.bind(this)}>
							<div>{this.state.myData.star}</div>
							<span>精华</span>
						</div>
						<div className='meun-item flex flex-ver-center flex-column flex-center' data-router='caogao' onClick={this.gotoUrl.bind(this)}>
							<div>{this.state.myData.draft}</div>
							<span>草稿</span>
						</div>
					</div>
				</div>
			{/*中间我的服务及选项*/}
				{/*
				<div className='mid'>
					<div className='bottomline'>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<span>我的服务</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<span>全部</span>
								<img src="img/icon-right.png"/>
							</div>
					 	</div>
					</div>
					<div className='meun flex flex-space-around flex-ver-center'>
						<div className='meun-item flex flex-ver-center flex-column flex-center'>
							<img src="img/icon-geren.png"/>
							<span>个人影展</span>
						</div>
						<div className='meun-item flex flex-ver-center flex-column flex-center'>
							<img src="img/icon-huace.png"/>
							<span>画册印刷</span>
						</div>
						<div className='meun-item flex flex-ver-center flex-column flex-center'>
							<img src="img/icon-jifen.png"/>
							<span>积分兑换</span>
						</div>
					</div>
				</div>
				*/}
				{/*底部菜单*/}
				<div className='bottom'>
					<div className='bottomline' data-router='shoucang' onClick={this.gotoUrl.bind(this)}>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<img src="img/icon-xin.png"/>
								<span>收藏的图片</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<img src="img/icon-right.png"/>
							</div>
						</div>
					</div>
					<div className='bottomline' onClick={this.showWait}>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<img src="img/icon-qi.png"/>
								<span>收件地址管理</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<img src="img/icon-right.png"/>
							</div>
						</div>
					</div>
					<div className='bottomline' onClick={this.showWait}>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<img src="img/icon-guanzhu.png"/>
								<span>关注公众号及时获得最新活动消息和动态</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<img src="img/icon-right.png"/>
							</div>
						</div>
					</div>
					{/*
					<div className='bottomline'>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<img src="img/icon-xiaochengx.png"/>
								<span>中国国家地理小程序推荐</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<img src="img/icon-right.png"/>
							</div>
						</div>
					</div>
					<div className='bottomline'>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<img src="img/icon-help.png"/>
								<span>帮助中心</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<img src="img/icon-right.png"/>
							</div>
						</div>
					</div>
					<div className='bottomline'>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<img src="img/icon-shangwu.png"/>
								<span>商务合作</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<img src="img/icon-right.png"/>
							</div>
						</div>
					</div>
					<div className='bottomline'>
						<div className='info-item flex flex-space-between'>
							<div className='item-left flex flex-ver-center'>
								<img src="img/icon-out.png"/>
								<span>切换登录</span>
							</div>
							<div className='item-right flex flex-ver-center'>
								<img src="img/icon-right.png"/>
							</div>
						</div>
					</div>
					*/}
				</div>
				<Tips words={this.state.tips}></Tips>
			</div>
		)
	}
}