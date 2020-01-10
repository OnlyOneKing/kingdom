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
import InfiniteScroll from 'react-infinite-scroller'
import LazyLoad from 'react-lazyload'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js'
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js';
export default class Zuimeinoson extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			need_pic_desc:0,
			zuimeiDetail: '',
			focuslist: [], // 焦点图数据
			desc:'',
			content: '', // 大赛说明
			tips:'',
			allow_media_type: 1, 
			
			sliderOffset: Store.getInstance().zuimeiNoson.sliderOffset,
			index: Store.getInstance().zuimeiNoson.index ? Store.getInstance().zuimeiNoson.index : 0,
			currentlist: Store.getInstance().zuimeiNoson.list.length ? Store.getInstance().zuimeiNoson.list[Store.getInstance().zuimeiNoson.index] : [],
			list: Store.getInstance().zuimeiNoson.list,
			tabs: Store.getInstance().zuimeiNoson.tabs,
			dataList: Store.getInstance().zuimeiNoson.dataList, // 最新发布数据列表 0左侧数据 1右侧数据
			dataHeigth:Store.getInstance().zuimeiNoson.dataHeigth, // 最新发布数据高度 0左侧数据 1右侧数据
			picList: Store.getInstance().zuimeiNoson.picList, // 最受关注数据列表 0左侧数据 1右侧数据
			picHeigth:Store.getInstance().zuimeiNoson.picHeigth, // 最受关注数据高度 0左侧数据 1右侧数据
			sonScroll: Store.getInstance().zuimeiNoson.sonScroll, // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
			limit: 6, // 子分组数据分页，每页显示几条数据
			page: Store.getInstance().zuimeiNoson.page, // 数据分页页码 0 最新发布 1最受关注
			type: 1, // 子分组数据类型 1 最新发布 2最受关注 3大赛说明
			status: Store.getInstance().zuimeiNoson.status,  // 是否能继续加载 0 最新发布 1最受关注
			id: 0, // 大赛id
			loading: false,
			navbarTop: 0, // 选项卡距离顶部高度
			title: '', // 大赛标题
			son: false , // 是否有子集 
			loadingData: [true, true], // 函数节流，防止多次加载
			toggleNav: Store.getInstance().zuimeiNoson.toggleNav, // 切换选项卡
		}
		this.timer = ''
	}
	componentWillMount () {
		console.log('dataList', Store.getInstance().zuimeiNoson.dataList)
	}
	componentDidUpdate () {
		if (this.state.toggleNav) {
			$('body,html').animate({scrollTop: this.state.sonScroll[this.state.index]}, 0)
			this.state.toggleNav = false
			Store.getInstance().zuimeiNoson.toggleNav = false
		}
		// 对大赛说明进行样式调整
		if (this.state.type == 3) {
			$('.shuoming-content').find('p img').parent().css({
				textIndent: 0
			})
			let p = $('.shuoming-content p')
			for(let i = 0; i < p.length; i++){
					if ($(p[i]).css('textAlign') == 'center') {
						$(p[i]).css({'textIndent': 0})
					}
			}
		}
	}
	componentDidMount () {
		this.initPage(this.props)
		// 添加滚动事件
		window.onscroll = this.onScroll.bind(this)
	}
	componentWillReceiveProps (newProps) {
		this.initPage(newProps)
	}
	componentWillUnmount () {
		clearInterval(this.timer)
		 window.onscroll = null
	}
	// 初始化页面参数
	initPage = (props) => {
		let id = props.location.query.id
		let son = props.location.query.son
		this.state.id = id
		if (!son) {
			this.setState({
				son: true
			})
		}
		let type = 1
		if (Store.getInstance().zuimeiNoson.index) {
			type = parseFloat(Store.getInstance().zuimeiNoson.index + 1)
		}
		this.state.type = type
		this.loadData()
	}
	/**
	 * [微信分享 ]
	 */
	setShare = () => {
		let sharetitle = ''+this.state.title
		let sharedes = this.state.desc?this.state.desc:'来自「中国国家地理图片」';//'西藏山南市【错那县】的风景，和【杜鹃花】的摄影作品都可参赛！'
		let shareTimeLinedes = sharedes
		let link = window.location.href
		let sharesrc = ''
		if (this.state.zuimeiDetail.focus) {
			sharesrc = this.state.zuimeiDetail.focus + '?x-oss-process=image/resize,w_250'
		}
		let hideMenuItems = ['menuItem:share:facebook']
        WeChatUtil.getInstance().set({'hideMenuItems':hideMenuItems,'icon':sharesrc,'title':sharetitle,'link':link,'desc':sharedes,'shareTimeLinedes':shareTimeLinedes,'showShare':true});
	}
	/**
	 * [加载页面数据]
	 */
	loadData = () => {
		this.setState({
			loading: true
		})
		this.getBannerList()
		
		// 没有数据则加载最新发布数据
		if (this.state.dataList[0].length == 0) {
			this.getNewList()
		} 
		// 没有数据则加载最受关注数据
		if (this.state.picList[0].length == 0) {
			this.getPicList()
		} 
	}
	/**
	 * [获得banner数据列表]
	 */
	getBannerList = () => {
		let _this = this
		let opt = {
			aid: this.state.id
		}
		Service.getDetailsFocusList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let data = resp.data.focus
					let content = resp.data.content
					let title = resp.data.title
					let zuimeiDetail = resp.data
					let allow_media_type = resp.data.allow_media_type
				
					if (!Store.getInstance().zuimeiNoson.gotoDetailYe) {
						$('.navBarItem')[2].click()
					}
					
					document.title = title
					this.state.title = title;
					this.state.desc = resp.data.desc;
					this.state.zuimeiDetail = zuimeiDetail;
					this.setShare()
					_this.setState({
						tips:resp.data.tips,
						need_pic_desc:resp.data.need_pic_desc,
						zuimeiDetail,
						content,
						title,
						allow_media_type
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
		if ($('.zuimeiBanner').height()) {
			this.state.navbarTop = $('.zuimeiBanner').height()
		} else {
			this.state.navbarTop = 0
		}
		 
		let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
		let sonScroll = [...this.state.sonScroll]
		// 固定选项卡在顶部
		if (scrollTop <= this.state.navbarTop) {
			$('.navBar').css({position: 'relative',zIndex: 1,boxShadow:'none'})
		} else {
			$('.navBar').css({position: 'fixed', top: 0,zIndex: 9,boxShadow: '1px 1px 8px 1px rgba(0, 0, 0, 0.2)'})
		}
		// 记录每个子选项滚动高度
		sonScroll[this.state.index] = scrollTop
		Store.getInstance().zuimeiNoson.sonScroll = sonScroll
		this.setState({
			sonScroll
		})
	}
	/**
	 * [获得最新发布列表]
	 */
	getNewList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[0] == -1) {
			status[0] = false
			Store.getInstance().zuimeiNoson.status = status
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
			aid: this.state.id,
			page: this.state.page[0],
			type: 1
		}
		Service.getPicList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let dataList = [...this.state.dataList]
					let dataHeigth = [...this.state.dataHeigth]
					let leftData = dataList[0]
					let rightData = dataList[1]
					let data = resp.data.list
					
					if (Commonfn.isArray(data) && data.length > 0) {
						data.forEach((item) => {

							item.pic[0].pic_desc = item.pic[0].pic_desc ? item.pic[0].pic_desc : item.pic[0].video_desc
							item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
							item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
							item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
							
							item.like_cnt = Commonfn.numberToWan(item.like_cnt, 'w')
							// 计算图片高度，用于智能排列
							if (item.pic[0].pic_width > 0 && item.pic[0].pic_height > 0) {
								let ratio = item.pic[0].pic_width / item.pic[0].pic_height
								item.pic[0].pic_height = (Store.getInstance().clientWidth / 2) / ratio
								if (parseFloat(dataHeigth[0]) <= parseFloat(dataHeigth[1])) {
									dataHeigth[0] += parseFloat(item.pic[0].pic_height + 5)
									leftData.push(item)
								} else {
									dataHeigth[1] += parseFloat(item.pic[0].pic_height + 5)
									rightData.push(item)
								}
							}
						})
					} else {
						data = []
					}

					this.state.page[0] = resp.data.next_page
					status[0] = true
					loadingData[0] = true
					Store.getInstance().zuimeiNoson.dataList = dataList
					Store.getInstance().zuimeiNoson.dataHeigth = dataHeigth
					Store.getInstance().zuimeiNoson.page[0] = resp.data.next_page
					Store.getInstance().zuimeiNoson.status = status
					_this.setState({
						dataList,
						dataHeigth,
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
	 * [获得最受关注列表]
	 */
	getPicList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[1] == -1) {
			status[1] = false
			Store.getInstance().zuimeiNoson.status = status
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
			aid: this.state.id,
			page: this.state.page[1],
			type: 3
		}
		Service.getPicList(opt).then((resp) => {
			
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let picList = [...this.state.picList]
					let picHeigth = [...this.state.picHeigth]
					let leftData = picList[0]
					let rightData = picList[1]
					let data = resp.data.list
					
					if (Commonfn.isArray(data) && data.length > 0) {
						data.forEach((item) => {

							item.pic[0].pic_desc = item.pic[0].pic_desc ? item.pic[0].pic_desc : item.pic[0].video_desc
							item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
							item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
							item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width

							item.like_cnt = Commonfn.numberToWan(item.like_cnt, 'w')
							// 计算图片高度，用于智能排列
							if (item.pic[0].pic_width > 0 && item.pic[0].pic_height > 0) {
								let ratio = item.pic[0].pic_width / item.pic[0].pic_height
								item.pic[0].pic_height = (Store.getInstance().clientWidth / 2) / ratio
								if (picHeigth[0] <= picHeigth[1]) {
									picHeigth[0] += item.pic[0].pic_height
									leftData.push(item)
								} else {
									picHeigth[1] += item.pic[0].pic_height
									rightData.push(item)
								}
							}
						})
					} else {
						data = []
					}

					this.state.page[1] = resp.data.next_page
					status[1] = true
					loadingData[1] = true
					Store.getInstance().zuimeiNoson.picList = picList
					Store.getInstance().zuimeiNoson.picHeigth = picHeigth
					Store.getInstance().zuimeiNoson.page[1] = resp.data.next_page
					Store.getInstance().zuimeiNoson.status = status
					_this.setState({
						picList,
						picHeigth,
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
		Store.getInstance().zuimeiNoson.index = index
		Store.getInstance().zuimeiNoson.sliderOffset = sliderOffset
		this.setState({
			sliderOffset:Store.getInstance().zuimeiNoson.sliderOffset,
			index:Store.getInstance().zuimeiNoson.index,
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
	join = (e) => {
		let id = e.currentTarget.getAttribute("data-id")
		let title = e.currentTarget.getAttribute("data-title")
		Store.getInstance().info.rule.need_pic_desc = this.state.need_pic_desc;
		let copyright = {
			id:this.state.id,
			tips:this.state.tips
		}
		Store.getInstance().copyright_info = copyright;
		hashHistory.push({
			pathname: 'info',
			query: {
				aid: id,
				aname: title
			}
		})
	}
	/**
	 * [跳转到详情]
	 */
	gotoDetail = (e) => {
		let rid = e.currentTarget.getAttribute("data-id")
		Store.getInstance().zuimeiNoson.toggleNav = true
		Store.getInstance().zuimeiNoson.gotoDetailYe = true
		hashHistory.push({
			pathname: 'details',
			query: {
				rid
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
	 * [跳转到下一页]
	 */
	gotoNext = (e) => {
		Store.instance.initZuimei()
		hashHistory.push({
			pathname: 'zuimei'
		})
	}
	
	render () {
		return (
			<div className='index-content competition-content competnoson-content collectnoson-content'>
			{/*banner图 */}
				{
                    this.state.zuimeiDetail.focus ? 
                    <div 
                    	className='zuimeiBanner'
                    	style={{backgroundImage:'url(' + this.state.zuimeiDetail.focus + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth + ')', height: Store.getInstance().clientWidth*9/32 + 'px'}}>
                    	<div className='zuimeiMain'>
	                    	<div className='zuimeiContent flex flex-space-between flex-ver-bottom'>
								<div className='zuimeiContent-left'>{this.state.zuimeiDetail.title}</div>
                    		{
                    			this.state.zuimeiDetail.cameraman ? 
                    			<div className='zuimeiContent-right'>摄影/{this.state.zuimeiDetail.cameraman}</div> : ''
                    		}
	                    	</div>
                    	</div>
                    </div> : ''
				}
			{/*子集标题*/}
			{
				// this.state.son ? <div className='son-title'>{this.state.title}</div> : ''
			}
	        {/*tab选择*/}
	        	<div className='bar-body'>
	        		{
		        		this.state.allow_media_type == 1 ? 
		        		<Navbar 
		        		className='navBar'
						style={{backgroundColor:'#ffffff',color:'#484949',display:'flex',alignItems:'center',justifyContent: 'space-around'}}
						sliderwidth={44}
						sliderOffset={this.state.index ? this.state.sliderOffset : 50}
						activeIndex = {this.state.index}
						tabs={this.state.tabs}
						callback={this.navbarTap}
						/> : <div className='navBar-replace'>基本信息</div>
	        		}
	        	</div>
			{/*主题内容列表*/}
				{
					this.state.type == 1 ?
					<div>
						{
							this.state.dataList[0].length > 0 ? 
							<InfiniteScroll
						    pageStart={0}
						    loadMore={this.getNewList}
						    hasMore={this.state.status[0]}
						    loader={this.state.status[0] ? <Jiazai key={0}></Jiazai> : ''}>
		 						<div className='pic-lists flex flex-space-between'>
		 							<div className='pic-left'>
		 							{
										this.state.dataList[0].length > 0 ? 
										this.state.dataList[0].map((item, index) => {

											return (
														<div className='pic-lists-item' key={index} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
															<img className='pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_40') : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_40')):''} />
																<LazyLoad height={300} offset={500}>
																	<img className='pic real-pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } />
																</LazyLoad>
															<div className='zan flex'>
																<img src="img/icon-zan.png" />
																<span>{item.like_cnt}</span>
															</div>
															{
																item.pic_cnt > 1 ? <img className='pic-num' src="img/icon-pic.png" /> : ''
															}
														</div>
													)
												})
											: ''
											
									}
		 						</div>
		 						<div className='pic-right'>
		 							{
										this.state.dataList[1].length > 0 ? 
										this.state.dataList[1].map((item, index) => {
											return (
														
														<div className='pic-lists-item' key={index} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
															<img className='pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_40') : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_40')):''} />
																<LazyLoad height={300} offset={500}>
																	<img className='pic real-pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } />
																</LazyLoad>
															<div className='zan flex'>
																<img src="img/icon-zan.png" />
																<span>{item.like_cnt}</span>
															</div>
															{
																item.pic_cnt > 1 ? <img className='pic-num' src="img/icon-pic.png" /> : ''
															}
														</div>
													)
												})
											: ''
											
									}
		 						</div>
		 						</div>
						</InfiniteScroll>
						:
						<div className='nodata'>
						{
							this.state.loading ? '加载中' : this.state.dataList[0].length > 0 ? '加载中' : 
							(
								<div className="coming-soon flex-column flex-ver-center">
									<div style={{fontSize:'17px',marginTop:'50px'}}>传图打卡中...</div>
								</div>
							)
						}
						</div> 
					}
				</div>
				:
				this.state.type == 2 ? 
				<div>
						{
							this.state.picList[0].length > 0 ?
							<InfiniteScroll
						    pageStart={0}
						    loadMore={this.getPicList}
						    hasMore={this.state.status[1]}
						    loader={this.state.status[1] ? <Jiazai key={0}></Jiazai> : ''}>
		 						<div className='pic-lists flex flex-space-between'>
		 							<div className='pic-left'>
		 							{
										this.state.picList[0].length > 0 ? 
										this.state.picList[0].map((item, index) => {
											return (
														
														<div className='pic-lists-item' key={index} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
															<img className='pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_40') : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_40')):''} />
																<LazyLoad height={300} offset={500}>
																	<img className='pic real-pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } />
																</LazyLoad>
															<div className='zan flex'>
																<img src="img/icon-zan.png" />
																<span>{item.like_cnt}</span>
															</div>
															{
																item.pic_cnt > 1 ? <img className='pic-num' src="img/icon-pic.png" /> : ''
															}
														</div> 
													)
												})
											: ''
									}
		 						</div>
		 						<div className='pic-right'>
		 							{
										this.state.picList[1].length > 0 ? 
										this.state.picList[1].map((item, index) => {
											return (
														
														<div className='pic-lists-item' key={index} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
															<img className='pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_40') : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_40')):''} />
																<LazyLoad height={300} offset={500}>
																	<img className='pic real-pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } />
																</LazyLoad>
															<div className='zan flex'>
																<img src="img/icon-zan.png" />
																<span>{item.like_cnt}</span>
															</div>
															{
																item.pic_cnt > 1 ? <img className='pic-num' src="img/icon-pic.png" /> : ''
															}
														</div> 
													)
												})
											: ''
											
									}
		 						</div>
		 						</div>
						</InfiniteScroll> : 
						<div className='nodata'>
						{
							this.state.loading ? '加载中' : this.state.picList[0].length > 0 ? '加载中' : 
							(
								<div className="coming-soon flex-column flex-ver-center">
									<div style={{fontSize:'17px',marginTop:'50px'}}>传图打卡中...</div>
								</div>
							)
						}
						</div>
					}
				</div>
				:
				<div className='shuoming'>
					<h1>
						{
							this.state.zuimeiDetail.city ? this.state.zuimeiDetail.province  + this.state.zuimeiDetail.city : this.state.zuimeiDetail.province 
						}
					</h1>
					{
						this.state.zuimeiDetail ? 
						<div className='zuimeiAll'>
							<div className='zuimeiInfo flex flex-center'>
								<div className='zuimeiInfo-left'>
									<div className='blod'>东经</div>
									<div>{this.state.zuimeiDetail.lng}</div>
									<div className='blod'>大地高</div>
									<div>海拔{this.state.zuimeiDetail.alt}m</div>
									<div className='blod'>最佳拍摄季节</div>
									<div>{this.state.zuimeiDetail.best_season}</div>
								</div>
								<div className='zuimeiInfo-right'>
									<div className='blod'>北纬</div>
									<div>{this.state.zuimeiDetail.lat}</div>
									<div className='blod'>观看方向</div>
									<div>{this.state.zuimeiDetail.view_direction ? this.state.zuimeiDetail.view_direction : '全方位'}</div>
									<div className='blod'>最佳摄影时间</div>
									<div>{this.state.zuimeiDetail.best_time}</div>
								</div>
							</div>
							
							<div className='shuoming-content' dangerouslySetInnerHTML={{__html: this.state.zuimeiDetail.content}}></div>
						</div> : 
						<div className='shuoming-content' dangerouslySetInnerHTML={{__html: this.state.content}}></div>
					}
				</div>
				}
			{/*参赛按钮*/}
				<div className='join-active flex'>
					{
						this.state.son ?
						<div className='back-index' onClick={this.gotoNext}>全部观景点</div> : ''
					}
					<div className='join-go' data-title={this.state.title} data-id={this.state.id} onClick={this.join.bind(this)}>传图打卡</div>
				</div>

				{/*loading层*/}

				{
					this.state.loading ? <Loading></Loading> : ''
				}
			</div>
		)
	}
}