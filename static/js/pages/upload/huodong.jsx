import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './service.js';
import Commonfn from '../../base/commonfn.js'
import Store from '../../store.js';
export default class Huodong extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			nowtime:Date.parse(new Date())/1000,
			huodongList: [], // 活动列表
			loading: false, // 显示加载中
			selectNone: false, // 不参加任何活动
			aid: '', // 选择的活动id
		}
	}
	componentWillMount () {
		document.title = '选择活动'
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
		this.getHuodongList()
	}
	/**
	 * [获得活动列表]
	 */
	getHuodongList = () => {
		let _this = this
		this.setState({
			loading: true
		})
		Service.huodongList().then(resp => {
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					console.log('活动列表', resp)
					let huodongList = resp.data
					let haveSelect = Store.getInstance().index.aid
					if (Store.getInstance().index.aname == '不参加活动') {
						this.state.selectNone = true
					}
					if (huodongList.length > 0) {
						huodongList.forEach((item) => {
							item.select = false
							// 对列表进行初始化
							if (haveSelect) {
								this.state.selectNone = false
								if (item.id == haveSelect) {
									item.select = true
									item.status = 0
								} else if (item.child.length > 0) {
									for (let i = 0; i < item.child.length; i++) {
										if (item.child[i].id == haveSelect) {
											item.child[i].select = true
											item.status = 2
											break
										} else {
											item.status = 1
										}
									}
								} else {
									item.child.length > 0 ? item.status = 1 : item.status = 0
								}
							} else {
								item.child.length > 0 ? item.status = 1 : item.status = 0 // status 0 没有子征集 1 有子征集且折叠 2 有子征集且展开
							}
						})
					}
					_this.setState({
						huodongList
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
	 * [不参加活动]
	 */
	handleSelectNone = () => {
		let selectNone = this.state.selectNone
		let huodongList = [...this.state.huodongList]
		huodongList.forEach((item) => {
			item.select = false
			if (item.child.length > 0) {
				item.child.forEach((sitem) => {
					sitem.select = false
				})
			}
		})
		Store.getInstance().index.aid = ''
		Store.getInstance().index.aname = '不参加活动'
		this.setState({
			selectNone: !selectNone,
			huodongList,
		})
	}
	/**
	 * [选择活动]
	 */
	handleSelect = (index, e) => {
		let huodongList = [...this.state.huodongList]
		
		huodongList.forEach((item) => {
			if (item.id != huodongList[index].id) {
				item.select = false
			}
			if (item.child.length > 0) {
				item.child.forEach((sitem) => {
					sitem.select = false
				})
			}
		})
	
		if (huodongList[index].child.length > 0) {
			let status = huodongList[index].status
			status === 1 ? huodongList[index].status = 2 : huodongList[index].status = 1
		} else {
			let select = huodongList[index].select
			huodongList[index].select = !select
			this.setState({
				selectNone: false
			})
		}
		console.log('huodongList1', huodongList)
		this.setState({
			huodongList
		})
	}
	/**
	 * [选择子活动]
	 */
	handleSelectItem = (index, e) => {
		let findex = e.currentTarget.getAttribute('data-findex')
		let huodongList = [...this.state.huodongList]
		huodongList.forEach((item) => {
			if (item.id != huodongList[findex].id) {
				item.select = false
			}
			if (item.child.length > 0) {
				item.child.forEach((sitem) => {
					if (sitem.id != huodongList[findex].child[index].id) {
						sitem.select = false
					}
				})
			}

		})
		let select = huodongList[findex].child[index].select
		huodongList[findex].child[index].select = !select
		this.setState({
			selectNone: false,
			huodongList
		})
	}
	/**
	 * [跳转页面]
	 */
	goto = (e) => {
		let huodongList = [...this.state.huodongList]
		// 清空缓存
		Store.getInstance().index.aid = ''
		Store.getInstance().index.aname = ''
		Store.getInstance().info.rule.need_pic_desc = 0
		huodongList.forEach((item) => {
			if (item.select) {
				Store.getInstance().index.aid = item.id
				Store.getInstance().index.aname = item.title
				Store.getInstance().info.rule.need_pic_desc = item.need_pic_desc
			}
			if (item.child.length > 0) {
				item.child.forEach((sitem) => {
					if (sitem.select) {
						Store.getInstance().index.aid = sitem.id
						Store.getInstance().index.aname = sitem.title
						Store.getInstance().info.rule.need_pic_desc = sitem.need_pic_desc
					}
				})
			}
		})
		if (this.state.selectNone) {
			Store.getInstance().index.aid = ''
			Store.getInstance().index.aname = '不参加活动'
		}
		if(Store.getInstance().index.aid){
			hashHistory.push('info?aid='+Store.getInstance().index.aid+'&aname='+Store.getInstance().index.aname);
		}else{
			hashHistory.goBack();
		}
	}
	render () {
		return (
			<div className='huodong-content'>
				<div className='info-part'>
					<div className='info-item info-item-none flex flex-space-between' onClick={this.handleSelectNone}>
						<div className='item-left flex flex-ver-center'>
								<span>不参加活动</span>
						</div>
						<div className='item-right flex flex-ver-center'>
							{
								this.state.selectNone ? 
								<img src="img/icon-select.png"/> : 
								<img src="img/icon-noselect.png"/>
							}
						</div>
					</div>  
					{
						this.state.huodongList.length > 0 ?
						this.state.huodongList.map((item, index) => {
							let _this = this
							let lefttime = (item.end_time-this.state.nowtime)<60*60*24*30;
							return (
									<div className='info-item-all'  key={index}>
										<div className='info-item flex flex-space-between' onClick={_this.handleSelect.bind(this, index)}>
											<div className='item-left flex flex-ver-center'>
												{
													item.status === 0 ? 
													<img src="img/icon-huodong.png"/> : 
													item.status === 1 ? 
													<img src="img/icon-huodongadd.png"/> :
													<img src="img/icon-huodongjian.png"/>
												}
												{}
												<span>{item.title}</span>
												{
													lefttime&&lefttime>0?
													<img className="hotrunning" src="img/hotfire.png" alt=""/>:
													<div style={{display:'none'}}></div>
												}
												
											</div>
											<div className='item-right flex flex-ver-center'>
												{
													item.status === 0 ?  
													(item.select ? <img src="img/icon-select.png"/> : <img src="img/icon-noselect.png"/>)  : ''
												}
											</div>
										</div>
										{	
											item.status === 2 ?
											item.child.map((sitem, sindex) => {
												return (
													<div className='border-half' key={sindex} data-findex={index} onClick={_this.handleSelectItem.bind(this, sindex)}>
														<div className='info-item info-sitem info-item-none flex flex-space-between' >
															<div className='item-left flex flex-ver-center'>
																<span>{sitem.title}</span>
															</div>
															<div className='item-right flex flex-ver-center'>
																{
																	sitem.select ? <img src="img/icon-select.png"/> : <img src="img/icon-noselect.png"/>
																}
															</div>
														</div> 
													</div>
													)
											}) : ''
										}
									</div>
								)
						}) : ''
					}
				</div>
				{/*底部确定按钮*/}
				<div className='btn-ok' onClick={this.goto.bind(this)}>确定</div>
			</div>
		)
	}
}