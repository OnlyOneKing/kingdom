import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import { Swiper, Slide } from 'react-dynamic-swiper';
import 'react-dynamic-swiper/lib/styles.css';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Jiazai from '../../base/jiazai.jsx';
import Service from './service.js';
import Navbar from '../../base/Navbar.jsx';
import Store from '../../store.js';
import Commonfn from '../../base/commonfn.js'
import LazyLoad from 'react-lazyload'
import InfiniteScroll from 'react-infinite-scroller'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js'
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js';
export default class Photobase extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			focuslist: [], // 焦点图数据
			sliderOffset: Store.getInstance().photobase.sliderOffset,
			index: Store.getInstance().photobase.index ? Store.getInstance().photobase.index : 0,
			currentlist: Store.getInstance().photobase.list.length ? Store.getInstance().photobase.list[Store.getInstance().photobase.index] : [],
			list: Store.getInstance().photobase.list,
			tabs: Store.getInstance().photobase.tabs,
			dataList: Store.getInstance().photobase.dataList, // 进行中数据列表
			picList: Store.getInstance().photobase.picList, // 已结束数据列表
			limit: 5, // 大赛数据分页，每页显示几条数据
			page: Store.getInstance().photobase.page, // 大赛数据分页页码
			sonScroll: Store.getInstance().photobase.sonScroll, // 选项卡的滚动高度, 0 进行中 1 已结束
			type: 1, // 大赛数据类型 1进行中 2已结束
			status: Store.getInstance().photobase.status,  // 是否能继续加载
			client_time: Date.parse(new Date()) / 1000,
			serve_time: 0,
			navbarTop: 0,
			loading: false,
			loadingData: [true, true], // 函数节流，防止多次加载
			toggleNav: Store.getInstance().photobase.toggleNav, // 切换选项卡
		}
		this.listener = [] // 倒计时定时器
	}
	componentWillMount () {
		document.title = '征集'
		this._loadConfig()
	}
	componentDidUpdate () {
		if (this.state.toggleNav) {
			$('body,html').animate({scrollTop: this.state.sonScroll[this.state.index]}, 0)
			this.state.toggleNav = false
			Store.getInstance().photobase.toggleNav = false
		}
	}
	componentDidMount () {
		let type = 1
		if (Store.getInstance().photobase.index) {
			type = parseFloat(Store.getInstance().photobase.index + 1)
		}
		this.state.type = type
		this.loadData()
		// 添加滚动事件
		window.onscroll = this.onScroll.bind(this)
		this.setShare()
	}
	componentWillReceiveProps (newProps) {

	}
	componentWillUnmount () {
		clearInterval(this.timer)
		 window.onscroll = null
	}
	/**
	 * [微信分享 ]
	 */
	setShare = () => {
		let sharetitle = '征集'
		let sharedes = '来自「中国国家地理图片」'
		let shareTimeLinedes = sharedes;
		let link = window.location.href;
		let hideMenuItems = ['menuItem:share:facebook'];
        WeChatUtil.getInstance().set({'hideMenuItems':hideMenuItems,'title':sharetitle,'link':link,'desc':sharedes,'shareTimeLinedes':shareTimeLinedes,'showShare':true});
	}
	/**
	 * [加载页面数据]
	 */
	loadData = () => {
		this.setState({
			loading: true
		})
		this.getBannerList()
		// 没有数据则加载进行中数据
		if (this.state.dataList.length === 0) {
			this.getDataList()
		}
		// 没有数据则加载已结束数据
		if (this.state.picList.length === 0) {
			this.getPicList()
		}
	}
	/**
	 * [滚动事件]
	 */
	onScroll = (e) => {
		if ($('._swiper__slide').outerHeight()) {
			this.state.navbarTop = $('._swiper__slide').outerHeight() + 5
		} else {
			this.state.navbarTop = 0
		}
		let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
		let sonScroll = [...this.state.sonScroll]
		// 固定选项卡在顶部
		if (scrollTop <= this.state.navbarTop) {
			$('.navBar').css({position: 'relative', zIndex: 1, boxShadow:'none'})
		} else {
			$('.navBar').css({position: 'fixed', top: 0, zIndex: 9, boxShadow: '1px 1px 8px 1px rgba(0, 0, 0, 0.2)'})
			// 如果没有初始滚动高度 则赋值初始滚动高度
			for (let i = 0; i < sonScroll.length; i++) {
				if (sonScroll[i] == 0) {
					sonScroll[i] = this.state.navbarTop
				}
			}
		}
		// 记录每个子选项滚动高度
		sonScroll[this.state.index] = scrollTop
		Store.getInstance().photobase.sonScroll = sonScroll
		this.setState({
			sonScroll
		})
	}
	/**
	 * [获得banner数据列表]
	 */
	getBannerList = () => {
		let _this = this
		let opt = {
			type: 3
		}
		Service.getBannerList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let data = resp.data.list
					
					if (Commonfn.isArray(data) && data.length > 0) {
						data.forEach((item) => {
							item.pic_url = item.pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth
						})
					} else {
						data = []
					}
					_this.setState({
						focuslist: data
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
	 * [获得进行中数据列表]
	 */
	getDataList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[0] == -1) {
			status[0] = false
			Store.getInstance().photobase.status = status
			this.setState({
				status
			})
			return false
		}
		if (loadingData[0] == false) {
			return false
		}
		loadingData[0] = false

		let opt = {
			limit: this.state.limit,
			activity_type: 1,
			type: 4,
			page: this.state.page[0],
		}
		Service.getDataList(opt).then((resp) => {
			console.log('resp', resp)
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let dataList = [...this.state.dataList]
					let data = resp.data.list
					let listener = this.listener
			
					if (Commonfn.isArray(data) && data.length > 0) {
						data.forEach((item) => {
							this.setTimeStatus(item)
						})
					} else {
						data = []
					}
					dataList = dataList.concat(data)

					this.state.page[0] = resp.data.next_page
					status[0] = true
					loadingData[0] = true
					Store.getInstance().photobase.dataList = dataList
					Store.getInstance().photobase.page[0] = resp.data.next_page
					Store.getInstance().photobase.status = status

					_this.setState({
						dataList,
						status,
						loadingData
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
	 * [获得已结束数据列表]
	 */
	getPicList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[1] == -1) {
			status[1] = false
			Store.getInstance().photobase.status = status
			this.setState({
				status
			})
			return false
		}
		if (loadingData[1] == false) {
			return false
		}
		loadingData[1] = false

		let opt = {
			limit: this.state.limit,
			activity_type: 2,
			type: 4,
			page: this.state.page[1],
		}
		Service.getDataList(opt).then((resp) => {
			console.log('resp1', resp)
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let picList = [...this.state.picList]
					let data = resp.data.list
					let listener = this.listener
					
					if (Commonfn.isArray(data) && data.length > 0) {
						data.forEach((item) => {
							this.setTimeStatus(item)
						})
					} else {
						data = []
					}
					picList = picList.concat(data)

					this.state.page[1] = resp.data.next_page
					status[1] = true
					loadingData[1] = true
					Store.getInstance().photobase.picList = picList
					Store.getInstance().photobase.page[1] = resp.data.next_page
					Store.getInstance().photobase.status = status

					_this.setState({
						picList,
						status,
						loadingData
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
	 * [获得服务器时间]
	 */
	_loadConfig = () => {
		Service.getConfig().then((resp) => {
			console.log('resp1', resp)
			switch (resp.code) {
				case 0:
					this.state.serve_time = resp.data.service_time
					this.setState({
						serve_time: resp.data.service_time
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
	 * [活动时间倒计时]
	 */
	setTimeStatus = (item) => {
		let that = this
		let now = Date.parse(new Date()) / 1000
		let client_time = this.state.client_time
		let serve_time = this.state.serve_time
		let start_time = item.start_time
		let end_time = item.end_time
		let past = now - client_time
		let left = ''
		if (serve_time && start_time && end_time) {
			// 活动是否开始 0 未开始 1 已开始  2 已截止
			if (serve_time <= start_time) {
				// 活动未开始
				left = Commonfn.simpleTimeEx(start_time - serve_time -past)
				item.leftType = 0
			} else if (serve_time <= end_time) {
				// 活动开始
				left = Commonfn.simpleTimeEx(end_time - serve_time - past)
				item.leftType = 1
			} else {
				left = 0
				item.leftType = 2
			}

			if (left) {
				item.leftTime = left
			}

			// item.listener = setTimeout(() => {
			// 	that.setYsTimeStatus(item);
			// }, 1000);
		}
	}
	/**
	 * [跳转页面]
	 * @param  url [跳转地址]
	 */
	goto = (url) => {
		hashHistory.push(url)
	}
	/**
	 * [tab切换]
	 * @param  index [当前tab序号]
	 * @param  sliderOffset [当前tab左偏移量]
	 */
	navbarTap = (index,sliderOffset) => {
		Store.getInstance().photobase.index = index
		Store.getInstance().photobase.sliderOffset = sliderOffset
		this.setState({
			sliderOffset:Store.getInstance().photobase.sliderOffset,
			index:Store.getInstance().photobase.index,
			currentlist:this.state.list[index],
			toggleNav: true
		})
		this.state.type = parseFloat(index + 1)
		if (this.state.sonScroll[index] == 0) {
			$('.navBar').css({position: 'relative',boxShadow:'none'})
		}
	}
	/**
	 * [跳转到详情]
	 */
	gotoDetail = (e) => {
		let id = e.currentTarget.getAttribute("data-id")
		let son = e.currentTarget.getAttribute("data-son")
		Store.getInstance().photobase.toggleNav = true
		Store.instance.initPhotobaseHaveson()
		Store.instance.initPhotobaseNoson()
		let url = son == 1 ? 'photobasehaveson' : 'photobasenoson'
		hashHistory.push({
			pathname: url,
			query: {
				id,
				son
			}
		})
	}
	
	render () {
		return (
			<div className='index-content competition-content'>
			{/*轮播图*/}
				{
					this.state.focuslist.length > 0? 
					<Swiper
                        ref="swiperObj"
                        swiperOptions={{
                          slidesPerView: 'auto'
                        }}
                        navigation={false}
                        pagination={this.state.focuslist.length>1?true:false}
                        scrollBar={false}
                      >
                        {
                            this.state.focuslist.map((item,index) => {
                                return (
                                    <Slide className="_swiper__slide" key={index}>
                                    	<img src={item.pic_url}/>
                                    </Slide>
                                )
                            })
                        }
                    </Swiper> : ''
				}
	        {/*tab选择*/}
	        	<div className='bar-body'>
	        		<Navbar 
	        		className='navBar'
					style={{backgroundColor:'#ffffff',color:'#484949',display:'flex',alignItems:'center',justifyContent: 'space-around'}}
					sliderwidth={44}
					sliderOffset={this.state.index ? this.state.sliderOffset : 50}
					activeIndex = {this.state.index}
					tabs={this.state.tabs}
					callback={this.navbarTap}
					/>
	        	</div>
			{/*主题内容列表*/}
				{
					this.state.type == 1 ? 
					<div className='lists'>
					<InfiniteScroll
					    pageStart={0}
					    loadMore={this.getDataList}
					    hasMore={this.state.status[0]}
					    loader={this.state.status[0] ? <Jiazai key={0}></Jiazai> : ''}>
	 						{
							this.state.dataList.length > 0 ? 
							this.state.dataList.map((item, index) => {
								return (
											<div className='lists-item' key={index} data-id={item.id} data-son={item.is_son} onClick={this.gotoDetail.bind(this)}>
												{
													item.focus ? 
													<div className='img-box'>
														<img src={item.focus + '?x-oss-process=image/resize,w_40'} />
														<LazyLoad height={300} offset={300}>
															<img className='real-pic' src={item.focus + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth} />
														</LazyLoad>
														<span className='status'>
															{
																item.custom_tag ? item.custom_tag : item.status == 1 ? '即将开始' : (item.status == 2 ? '火热进行' : '已结束')
															}
														</span>
													</div> : ''
												}
												<div className='item-con'>
													<h1>{item.title}</h1>
													<div className='data flex flex-ver-center'>
														<div className='flex flex-ver-center'><span style={{marginRight: item.pic_sum > 10000 ? '0px' : '2px'}}>{Commonfn.numberToWan(item.pic_sum, '万')}</span>张图片</div>
														<div>|</div>
														<div className='flex flex-ver-center'><span style={{marginRight: item.views > 10000 ? '0px' : '2px'}}>{Commonfn.numberToWan(item.views, '万')}</span>人围观</div>
													</div>
													<div className='bottom flex flex-ver-center'>
														<img src="img/icon-time.png" />
														{
															item.leftType == 0 ? 
															<div>距离活动开始还有<span>{item.leftTime}</span>天</div> :
															item.leftType == 1 ? 
															<div>距离活动截止还有<span>{item.leftTime}</span>天</div> :
															<div>活动已结束</div>
														}
													</div>
												</div>
											</div> 
										)
									})
								:
								<div className='nodata'>{
									this.state.loading ? '加载中' : this.state.dataList.length > 0 ? '加载中' : 
									(
										<div className="coming-soon flex-column flex-ver-center">
											<img src="img/alarm.svg" alt=""/>
											<div>敬请期待</div>
											<div>......</div>
										</div>
									)
								}</div> 
								}
					</InfiniteScroll>
					
				</div>
				: 
				<div className='lists'>
					<InfiniteScroll
					    pageStart={0}
					    loadMore={this.getPicList}
					    hasMore={this.state.status[1]}
					    loader={this.state.status[1] ? <Jiazai key={0}></Jiazai> : ''}>
	 						{
							this.state.picList.length > 0 ? 
							this.state.picList.map((item, index) => {
								return (
											<div className='lists-item' key={index} data-id={item.id} data-son={item.is_son} onClick={this.gotoDetail.bind(this)}>
												{
													item.focus ? 
													<div className='img-box'>
														<img src={item.focus + '?x-oss-process=image/resize,w_40'} />
														<LazyLoad height={300} offset={300}>
															<img className='real-pic' src={item.focus + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth} />
														</LazyLoad>
														<span className='status'>
															{
																item.custom_tag ? item.custom_tag : item.status == 1 ? '即将开始' : (item.status == 2 ? '火热进行' : '已结束')
															}
														</span>
													</div> : ''
												}
												<div className='item-con'>
													<h1>{item.title}</h1>
													<div className='data flex flex-ver-center'>
														<div className='flex flex-ver-center'><span style={{marginRight: item.pic_sum > 10000 ? '0px' : '2px'}}>{Commonfn.numberToWan(item.pic_sum, '万')}</span>张图片</div>
														<div>|</div>
														<div className='flex flex-ver-center'><span style={{marginRight: item.views > 10000 ? '0px' : '2px'}}>{Commonfn.numberToWan(item.views, '万')}</span>人围观</div>
													</div>
													<div className='bottom flex flex-ver-center'>
														<img src="img/icon-time.png" />
														{
															item.leftType == 0 ? 
															<div>距离活动开始还有<span>{item.leftTime}</span>天</div> :
															item.leftType == 1 ? 
															<div>距离活动截止还有<span>{item.leftTime}</span>天</div> :
															<div>活动已结束</div>
														}
													</div>
												</div>
											</div> 
										)
									})
								:
								<div className='nodata'>
								{
									this.state.loading ? '加载中' : this.state.picList.length > 0 ? '加载中' : 
									(
										<div className="coming-soon flex-column flex-ver-center">
											<img src="img/alarm.svg" alt=""/>
											<div>敬请期待</div>
											<div>......</div>
										</div>
									)
								}
								</div>
							}
					</InfiniteScroll>
					
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