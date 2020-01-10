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
export default class Competnoson extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			focus_url:'',
			is_publish:0,
			publish_url:'',
			tips:'',

			need_pic_desc:0,
			need_pic_position:0,
			allow_media_type: 1, 
			focuslist: [], // 焦点图数据
			desc:'',
			content: '', // 大赛说明
			sliderOffset: Store.getInstance().sindex.competnoson.sliderOffset,
			index: Store.getInstance().sindex.competnoson.index ? Store.getInstance().sindex.competnoson.index : 0,
			currentlist: Store.getInstance().sindex.competnoson.list.length ? Store.getInstance().sindex.competnoson.list[Store.getInstance().sindex.competnoson.index] : [],
			list: Store.getInstance().sindex.competnoson.list,
			tabs: Store.getInstance().sindex.competnoson.tabs,
			dataList: Store.getInstance().sindex.competnoson.dataList, // 最新发布数据列表 0左侧数据 1右侧数据
			dataHeigth:Store.getInstance().sindex.competnoson.dataHeigth, // 最新发布数据高度 0左侧数据 1右侧数据
			picList: Store.getInstance().sindex.competnoson.picList, // 最受关注数据列表 0左侧数据 1右侧数据
			picHeigth:Store.getInstance().sindex.competnoson.picHeigth, // 最受关注数据高度 0左侧数据 1右侧数据
			sonScroll: Store.getInstance().sindex.competnoson.sonScroll, // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
			limit: 6, // 子分组数据分页，每页显示几条数据
			page: Store.getInstance().sindex.competnoson.page, // 数据分页页码 0 最新发布 1最受关注
			type: 1, // 子分组数据类型 1 最新发布 2最受关注 3大赛说明
			status: Store.getInstance().sindex.competnoson.status,  // 是否能继续加载 0 最新发布 1最受关注
			id: 0, // 大赛id
			loading: false,
			navbarTop: 0, // 选项卡距离顶部高度
			title: '', // 大赛标题
			son: false , // 是否有子集 
			loadingData: [true, true], // 函数节流，防止多次加载
			toggleNav: Store.getInstance().sindex.competnoson.toggleNav, // 切换选项卡
		}
		this.timer = ''
	}
	componentWillMount () {
		console.log('dataList', Store.getInstance().sindex.competnoson.dataList)
	}
	componentDidUpdate () {
		if (this.state.toggleNav) {
			$('body,html').animate({scrollTop: this.state.sonScroll[this.state.index]}, 0)
			this.state.toggleNav = false
			Store.getInstance().sindex.competnoson.toggleNav = false
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
		if (Store.getInstance().sindex.competnoson.index) {
			type = parseFloat(Store.getInstance().sindex.competnoson.index + 1)
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
		if (this.state.focuslist.length > 0) {
			sharesrc = this.state.focuslist[0] + '?x-oss-process=image/resize,w_250'
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
					let data = resp.data.focus1
					let content = resp.data.content
					let title = resp.data.title
					let focuslist = []
					let allow_media_type = resp.data.allow_media_type
				
					if (data) {
						focuslist = deepCopy(data)
					}else if (resp.data.focus) {
						focuslist.push(resp.data.focus)
					}
					document.title = title
					console.log('Store.getInstance().sindex.competnoson', Store.getInstance().sindex.competnoson)
					if (!Store.getInstance().sindex.competnoson.gotoDetailYe) {
						$('.navBarItem')[2].click()
					}
					this.state.title = title;
					this.state.focuslist = focuslist;
					this.state.desc = resp.data.desc;
					this.setShare()
					_this.setState({
						tips:resp.data.tips,
						focus_url:resp.data.focus_url,
						is_publish:resp.data.is_publish,
						publish_url:resp.data.publish_url,
						need_pic_position:resp.data.need_pic_position,
						need_pic_desc:resp.data.need_pic_desc,
						focuslist,
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
		if ($('._swiper__slide').outerHeight()) {
			this.state.navbarTop = $('._swiper__slide').outerHeight() + 5
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
			// 如果没有初始滚动高度 则赋值初始滚动高度
			for (let i = 0; i < sonScroll.length; i++) {
				if (sonScroll[i] == 0) {
					sonScroll[i] = this.state.navbarTop
				}
			}
		}
		// 记录每个子选项滚动高度
		sonScroll[this.state.index] = scrollTop
		Store.getInstance().sindex.competnoson.sonScroll = sonScroll
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
			Store.getInstance().sindex.competnoson.status = status
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

							if (item.pic.length > 0) {
								item.pic[0].pic_desc = item.pic[0].pic_desc || item.pic[0].pic_desc == "" ? item.pic[0].pic_desc : item.pic[0].video_desc
								item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
								item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
								item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
							}
							
							item.like_cnt = Commonfn.numberToWan(item.like_cnt, 'w')
							// 计算图片高度，用于智能排列
							if (item.pic[0].pic_width > 0 && item.pic[0].pic_height > 0) {
								let ratio = item.pic[0].pic_width / item.pic[0].pic_height
								item.pic[0].pic_height = (Store.getInstance().clientWidth / 2) / ratio
								if (dataHeigth[0] <= dataHeigth[1]) {
									dataHeigth[0] += item.pic[0].pic_height
									leftData.push(item)
								} else {
									dataHeigth[1] += item.pic[0].pic_height
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
					Store.getInstance().sindex.competnoson.dataList = dataList
					Store.getInstance().sindex.competnoson.dataHeigth = dataHeigth
					Store.getInstance().sindex.competnoson.page[0] = resp.data.next_page
					Store.getInstance().sindex.competnoson.status = status
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
			Store.getInstance().sindex.competnoson.status = status
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

							if (item.pic.length > 0) {
								item.pic[0].pic_desc = item.pic[0].pic_desc || item.pic[0].pic_desc == "" ? item.pic[0].pic_desc : item.pic[0].video_desc
								item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
								item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
								item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
							}

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
					Store.getInstance().sindex.competnoson.picList = picList
					Store.getInstance().sindex.competnoson.picHeigth = picHeigth
					Store.getInstance().sindex.competnoson.page[1] = resp.data.next_page
					Store.getInstance().sindex.competnoson.status = status
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
		Store.getInstance().sindex.competnoson.index = index
		Store.getInstance().sindex.competnoson.sliderOffset = sliderOffset
		this.setState({
			sliderOffset:Store.getInstance().sindex.competnoson.sliderOffset,
			index:Store.getInstance().sindex.competnoson.index,
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
		Store.getInstance().info.rule.need_pic_position = this.state.need_pic_position;
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
		Store.getInstance().sindex.competnoson.toggleNav = true
		Store.getInstance().sindex.competnoson.gotoDetailYe = true
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
		Store.getInstance().sindex.competition = this.cloneObjectFn(Store.getInstance().sindex.competitionCopy) 
		hashHistory.push({
			pathname: 'competition'
		})
	}
	
	render () {
		return (
			<div className='index-content competition-content competnoson-content'>
			{/*轮播图 */}
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
                                    	<img onClick={()=>{
                                    		if(this.state.focus_url){
												window.location.href = this.state.focus_url;
                                    		}
                                    	}} src={item + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth}/>
                                    </Slide>
                                )
                            })
                        }
                    </Swiper> : ''
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
						/> : <div className='navBar-replace'>大赛说明</div>
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
									<div style={{fontSize:'17px',marginTop:'50px'}}>作品征集中...</div>
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
									<div style={{fontSize:'17px',marginTop:'50px'}}>作品征集中...</div>
								</div>
							)
						}
						</div>
					}
				</div>
				:
				<div className='shuoming'>
					<h1>{this.state.title}</h1>
					{
						// <h4>大赛说明：</h4>
					}
					<div className='shuoming-content' dangerouslySetInnerHTML={{__html: this.state.content}}></div>
				</div>
				}
			{/*参赛按钮*/}
				<div className='join-active flex'>
					{
						this.state.son ?
						<div className='back-index' onClick={this.gotoNext}>大赛首页</div> : ''
					}
					<div className='join-go' data-title={this.state.title} data-id={this.state.id} onClick={this.join.bind(this)}>上传图片参与大赛</div>
					{
						this.state.is_publish?
						<div style={{padding:'0 20px',backgroundColor:'#ff3b00'}} onClick={()=>{
							window.location.href=this.state.publish_url;
						}}>查看获奖作品</div>
						:<div style={{display:'none'}}></div>
					}
				</div>

				{/*loading层*/}

				{
					this.state.loading ? <Loading></Loading> : ''
				}
			</div>
		)
	}
}