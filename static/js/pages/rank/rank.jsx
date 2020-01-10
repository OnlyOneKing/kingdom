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
import Service from './rankService.js';
import Navbar from '../../base/Navbar.jsx';
import Store from '../../store.js';
import StoreEvent from '../../base/storeEvent.js';
import Commonfn from '../../base/commonfn.js'
import InfiniteScroll from 'react-infinite-scroller'
import LazyLoad from 'react-lazyload'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js'
import {deepCopy,sort,sort1} from '../../../../../../common/utils/simpleUtil.js';
import Tips from '../../../../../../common/utils/Tips.jsx';
export default class Rank extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			tips:'',
			focuslist: [], // 焦点图数据
			sliderOffset: Store.getInstance().sindex.rank.sliderOffset,
			index: Store.getInstance().sindex.rank.index ? Store.getInstance().sindex.rank.index : 0,
			currentlist: Store.getInstance().sindex.rank.list.length ? Store.getInstance().sindex.rank.list[Store.getInstance().sindex.rank.index] : [],
			list: Store.getInstance().sindex.rank.list,
			tabs: Store.getInstance().sindex.rank.tabs,
			dayList: Store.getInstance().sindex.rank.dayList, // 今日图片数据列表
			weekList: Store.getInstance().sindex.rank.weekList, // 本周图片数据列表
			monthList: Store.getInstance().sindex.rank.monthList, // 当月图片数据列表
			sonScroll: Store.getInstance().sindex.rank.sonScroll,
			limit: 10, // 图片数据分页，每页显示几条数据
			page: Store.getInstance().sindex.rank.page, // 图片数据分页页码
			type: 1, // 图片数据类型  1:24小时榜 2:7天榜 3:月榜
			status: Store.getInstance().sindex.rank.status,  // 是否能继续加载
			navbarTop: 0, // 选项卡距离顶部高度
			loading: Store.getInstance().sindex.rank.weekList.length > 0 ? false : true,
			loadingData: [true, true], // 函数节流，防止多次加载
			toggleNav: Store.getInstance().sindex.rank.toggleNav, // 切换选项卡
		}
		this.timer = ''
	}
	componentWillMount () {
		document.title = '中国国家地理图片榜单'
	}
	componentDidUpdate () {
		if (this.state.toggleNav) {
			$('body,html').animate({scrollTop: this.state.sonScroll[this.state.index]}, 0)
			this.state.toggleNav = false
			Store.getInstance().sindex.rank.toggleNav = false
		}
	}
	componentDidMount () {
		this.getRecordListByLog();
		
		let type = 1
		if (Store.getInstance().sindex.rank.index) {
			type = parseFloat(Store.getInstance().sindex.rank.index + 1)
		}
		this.state.type = type
		this.loadData()	
		window.onscroll = this.onScroll.bind(this)
		this.setShare()
	}
	componentWillReceiveProps (newProps) {

	}
	componentWillUnmount () {
		 clearInterval(this.timer)
		 window.onscroll = null
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
	getRecordListByLog=()=>{
		Service.getRecordLikeLog().then(resp=>{
			switch(resp.code){
				case 0:
					if(resp.data.type==2){
						let d24 = [], d7 = [], d30 = [];
						let result24 = [], result7 = [], result30 = [];
						let extra24 = [],extra7 = [],extra30 = [];
						let time24 = 24*60*60;
						let time7 = 7*24*60*60;
						let time30 = 30*24*60*60;
						let now = resp.data.data.now;
						resp.data.data.list.forEach(item=>{
							item['num']=1;
							if(item.create_at<now && item.create_at>(now-time24)){
								d24.push(deepCopy(item));
							}else{
								let has = false;
								for(let i in d24){
									if(d24[i].rid==item.rid){
										has = true;
									}
								}
								if(!has)
									for(let j in extra24){
										if(extra24[j].rid==item.rid){
											has = true;
										}
									}
								if(!has)extra24.push(deepCopy(item));
							}
							if(item.create_at<now && item.create_at>(now-time7)){
								d7.push(deepCopy(item));
							}else{
								let has = false;
								for(let i in d7){
									if(d7[i].rid==item.rid){
										has = true;
									}
								}
								if(!has)
									for(let j in extra7){
										if(extra7[j].rid==item.rid){
											has = true;
										}
									}
								if(!has)extra7.push(deepCopy(item));
							}
							if(item.create_at<now && item.create_at>(now-time30)){
								d30.push(deepCopy(item));
							}else{
								let has = false;
								for(let i in d30){
									if(d30[i].rid==item.rid){
										has = true;
									}
								}
								if(!has)
									for(let j in extra30){
										if(extra30[j].rid==item.rid){
											has = true;
										}
									}
								if(!has)extra30.push(deepCopy(item));
							}
						})
						
						for(let i=0;i<d24.length;i++){
							let has = false;
							for(let j in result24){
								if(result24[j].rid==d24[i].rid){
									has = true;
									result24[j]['num']=result24[j]['num']+1;
								}
							}
							if(!has&&result24.length<10){
								result24.push(deepCopy(d24[i]));
								result24[result24.length-1]['num'] = 1;
							}
						}
						for(let i=0;i<d7.length;i++){
							let has = false;
							for(let j in result7){
								if(result7[j].rid==d7[i].rid){
									has = true;
									result7[j]['num']=result7[j]['num']+1;
								}
							}
							if(!has&&result7.length<10){
								result7.push(deepCopy(d7[i]));
								result7[result7.length-1]['num'] = 1;
							}
						}
						for(let i=0;i<d30.length;i++){
							let has = false;
							for(let j in result30){
								if(result30[j].rid==d30[i].rid){
									has = true;
									result30[j]['num']=result30[j]['num']+1;
								}
							}
							if(!has&&result30.length<10){
								result30.push(deepCopy(d30[i]));
								result30[result30.length-1]['num'] = 1;
							}
						}
						let result24_length = result24.length;
						if(result24_length<10){
							for(let i =0;i<(10-result24_length);i++){
								if(extra24.length-1>=i)result24.push(extra24[i]);
							}
						}
						let result7_length = result7.length;
						if(result7_length<10){
							for(let i =0;i<10-result7_length;i++){
								if(extra7.length-1>=i)result7.push(extra7[i]);
							}
						}
						let result30_length = result30.length; 
						if(result30.length<10){
							for(let i =0;i<10-result30_length;i++){
								if(extra30.length-1>=i)result30.push(extra30[i]);
							}
						}
						result24 = sort1(result24,'num');
						result7 = sort1(result7,'num');
						result30 = sort1(result30,'num');
						let r24 = [], r7 = [],r30=[];
						result24.forEach(item=>{
							r24.push(item.rid);
						})
						result7.forEach(item=>{
							r7.push(item.rid);
						})
						result30.forEach(item=>{
							r30.push(item.rid);
						})
						if(r24.length&&r7.length&&r30.length){
							let opt = {
								"date_rids":r24.join(','),  
								"week_rids":r7.join(','),  
								"month_rids":r30.join(',')
							}
							Service.hotRecordRank(opt).then(resp=>{
								switch(resp.code){
									case 0:
										if (resp.data.date_res.list.length > 0) {
											resp.data.date_res.list.forEach((item) => {
												item.pic[0].pic_desc = item.pic[0].pic_desc ? item.pic[0].pic_desc : item.pic[0].video_desc
												item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
												item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
												item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
												item.allAddress = Commonfn.getAddress(item)
											})
										}
										Store.getInstance().sindex.rank.dayList = resp.data.date_res.list

										if (resp.data.month_res.list.length > 0) {
											resp.data.month_res.list.forEach((item) => {
												item.pic[0].pic_desc = item.pic[0].pic_desc ? item.pic[0].pic_desc : item.pic[0].video_desc
												item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
												item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
												item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
												item.allAddress = Commonfn.getAddress(item)
											})
										}
										Store.getInstance().sindex.rank.monthList = resp.data.month_res.list

										if (resp.data.week_res.list.length > 0) {
											resp.data.week_res.list.forEach((item) => {
												item.pic[0].pic_desc = item.pic[0].pic_desc ? item.pic[0].pic_desc : item.pic[0].video_desc
												item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
												item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
												item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
												item.allAddress = Commonfn.getAddress(item)
											})
										}
										Store.getInstance().sindex.rank.weekList = resp.data.week_res.list

										this.setState({
											loading:false,
											dayList:Store.getInstance().sindex.rank.dayList,
											weekList:Store.getInstance().sindex.rank.weekList,
											monthList:Store.getInstance().sindex.rank.monthList,
											status:false,
											loadingData:true
										})
									break;
									default:
										this.showTips(resp.msg);
									break;
								}
							});
						}else{
							this.setState({
								loading: false
							})
							this.showTips('记录数据为空');
						}
					}else if(resp.data.type==1){
						let result = resp.data.data;
						if (result.date_res.list.length > 0) {
							result.date_res.list.forEach((item) => {
								item.pic[0].pic_desc = item.pic[0].pic_desc || item.pic[0].pic_desc == "" ? item.pic[0].pic_desc : item.pic[0].video_desc
												item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
												item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
												item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
								item.allAddress = Commonfn.getAddress(item)
							})
						}
						Store.getInstance().sindex.rank.dayList = result.date_res.list

						if (result.month_res.list.length > 0) {
							result.month_res.list.forEach((item) => {
								item.pic[0].pic_desc = item.pic[0].pic_desc || item.pic[0].pic_desc == "" ? item.pic[0].pic_desc : item.pic[0].video_desc
												item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
												item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
												item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
								item.allAddress = Commonfn.getAddress(item)
							})
						}
						Store.getInstance().sindex.rank.monthList = result.month_res.list

						if (result.week_res.list.length > 0) {
							result.week_res.list.forEach((item) => {
								item.pic[0].pic_desc = item.pic[0].pic_desc || item.pic[0].pic_desc == "" ? item.pic[0].pic_desc : item.pic[0].video_desc
												item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
												item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
												item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
								item.allAddress = Commonfn.getAddress(item)
							})
						}
						Store.getInstance().sindex.rank.weekList = result.week_res.list

						this.setState({
							loading:false,
							dayList:Store.getInstance().sindex.rank.dayList,
							weekList:Store.getInstance().sindex.rank.weekList,
							monthList:Store.getInstance().sindex.rank.monthList,
							status:false,
							loadingData:true
						})

					}
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
	 * [微信分享 ]
	 */
	setShare = () => {
		let sharetitle = '榜单'
		let sharedes = '「中国国家地理图片」'
		let shareTimeLinedes = sharedes;
		let link = window.location.href;
		let hideMenuItems = ['menuItem:share:facebook'];
        WeChatUtil.getInstance().set({'hideMenuItems':hideMenuItems,'title':sharetitle,'link':link,'desc':sharedes,'shareTimeLinedes':shareTimeLinedes,'showShare':true});
	}
	/**
	 * [加载页面数据]
	 */
	loadData = () => {
		// this.getBannerList()
		// 没有数据则加载数据 1:总榜 2:24小时榜 3:7天榜 4:月榜
		// if (this.state.dayList.length === 0) {
		// 	this.getDayList()
		// }
		// if (this.state.weekList.length === 0) {
		// 	this.getWeekList()
		// }
		// if (this.state.monthList.length === 0) {
		// 	this.getMonthList()
		// }
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
			switch (resp.code) {
				case 0:
					let data = resp.data.list
					data.forEach((item) => {
						item.pic_url = item.pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth
					})
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
	 * [获得今日数据列表]
	 */
	getDayList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[0] == -1) {
			status[0] = false
			Store.getInstance().sindex.rank.status = status
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
		Service.getRankList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let dayList = [...this.state.dayList]
					let data = resp.data.list
					console.log('data', data)
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
					dayList = dayList.concat(data)

					this.state.page[0] = resp.data.next_page
					status[0] = true
					loadingData[0] = true
					Store.getInstance().sindex.rank.dayList = dayList
					Store.getInstance().sindex.rank.page[0] = resp.data.next_page
					Store.getInstance().sindex.rank.status = status

					_this.setState({
						dayList,
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
	 * [获得本周数据列表]
	 */
	getWeekList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[1] == -1) {
			status[1] = false
			Store.getInstance().sindex.rank.status = status
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
		Service.getRankList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let weekList = [...this.state.weekList]
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
					weekList = weekList.concat(data)

					this.state.page[1] = resp.data.next_page
					status[1] = true
					loadingData[1] = true
					Store.getInstance().sindex.rank.weekList = weekList
					Store.getInstance().sindex.rank.page[1] = resp.data.next_page
					Store.getInstance().sindex.rank.status = status

					_this.setState({
						weekList,
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
	 * [获得今日数据列表]
	 */
	getMonthList = () => {
		let _this = this
		let status = this.state.status
		let loadingData = this.state.loadingData
		if (this.state.page[2] == -1) {
			status[2] = false
			Store.getInstance().sindex.rank.status = status
			this.setState({
				status
			})
			return false
		}
		if (loadingData[2] == false) {
			return false
		}
		loadingData[2] = false
		let opt = {
			limit: this.state.limit,
			type: 4,
			page: this.state.page[2],
		}
		Service.getRankList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let monthList = [...this.state.monthList]
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
					monthList = monthList.concat(data)

					this.state.page[2] = resp.data.next_page
					status[2] = true
					loadingData[2] = true
					Store.getInstance().sindex.rank.monthList = monthList
					Store.getInstance().sindex.rank.page[2] = resp.data.next_page
					Store.getInstance().sindex.rank.status = status

					_this.setState({
						monthList,
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
		Store.getInstance().sindex.rank.index = index
		Store.getInstance().sindex.rank.sliderOffset = sliderOffset
		this.setState({
			sliderOffset:Store.getInstance().sindex.rank.sliderOffset,
			index:Store.getInstance().sindex.rank.index,
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
		let rid = e.currentTarget.getAttribute("data-id")
		Store.getInstance().sindex.rank.toggleNav = true
		hashHistory.push({
			pathname: 'details',
			query: {
				rid
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
		if ($('._swiper__slide').height()) {
			this.state.navbarTop = $('._swiper__slide').height()
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
		}
		// 记录每个子选项滚动高度
		sonScroll[this.state.index] = scrollTop
		Store.getInstance().sindex.rank.sonScroll = sonScroll
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
	        {/*tab选择*/}
	        	<div className='bar-body'
	        		 style={{marginBottom:'5px'}}>
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
					this.state.type == 1 ? 
					<div className='lists'>
						<InfiniteScroll
						    pageStart={0}
						    loadMore={this.getDayList}
						    hasMore={this.state.status[0]}
						    loader={this.state.status[0] ? <Jiazai key={0}></Jiazai> : ''}>
		 						{
								this.state.dayList.length > 0 ? 
								this.state.dayList.map((item, index) => {
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
														<div className='rank flex flex-center flex-ver-center'><span>TOP</span>{index + 1}</div>
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
														<p style={{display:item.pic.pic_desc?'block':'none'}}>{item.pic.pic_desc}</p>
														{
															item.activity_title ? <a href="" style={{paddingTop:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc?'10px':'0px'}}><span>来自</span>{item.activity_title}</a> : ''
														}
													</div>
													<div className='border-half'>
														<div className='mid-bottom flex flex-space-between flex-ver-center'>
															<div className='bottom-left flex flex-space-between'>
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
										this.state.loading ? '加载中' : this.state.dayList.length > 0 ? '加载中' : 
										(
											<div className="coming-soon flex-column flex-ver-center">
												<div style={{fontSize:'17px',marginTop:'50px'}}>作品征集中...</div>
											</div>
										)
									}</div>
								}
						</InfiniteScroll>
					</div> : 
					this.state.type == 2 ? 
					<div className='lists'>
						<InfiniteScroll
						    pageStart={0}
						    loadMore={this.getWeekList}
						    hasMore={this.state.status[1]}
						    loader={this.state.status[1] ? <Jiazai key={0}></Jiazai> : ''}>
		 						{
								this.state.weekList.length > 0 ? 
								this.state.weekList.map((item, index) => {
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
														<div className='rank flex flex-center flex-ver-center'><span>TOP</span>{index + 1}</div>
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
														<p style={{display:item.pic.pic_desc?'block':'none'}}>{item.pic.pic_desc}</p>
														{
															item.activity_title ? <a href="" style={{paddingTop:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc?'10px':'0px'}}><span>来自</span>{item.activity_title}</a> : ''
														}
													</div>
													<div className='border-half'>
														<div className='mid-bottom flex flex-space-between flex-ver-center'>
															<div className='bottom-left flex flex-space-between'>
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
										this.state.loading ? '加载中' : this.state.dayList.length > 0 ? '加载中' : 
										(
											<div className="coming-soon flex-column flex-ver-center">
												<div style={{fontSize:'17px',marginTop:'50px'}}>作品征集中...</div>
											</div>
										)
									}</div>
								}
						</InfiniteScroll>
					</div>
					: 
					this.state.type == 3 ? 
					<div className='lists'>
						<InfiniteScroll
						    pageStart={0}
						    loadMore={this.getMonthList}
						    hasMore={this.state.status[2]}
						    loader={this.state.status[2] ? <Jiazai key={0}></Jiazai> : ''}>
		 						{
								this.state.monthList.length > 0 ? 
								this.state.monthList.map((item, index) => {
									return (
												<div className='lists-item' key={index}>
													<div className='item-top flex flex-space-between flex-ver-center'>
														<div className='item-top-left flex flex-ver-center'>
															{
																item.avatar ? <img src={item.avatar} /> : <img src='img/headExample.jpg'/>
															}															<span className='name'>{item.username}</span>
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
														<div className='rank flex flex-center flex-ver-center'><span>TOP</span>{index + 1}</div>
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
														<p style={{display:item.pic.pic_desc?'block':'none'}}>{item.pic.pic_desc}</p>
														{
															item.activity_title ? <a href="" style={{paddingTop:item.allAddress||item.title||item.pic_cnt>1||item.pic.pic_desc?'10px':'0px'}}><span>来自</span>{item.activity_title}</a> : ''
														}
													</div>
													<div className='border-half'>
														<div className='mid-bottom flex flex-space-between flex-ver-center'>
															<div className='bottom-left flex flex-space-between'>
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
										this.state.loading ? '加载中' : this.state.dayList.length > 0 ? '加载中' : 
										(
											<div className="coming-soon flex-column flex-ver-center">
												<div style={{fontSize:'17px',marginTop:'50px'}}>作品征集中...</div>
											</div>
										)
									}</div>
								}
						</InfiniteScroll>
					</div> : <div></div>
				}
				{/*loading层*/}

				{
					this.state.loading ? <Loading></Loading> : ''
				}
				<Tips words={this.state.tips}></Tips>
			</div>
		)
	}
}