import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import { Swiper, Slide } from 'react-dynamic-swiper';
import 'react-dynamic-swiper/lib/styles.css';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './myService.js';
import Store from '../../store.js';
import Jiazai from '../../base/jiazai.jsx';
import Commonfn from '../../base/commonfn.js'
import InfiniteScroll from 'react-infinite-scroller'
import LazyLoad from 'react-lazyload'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js'
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js';
export default class Shoucang extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			page: Store.getInstance().shouCang.shouCang.page, // 图片数据分页页码
			limit: 5, // 每页数据
			dataList: Store.getInstance().shouCang.shouCang.dataList, // 全部图片数据列表
			status: Store.getInstance().shouCang.shouCang.status,  // 是否能继续加载
			loading: Store.getInstance().shouCang.shouCang.dataList.length > 0 ? false : true,
			toggleNav: Store.getInstance().shouCang.shouCang.toggleNav,
			sonScroll: Store.getInstance().shouCang.shouCang.sonScroll,
			loadingData: true, // 函数节流，防止多次加载

		}
	}
	componentWillMount () {
		document.title = '我的收藏'
	}
	componentDidUpdate () {

	}
	componentDidMount () {
		if (this.state.toggleNav) {
			$('body,html').animate({scrollTop: this.state.sonScroll}, 0)
			this.state.toggleNav = false
			Store.getInstance().shouCang.shouCang.toggleNav = false
		}

		this.loadData()
		// 微信分享
		this.setShare()
		window.onscroll = this.onScroll.bind(this)
	}
	componentWillReceiveProps (newProps) {

	}
	componentWillUnmount () {
		window.onscroll = null
	}
	/**
	 * [加载页面数据]
	 */
	loadData = () => {
		// 没有数据则加载进行中数据
		if (this.state.dataList.length === 0) {
			this.getDataList()
		} 
	}
	/**
	 * [微信分享 ]
	 */
	setShare = () => {
		let sharetitle = '中国国家地理图片'
		let sharedes = ''
		let shareTimeLinedes = sharedes;
		let link = window.location.href;
		let hideMenuItems = ['menuItem:share:facebook'];
        WeChatUtil.getInstance().set({'hideMenuItems':hideMenuItems,'title':sharetitle,'link':link,'desc':sharedes,'shareTimeLinedes':shareTimeLinedes,'showShare':true});
	}
	/**
	 * [获得图片数据列表]
	 */
	getDataList = () => {
		let _this = this
		
		if (this.state.page == -1) {
			this.state.status = false
			Store.getInstance().shouCang.shouCang.status = false
			return
		}
		if (this.state.loadingData == false) {
			return
		}
		this.state.loadingData = false
		let opt = {
			limit: this.state.limit,
			page: this.state.page,
		}
		Service.myCollect(opt).then((resp) => {
			console.log('resp1', resp)
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let dataList = [...this.state.dataList]
					let data = resp.data.list
					if (data.length > 0) {
						data.forEach((item) => {
							if (item.pic.length > 0) {
								item.pic[0].pic_desc = item.pic[0].pic_desc || item.pic[0].pic_desc == "" ? item.pic[0].pic_desc : item.pic[0].video_desc
								item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
								item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
								item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
							}
							item.allAddress = Commonfn.getAddress(item)
						})
					}
					dataList = dataList.concat(data)
					this.state.page = resp.data.next_page
					this.state.status = true
					this.state.loadingData = true
					Store.getInstance().shouCang.shouCang.dataList = dataList
					Store.getInstance().shouCang.shouCang.page = resp.data.next_page
					Store.getInstance().shouCang.shouCang.status = status

					_this.setState({
						dataList
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
	 * [滚动事件]
	 */
	onScroll = (e) => {
		let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
		let sonScroll = [...this.state.sonScroll]
		// 记录滚动高度
		sonScroll = scrollTop
		Store.getInstance().shouCang.shouCang.sonScroll = sonScroll
		this.setState({
			sonScroll
		})
	}
	/**
	 * [跳转到详情]
	 */
	gotoDetail = (e) => {
		let rid = e.currentTarget.getAttribute("data-id")
		Store.getInstance().shouCang.shouCang.toggleNav = true
		hashHistory.push({
			pathname: 'details',
			query: {
				rid
			}
		})
	}
	/**
	 * [点赞收藏]
	 */
	handleInteract = (e) => {
		if(this.state.loading)return;
		let _this = this
		let rid = e.currentTarget.getAttribute("data-id")
		let opt = {
			rid,
			type: 2
		}
		_this.setState({
			loading: true
		})
		Service.handleInteract(opt).then((resp) => {
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let dataList = [...this.state.dataList]
					if (dataList.length > 0) {
						dataList.forEach(item => {
							if (item.rid == rid) {
								item.is_collect == 1 ? item.is_collect = 0 : item.is_collect = 1
								return
							}
						})
					}
					_this.setState({
						dataList
					})
					break;
				case 111:
					Commonfn.aotoLogin()
					break;
			}
		})

	}
	/**
	 * [克隆一个对象]
	 */
	cloneObjectFn = (obj) => {
		return deepCopy(obj)
	}
	/**
	 * [跳转到大赛或者活动 1征集  2大赛]
	 */
	/**
	 * [跳转到大赛或者活动 1征集  2大赛  3最美]
	 */
	gotoHuodong = (e) => {
		let id = e.currentTarget.getAttribute("data-id")
		let type = e.currentTarget.getAttribute("data-type")
		let url = ''
		if (type == 1) {
			url = 'collectnoson'
			Store.getInstance().sindex.collectnoson = this.cloneObjectFn(Store.getInstance().sindex.collectnosonCopy)
		} else if (type == 2) {
			url = 'competnoson'
			Store.getInstance().sindex.collectnoson = this.cloneObjectFn(Store.getInstance().sindex.collectnosonCopy)
		} else if (type == 3) {
			url = 'zuimeinoson'
			Store.instance.initZuimeiNoson()
		}
		Store.getInstance().allPhotos.toggleNav = true
		
		hashHistory.push({
			pathname: url,
			query: {
				id
			}
		})
	}
	
	render () {
		return (
			<div className='allphotos-content'>
			{/*主题内容列表*/}
			{
					this.state.dataList.length > 0 ? 
					<div className='lists'>
						<InfiniteScroll
					    pageStart={0}
					    loadMore={this.getDataList}
					    hasMore={this.state.status}
					    loader={this.state.status ? <Jiazai key={0}></Jiazai> : ''}> 
	 						{
							this.state.dataList.map((item, index) => {
								return (
									<div className='lists-item' key={index} >
										<div className='img-box' data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
											{
												item.star == 1 ? <img src='img/icon-jing.png' className='jing' /> : ''
											}
											{
												item.pic_cnt > 1 ? <img src='img/icon-photos.png' className='photos' /> : ''
											}
											<img src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_40') : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_40')):''} />
														<LazyLoad height={300} offset={300}>
															<img className='real-pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } />
														</LazyLoad>
										</div>
										<div className='item-mid'>
											{
												item.allAddress ? 
												<div className='mid-top flex flex-ver-center'>
													<img src='img/icon-site.png' />
													<span>{item.allAddress}</span>
												</div> : ''
											}
											<h1 style={{display:item.title||item.pic_cnt>1?'block':'none'}} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
												{item.title}
												{
													item.pic_cnt > 1 ? <span className='pic_cnt'>（共{item.pic_cnt}张图）</span> : ''
												}
											</h1>
											<p style={{display:item.pic.pic_desc?'block':'none'}} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>{item.pic.pic_desc}</p>
											
											<div className='shoucang-bottom flex flex-space-between flex-ver-center'>
												<div className='shoucang-bottom-left'>
													{
														item.activity_title ? <a style={{paddingTop:'0px'}} data-id={item.aid} data-type={item.type} onClick={this.gotoHuodong.bind(this)}><span>来自</span>{item.activity_title}</a> : ''
													}
												</div>
												<div className='shoucang-bottom-right' data-id={item.rid} onClick={this.handleInteract.bind(this)}>
													{
														item.is_collect == 1 ? 
														<img src="img/icon-cancle.png" alt=""/> : '收藏'
													}
												</div>
											</div>
										</div>
									</div>
								)
							})
						}
						</InfiniteScroll>
					</div> : 
					<div className='nodata' style={{paddingTop:'10px'}}>
						{
							this.state.loading ? '加载中' : this.state.dataList.length > 0 ? '加载中' : 
								(
									<div className="coming-soon flex-column flex-ver-center">
										<div style={{fontSize:'17px',marginTop:'50px'}}>赶快去收藏吧</div>
									</div>
								)
						}
					</div>
				}
				{/*loading层*/}

				{
					this.state.loading ? <Loading></Loading> : ''
				}
			</div>
		)
	}
}