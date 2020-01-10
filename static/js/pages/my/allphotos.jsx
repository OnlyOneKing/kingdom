import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './myService.js';
import Store from '../../store.js';
import Jiazai from '../../base/jiazai.jsx';
import Commonfn from '../../base/commonfn.js'
import InfiniteScroll from 'react-infinite-scroller'
import LazyLoad from 'react-lazyload'
import Navbar from '../../base/Navbar.jsx'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js'
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js';
export default class Allphotos extends React.Component {
	constructor () {
		super()
		this.state = {
			uid: 0, // uid 为 0 自己的作品 有数值着为该用户的作品
			sliderOffset: Store.getInstance().allPhotos.sliderOffset,
			index: Store.getInstance().allPhotos.index ? Store.getInstance().allPhotos.index : 0,
			currentlist: Store.getInstance().allPhotos.list.length ? Store.getInstance().allPhotos.list[Store.getInstance().allPhotos.index] : [],
			list: Store.getInstance().allPhotos.list,
			tabs: Store.getInstance().allPhotos.tabs,
			dataList: Store.getInstance().allPhotos.dataList, // 全部图片数据列表
			picList: Store.getInstance().allPhotos.picList, // 精华图片数据列表
			sonScroll: Store.getInstance().allPhotos.sonScroll,
			limit: 5, // 图片数据分页，每页显示几条数据
			page: Store.getInstance().allPhotos.page, // 图片数据分页页码
			type: -1, // 图片数据类型 -1全部 1精华 
			status: Store.getInstance().allPhotos.status,  // 是否能继续加载
			navbarTop: 0, // 选项卡距离顶部高度
			loading: Store.getInstance().allPhotos.dataList.length > 0 ? false : true,
			loadingData: [true, true], // 函数节流，防止多次加载
			toggleNav: Store.getInstance().allPhotos.toggleNav, // 切换选项卡
		}
	}
	componentWillMount () {
		
	}
	componentDidUpdate () {
		if (this.state.toggleNav) {
			$('body,html').animate({scrollTop: this.state.sonScroll[this.state.index]}, 0)
			this.state.toggleNav = false
			Store.getInstance().allPhotos.toggleNav = false
		}
	}
	componentDidMount () {
		window.onscroll = this.onScroll.bind(this)
		// 微信分享
		this.setShare()
		this.initPage(this.props);
	}
	componentWillReceiveProps (newProps) {
		this.initPage(newProps);
	}
	componentWillUnmount () {
		window.onscroll = null
	}
	initPage=(props)=>{
		let type = Store.getInstance().allPhotos.index==-1?props.location.query.type:(Store.getInstance().allPhotos.index?1:-1)
		let uid = props.location.query.uid
		console.log(props.location);
		let uname = props.location.query.uname
		if (uid) {
			this.state.uid = uid
		}
		uname ? document.title = uname + '的图片' : document.title = '我的图片'
		if (type) {
			this.state.type = type
			if (type == 1) {
				$('.navBarItem')[1].click();
			}else if (type == -1) {
				$('.navBarItem')[0].click();
			}
		}
		this.loadData()
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
	 * [加载页面数据]
	 */
	loadData = () => {
		// 没有数据则加载进行中数据
		if (this.state.dataList.length === 0) {
			this.getDataList()
		} 
		// 没有数据则加载进行中数据
		if (this.state.picList.length === 0) {
			this.getPicList()
		} 

	}
	/**
	 * [获得全部图片数据列表]
	 */
	getDataList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[0] == -1) {
			status[0] = false
			Store.getInstance().allPhotos.status = status
			this.setState({
				status
			})
			return
		}
		if (loadingData[0] == false) {
			return
		}
		loadingData[0] = false
		let opt = {
			limit: this.state.limit,
			type: -1,
			page: this.state.page[0],
			uid: this.state.uid,
		}
		Service.myPicture(opt).then((resp) => {
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

					this.state.page[0] = resp.data.next_page
					status[0] = true
					loadingData[0] = true
					Store.getInstance().allPhotos.dataList = dataList
					Store.getInstance().allPhotos.page[0] = resp.data.next_page
					Store.getInstance().allPhotos.status = status

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
	 * [获得精华数据列表]
	 */
	getPicList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[1] == -1) {
			status[1] = false
			Store.getInstance().allPhotos.status = status
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
			type: 1,
			page: this.state.page[1],
			uid: this.state.uid,
		}
		Service.myPicture(opt).then((resp) => {
			console.log('resp2', resp)
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let picList = [...this.state.picList]
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
					picList = picList.concat(data)

					this.state.page[1] = resp.data.next_page
					status[1] = true
					loadingData[1] = true
					Store.getInstance().allPhotos.picList = picList
					Store.getInstance().allPhotos.page[1] = resp.data.next_page
					Store.getInstance().allPhotos.status = status

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
	 * [跳转到详情]
	 */
	gotoDetail = (e) => {
		let rid = e.currentTarget.getAttribute("data-id")
		Store.getInstance().allPhotos.toggleNav = true
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
	 * [tab切换]
	 * @param  index [当前tab序号]
	 * @param  sliderOffset [当前tab左偏移量]
	 */
	navbarTap = (index,sliderOffset) => {
		Store.getInstance().allPhotos.index = index
		Store.getInstance().allPhotos.sliderOffset = sliderOffset
		this.setState({
			sliderOffset:Store.getInstance().allPhotos.sliderOffset,
			index:Store.getInstance().allPhotos.index,
			currentlist:this.state.list[index],
			toggleNav: true
		})
		if (this.state.sonScroll[index] == 0) {
			$('.navBar').css({position: 'relative',boxShadow:'none'})
		}
	}
	/**
	 * [滚动事件]
	 */
	onScroll = (e) => {
		let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
		let sonScroll = [...this.state.sonScroll]
		// 固定选项卡在顶部
		if (scrollTop <= this.state.navbarTop) {
			$('.navBar').css({position: 'relative', zIndex: 1, boxShadow:'none'})
		} else {
			$('.navBar').css({position: 'fixed', top: 0, zIndex: 9, boxShadow: '1px 1px 8px 1px rgba(0, 0, 0, 0.2)'})
		}
		// 记录每个子选项滚动高度
		sonScroll[this.state.index] = scrollTop
		Store.getInstance().allPhotos.sonScroll = sonScroll
		this.setState({
			sonScroll
		})
	}

	render () {
		return (
			<div className='allphotos-content'>
			{/*tab选择*/}
	        	<div className='bar-body'>
	        		<Navbar 
	        		className='navBar'
	        		ref="navbar"
					style={{backgroundColor:'#ffffff',marginBottom:'5px',color:'#484949',display:'flex',alignItems:'center',justifyContent: 'space-around'}}
					sliderwidth={44}
					sliderOffset={this.state.index ? this.state.sliderOffset : 50}
					activeIndex = {this.state.index}
					tabs={this.state.tabs}
					callback={this.navbarTap}
					/>
	        	</div>
			{/*主题内容列表*/}
				{
					this.state.index == 0 ? 
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
													<p style={{display:item.pic.pic_desc?'block':'none'}} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>{item.pic.pic_desc}</p>
													{
														item.activity_title ? <a style={{paddingTop:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc?'10px':'0px'}} data-id={item.aid} data-type={item.type} onClick={this.gotoHuodong.bind(this)}><span>来自</span>{item.activity_title}</a> : ''
													}
												</div>
											</div>
										)
									})
									:
									<div className='nodata'>{
										this.state.loading ? '加载中' : this.state.dataList.length > 0 ? '加载中' : 
										(
											<div className="coming-soon flex-column flex-ver-center">
												<div style={{fontSize:'17px',marginTop:'50px'}}>还没有上传</div>
											</div>
										)
									}</div>
							}
						</InfiniteScroll>
					</div> 
					:
					this.state.index == 1 ?
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
													<p style={{display:item.pic.pic_desc?'block':'none'}} data-id={item.rid} onClick={this.gotoDetail.bind(this)}>{item.pic.pic_desc}</p>
													{
														item.activity_title ? <a data-id={item.aid} style={{paddingTop:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc?'10px':'0px'}} data-type={item.type} onClick={this.gotoHuodong.bind(this)}><span>来自</span>{item.activity_title}</a> : ''
													}
												</div>
											</div>
										)
									})
									:
									<div className='nodata'>{
										this.state.loading ? '加载中' : this.state.picList.length > 0 ? '加载中' : 
										(
											<div className="coming-soon flex-column flex-ver-center">
												<div style={{fontSize:'17px',marginTop:'50px'}}>期待你的第一个精华作品</div>
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