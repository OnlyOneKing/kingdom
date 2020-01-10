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
import Service from './indexService.js';
import Navbar from '../../base/Navbar.jsx';
import Store from '../../store.js';
import StoreEvent from '../../base/storeEvent.js';
import Commonfn from '../../base/commonfn.js'
import InfiniteScroll from 'react-infinite-scroller'
import LazyLoad from 'react-lazyload'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js';
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js';
export default class Index extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			focuslist: [], // 焦点图数据
			sliderOffset: Store.getInstance().sindex.index.sliderOffset,
			index: Store.getInstance().sindex.index.index ? Store.getInstance().sindex.index.index : 0,
			currentlist: Store.getInstance().sindex.index.list.length ? Store.getInstance().sindex.index.list[Store.getInstance().sindex.index.index] : [],
			list: Store.getInstance().sindex.index.list,
			tabs: Store.getInstance().sindex.index.tabs,
			dataList: Store.getInstance().sindex.index.dataList, // 推荐图片数据列表
			picList: Store.getInstance().sindex.index.picList, // 最新图片数据列表
			sonScroll: Store.getInstance().sindex.index.sonScroll,
			limit: 5, // 图片数据分页，每页显示几条数据
			page: Store.getInstance().sindex.index.page, // 图片数据分页页码
			type: 2, // 图片数据类型 1关注 2推荐 3最新
			status: Store.getInstance().sindex.index.status,  // 是否能继续加载
			navbarTop: 0, // 选项卡距离顶部高度
			loading: false,
			loadingData: [true, true], // 函数节流，防止多次加载
			toggleNav: Store.getInstance().sindex.index.toggleNav, // 切换选项卡
		}
		this.timer = ''
	}
	componentWillMount () {
		document.title = '中国国家地理图片'
	}
	componentDidUpdate () {
		if (this.state.toggleNav) {
			$('body,html').animate({scrollTop: this.state.sonScroll[this.state.index]}, 0)
			this.state.toggleNav = false
			Store.getInstance().sindex.index.toggleNav = false
		}
	}
	componentDidMount () {
		
		let type = 2
		if (Store.getInstance().sindex.index.index) {
			type = parseFloat(Store.getInstance().sindex.index.index + 2)
		}
		this.state.type = type
		this.loadData()	
		window.onscroll = this.onScroll.bind(this)

		// 微信分享
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
		let sharetitle = '「中国国家地理图片」'
		let sharedes = ''
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
		} else {
			// 有数据则更新点赞，收藏数
			let dataList = [...this.state.dataList]
			let id = Store.getInstance().sindex.index.changeData.id
			let zan = Store.getInstance().sindex.index.changeData.zan
			let collect = Store.getInstance().sindex.index.changeData.collect
			if (id) {
				dataList.forEach((item) => {
					item.rid == id
					item.like_cnt = parseFloat(item.like_cnt + zan)
					item.favorite_cnt = parseFloat(item.favorite_cnt + collect)
				})
				this.setState({
					dataList
				})
			}
		}
		// 没有数据则加载已结束数据
		if (this.state.picList.length === 0) {
			this.getPicList()
			// 有数据则更新点赞，收藏数
			let picList = [...this.state.picList]
			let id = Store.getInstance().sindex.index.changeData.id
			let zan = Store.getInstance().sindex.index.changeData.zan
			let collect = Store.getInstance().sindex.index.changeData.collect
			if (id) {
				picList.forEach((item) => {
					item.rid == id
					item.like_cnt = parseFloat(item.like_cnt + zan)
					item.favorite_cnt = parseFloat(item.favorite_cnt + collect)
				})
				this.setState({
					picList
				})
			}
		}
	}
	/**
	 * [获得banner数据列表]
	 */
	getBannerList = () => {
		let _this = this
		let opt = {
			type: 1
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
	 * [获得图片数据列表]
	 */
	getDataList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[0] == -1) {
			status[0] = false
			Store.getInstance().sindex.index.status = status
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
			type: 2,
			page: this.state.page[0],
		}
		Service.getDataList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let dataList = [...this.state.dataList]
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
							item.favorite_cnt = Commonfn.numberToWan(item.favorite_cnt, 'w')
							item.share_cnt = Commonfn.numberToWan(item.share_cnt, 'w')
							item.allAddress = Commonfn.getAddress(item)
						})
					} else {
						data = []
					}

					dataList = dataList.concat(data)

					this.state.page[0] = resp.data.next_page
					status[0] = true
					loadingData[0] = true
					Store.getInstance().sindex.index.dataList = dataList
					Store.getInstance().sindex.index.page[0] = resp.data.next_page
					Store.getInstance().sindex.index.status = status

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
	 * [获得最新数据列表]
	 */
	getPicList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[1] == -1) {
			status[1] = false
			Store.getInstance().sindex.index.status = status
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
			type: 3,
			page: this.state.page[1],
		}
		Service.getDataList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let picList = [...this.state.picList]
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
							item.favorite_cnt = Commonfn.numberToWan(item.favorite_cnt, 'w')
							item.share_cnt = Commonfn.numberToWan(item.share_cnt, 'w')
							item.allAddress = Commonfn.getAddress(item)
						})
					} else {
						data = []
					}
					picList = picList.concat(data)

					this.state.page[1] = resp.data.next_page
					status[1] = true
					loadingData[1] = true
					Store.getInstance().sindex.index.picList = picList
					Store.getInstance().sindex.index.page[1] = resp.data.next_page
					Store.getInstance().sindex.index.status = status

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
	 * [跳转页面]
	 * @param  url [跳转地址]
	 */
	goto = (url) => {
		if (url == 'rank') {
			Store.getInstance().sindex.rank = this.cloneObjectFn(Store.getInstance().sindex.rankCopy)
		}
		if (url == 'collect') {
			Store.getInstance().sindex.collect = this.cloneObjectFn(Store.getInstance().sindex.collectCopy)
		}
		if (url == 'competition') {
			Store.getInstance().sindex.competition = this.cloneObjectFn(Store.getInstance().sindex.competitionCopy)
		}
		hashHistory.push(url)
	}
	/**
	 * [tab切换]
	 * @param  index [当前tab序号]
	 * @param  sliderOffset [当前tab左偏移量]
	 */
	navbarTap = (index,sliderOffset) => {
		Store.getInstance().sindex.index.index = index
		Store.getInstance().sindex.index.sliderOffset = sliderOffset
		this.setState({
			sliderOffset:Store.getInstance().sindex.index.sliderOffset,
			index:Store.getInstance().sindex.index.index,
			currentlist:this.state.list[index],
			toggleNav: true
		})
		this.state.type = parseFloat(index + 2)
		if (this.state.sonScroll[index] == 0) {
			$('.navBar').css({position: 'relative',boxShadow:'none'})
		}
	}
	/**
	 * [跳转到详情]
	 */
	gotoDetail = (e) => {
		let rid = e.currentTarget.getAttribute("data-id")
		Store.getInstance().sindex.index.toggleNav = true
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
	/**
	 * [跳转到全部作品]
	 */
	gotoAll = (e) => {
		let uid = e.currentTarget.getAttribute("data-uid")
		let uname = e.currentTarget.getAttribute("data-uname")
		Store.getInstance().allPhotos.allPhotos = new Store.instance.initAllPhotos()
		hashHistory.push({
			pathname: 'allphotos',
			query: {
				uid,
				uname,
				type: -1
			}
		})
	}
	/**
	 * [滚动事件]
	 */
	onScroll = (e) => {
		let navbarTop = 0
		let nav = 0
		if ($('._swiper__slide').outerHeight()) {
			navbarTop = $('._swiper__slide').outerHeight() + 5
		}
		if ($('.nav').outerHeight()) {
			nav = $('.nav').outerHeight() + 5
		}
		this.state.navbarTop = navbarTop + nav 
		let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
		let sonScroll = [...this.state.sonScroll]
		// 固定选项卡在顶部
		if (scrollTop <= this.state.navbarTop) {
			$('.navBar').css({position: 'relative', zIndex: 1, boxShadow:'none'})
		} else {
			$('.navBar').css({position: 'fixed', top: 0, zIndex: 9, boxShadow: '1px 1px 8px 1px rgba(0, 0, 0, 0.2)'})
			// 如果没有初始滚动高度 则赋值初始滚动高度
			for (let i = 0; i < sonScroll.length; i ++ ) {
				if (sonScroll[i] == 0) {
					sonScroll[i] = this.state.navbarTop
				}
			}
		}
		// 记录每个子选项滚动高度
		sonScroll[this.state.index] = scrollTop
		Store.getInstance().sindex.index.sonScroll = sonScroll
		this.setState({
			sonScroll
		})
	}
	showAccusationList=(item)=>{
		Store.getInstance().accusateItem = item;
		hashHistory.push('accusation');
	}
	render () {
		return (
			<div className='index-content'>
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
                                    <Slide className="_swiper__slide" key={index} onClick={()=>{
                                    	if(item.link.match(/photo(\d)*\.dili365\.com/ig)){
											hashHistory.push(item.link.split("#")[1].replace(/\//ig,''));
                                    	}else{
                                    		window.location.href = item.link;
                                    	}
                                    }}>
                                    	<img src={item.pic_url}/>
                                    </Slide>
                                )
                            })
                        }
                    </Swiper> : ''
				}
            {/*导航栏*/}
	            <div className='nav flex flex-space-around'>
	            	<div className='nav-item flex flex-column' onClick={()=>{this.goto('rank')}}>
	            		<img src='img/nav-item1.png' />
	            		<div>榜单</div>
	            	</div>
		            {/*
						<div className='nav-item flex flex-column'>
		            		<img src='img/nav-item2.png' />
		            		<div>影展</div>
		            	</div>
		            */}
		           <div className='nav-item flex flex-column' onClick={()=>{this.goto('collect')}}>
	            		<img src='img/nav-item0.png' />
	            		<div>征集</div>
	            	</div>
	            	<div className='nav-item flex flex-column' onClick={()=>{this.goto('competition')}}>
	            		<img src='img/nav-item4.png' />
	            		<div>大赛</div>
	            	</div>
	            	<div className='nav-item flex flex-column' onClick={()=>{this.goto('zuimei')}}>
	            		<img src='img/nav-item3.png' />
	            		<div>观景点</div>
	            	</div>
	            </div>
	        {/*tab选择*/}
	        	<div className='bar-body'
	        		 style={{marginBottom:'5px'}}
					>
	        		<Navbar 
	        		className='navBar'
	        		ref="navbar"
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
					this.state.type == 2 ? 
					<div className='lists'>
						<InfiniteScroll
						    pageStart={0}
						    loadMore={this.getDataList}
						    hasMore={this.state.status[0]}
						    loader={this.state.status[0] ? <Jiazai key={0}></Jiazai> : ''}>
		 						{
								this.state.dataList.length > 0 ? 
								this.state.dataList.map((item, index) => {
									console.log("item",item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth + ',h_' + Store.getInstance().clientWidth * (9/16)) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'');
									return (
												<div className='lists-item' key={index}>
													<div className='item-top flex flex-space-between flex-ver-center'>
														<div className='item-top-left flex flex-ver-center'>
															{
																item.avatar ? <img src={item.avatar} /> : <img src='img/headExample.jpg'/>
															}
															<span className='name'>{item.username}</span>
														</div>
														<div className='item-top-right'>
															{/*<span className='guanzhu'>+关注</span>*/}
															<span className='all' data-uid={item.uid} data-uname={item.username} onClick={this.gotoAll.bind(this)}>查看该用户全部作品</span>
														</div>
													</div>
													<div className='img-box' data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
														{
															item.pic_cnt > 1 ? <img src='img/icon-photos.png' className='photos' /> : ''
														}
														<img src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_40') : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_40')):''} />
														<LazyLoad height={300} offset={300}>
															<img className='real-pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } />
														</LazyLoad>
													</div>
													<div className='item-mid' style={{display:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc||item.activity_title?'block':'none'}}>
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
														<p data-id={item.rid} style={{display:item.pic.pic_desc?'block':'none'}} onClick={this.gotoDetail.bind(this)}>{item.pic.pic_desc}</p>
														{
															item.activity_title ? <a style={{paddingTop:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc?'10px':'0px'}} data-id={item.aid} data-type={item.type} onClick={this.gotoHuodong.bind(this)}><span>来自</span>{item.activity_title}</a> : ''
														}
													</div>
													<div className='border-half'>
														<div className='mid-bottom flex flex-space-between flex-ver-center'>
															<div className='bottom-left flex flex-space-between' data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
																<div className='bottom-left-item flex'>
																	<div>点赞</div>
																	<span style={{display:item.like_cnt?'inline-block':'none'}}>{item.like_cnt}</span>
																</div>
																<div className='bottom-left-item flex'>
																	<div>收藏</div>
																	<span style={{display:item.favorite_cnt?'inline-block':'none'}}>{item.favorite_cnt}</span>
																</div>
																<div className='bottom-left-item flex'>
																	<div>分享</div>
																	<span style={{display:item.share_cnt?'inline-block':'none'}}>{item.share_cnt}</span>
																</div>
															</div>
															<div className='bottom-right' onClick={this.showAccusationList.bind(this,item)}>举报</div>
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
												<div style={{fontSize:'17px',marginTop:'50px'}}>作品征集中...</div>
											</div>
										)
									}</div>
								}
						</InfiniteScroll>
					</div> : 
					this.state.type == 3 ? 
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
												<div className='lists-item' key={index}>
													<div className='item-top flex flex-space-between flex-ver-center'>
														<div className='item-top-left flex flex-ver-center'>
															{
																item.avatar ? <img src={item.avatar} /> : <img src='img/headExample.jpg'/>
															}
															
															<span className='name'>{item.username}</span>
														</div>
														<div className='item-top-right'>
															{/*<span className='guanzhu'>+关注</span>*/}
															<span className='all' data-uid={item.uid} data-uname={item.username} onClick={this.gotoAll.bind(this)}>查看该用户全部作品</span>
														</div>
													</div>
													<div className='img-box' data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
														{
															item.pic_cnt > 1 ? <img src='img/icon-photos.png' className='photos' /> : ''
														}
														<img src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_40') : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_40')):''} />
														<LazyLoad height={300} offset={300}>
															<img className='real-pic' src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } />
														</LazyLoad>
													</div>
													<div className='item-mid' style={{display:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc||item.activity_title?'block':'none'}}>
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
														<p data-id={item.rid} style={{display:item.pic.pic_desc?'block':'none'}} onClick={this.gotoDetail.bind(this)}>{item.pic.pic_desc}</p>
														{
															item.activity_title ? <a style={{paddingTop:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc?'10px':'0px'}} data-id={item.aid} data-type={item.type} onClick={this.gotoHuodong.bind(this)}><span>来自</span>{item.activity_title}</a> : ''
														}
													</div>
													<div className='border-half'>
														<div className='mid-bottom flex flex-space-between flex-ver-center'>
															<div className='bottom-left flex flex-space-between' data-id={item.rid} onClick={this.gotoDetail.bind(this)}>
																<div className='bottom-left-item flex'>
																	<div>点赞</div>
																	<span style={{display:item.like_cnt?'inline-block':'none'}}>{item.like_cnt}</span>
																</div>
																<div className='bottom-left-item flex'>
																	<div>收藏</div>
																	<span style={{display:item.favorite_cnt?'inline-block':'none'}}>{item.favorite_cnt}</span>
																</div>
																<div className='bottom-left-item flex'>
																	<div>分享</div>
																	<span style={{display:item.share_cnt?'inline-block':'none'}}>{item.share_cnt}</span>
																</div>
															</div>
															<div className='bottom-right' onClick={this.showAccusationList.bind(this,item)}>举报</div>
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
												<div style={{fontSize:'17px',marginTop:'50px'}}>作品征集中...</div>
											</div>
										)
									}</div>
								}
						</InfiniteScroll>
					</div>
					: <div></div>
				}
				{/*loading层*/}

				{
					this.state.loading ? <Loading></Loading> : ''
				}
			</div>
		)
	}
}