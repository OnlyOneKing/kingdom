import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import { Swiper, Slide } from 'react-dynamic-swiper';
import 'react-dynamic-swiper/lib/styles.css';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './detailsService.js';
import Store from '../../store.js';
import Commonfn from '../../base/commonfn.js';
import LazyLoad from 'react-lazyload'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js';
import fn from '../../../../../../common/utils/fn.js'; 
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js'; 
export default class Details extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			loading: false,
			record_id: '', // 记录id
			aid: '',
			details: {
				allAddress: '',
				lat: 0,
				lng: 0,
				is_vote: -1
			}, // 详细数据
			picture_list: [],
			commentData: [], // 评论列表
			page: 1, // 评论页码
			limit: 5, // 评论一页显示数据
			showMode:2, //1普通征集  2大赛征集中  3大赛征集结束
		}
	}
	componentWillMount () {
		console.log('Store.getInstance().index', Store.getInstance().index)
	}
	componentDidUpdate () {
		
	}
	componentDidMount () {
		WeChatUtil.getInstance().changeTitle('详情');
		this.initPage(this.props)
	}
	componentWillReceiveProps (newProps) {
		this.initPage(newProps)
		
	}
	componentWillUnmount () {
		
	}
	// 初始化页面参数
	initPage = (props) => {
		let rid = props.location.query.rid;
		let aid = props.location.query.aid ? props.location.query.aid : '';
		this.state.record_id = rid;
		this.state.aid = aid;
		this.loadData()
	}
	/**
	 * [微信分享 ]
	 */
	setShare=()=>{
		let sharetitle = this.state.details.title;
		let sharedes = this.state.details.activity_title+(sharetitle?'':' - 「中国国家地理图片」');
		let shareTimeLinedes = sharedes;
		let link = window.location.href;
		let sharesrc = 'img/cngplus.jpg';
		!(this.state.details instanceof Array) &&this.state.details.picture_list.forEach(item=>{
			if(item.focus) sharesrc = this.state.details.media_type == 2 ? (item.video_url + ',h_22,w_40') : (item.pic_url + '?x-oss-process=image/resize,w_250');
		})
		sharesrc = sharesrc.match(/http/ig)?sharesrc:(window.location.href.split(".com/")[0]+".com/"+sharesrc);
		let hideMenuItems = ['menuItem:share:facebook'];
        WeChatUtil.getInstance().set({'hideMenuItems':hideMenuItems,'title':sharetitle,'link':link,'icon':sharesrc,'desc':sharedes,'shareTimeLinedes':shareTimeLinedes,'showShare':true,'rid':this.state.record_id});
	}
	/**
	 * [加载页面数据]
	 */
	loadData = () => {
		this.setState({
			loading: true
		})
		this.getDetails()
		this.getComment()
	}
	/**
	 * [获得图片数据列表]
	 */
	getDetails = () => {
		let _this = this
		
		let opt = {
			record_id: this.state.record_id
		}
		Service.recordDetails(opt).then((resp) => {
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let details = resp.data.details
					let picture_list = details instanceof Array?[]:details.picture_list
					
					details.allAddress = Commonfn.getAddress(details);
					this.state.details = details;
					this.setShare();
					_this.setState({
						showMode:details.type!=2?1:(details.vote_stage?2:3),
						details,
						picture_list
					})
					break;
				case 111:
					Commonfn.aotoLogin()
					break;
			}
		})
	}
	/**
	 * [获得评论列表]
	 */
	getComment = () => {
		let _this = this
		
		let opt = {
			rid: this.state.record_id,
			page: this.state.page,
			limit: this.state.limit,
		}
		Service.getComment(opt).then((resp) => {
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let commentData = resp.data.list
					commentData.forEach((item) => {
						item.create_at = Commonfn.getFormatTime(item.create_at)
					})
					_this.setState({
						commentData
					})
					break;
				case 111:
					Commonfn.aotoLogin()
					break;
			}
		})
	}
	/**
	 * [点赞收藏]
	 */
	handleInteract = (e) => {
		if(this.state.loading)return;
		let _this = this
		let details = {...this.state.details}
		let type = e.currentTarget.getAttribute("data-type")
		let opt = {
			rid: this.state.record_id,
			type
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
					if (type == 1) {
						if (details.is_thumbs == 1) {
							details.is_thumbs = 0
							details.like_cnt = parseFloat(details.like_cnt - 1)
						} else {
							details.is_thumbs = 1
							details.like_cnt = parseFloat(details.like_cnt + 1) 
						}
					} else {
						details.is_collect == 1 ? details.is_collect = 0 : details.is_collect = 1
					}
					_this.setState({
						details
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
	 * [跳转页面]
	 */
	goto = (e) => {
		let router = e.currentTarget.getAttribute("data-router")
		hashHistory.push({
			pathname: router
		})
	}
	/**
	 * [跳转页面]
	 */
	gotoAddress = () => {
		let details = {...this.state.details}
		if (details.lat != 0 && details.lng != 0) {
			hashHistory.push({
			pathname: 'address',
			query: {
				lat: details.lat,
				lng: details.lng
			}
		})
		}
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
		} else if (type == 4) {
			url = 'photobasenoson'
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
	handleVote=()=>{
		if(this.state.loading||this.state.details.is_vote==1||!this.state.details.aid)return;
		let opt = {
			rid: this.state.record_id,
			aid: this.state.details.aid
		}
		this.setState({
			loading: true
		})
		Service.handleVote(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					// this.state.details.
					this.state.details.is_vote = this.state.details.is_vote==1?0:1;
					this.state.details.vote_cnt = parseInt(this.state.details.vote_cnt)+(this.state.details.is_vote==1?1:-1);
					this.setState({
						details:this.state.details
					})
					break;
				case 111:
					Commonfn.aotoLogin()
					break;
			}
		})
	}
	showAccusationList=()=>{
		Store.getInstance().accusateItem = this.state.details;
		hashHistory.push('accusation');
	}
	join=()=>{
		console.log('this.state.details', this.state.details)
		hashHistory.push({
			pathname:'info',
			query: {
				aid: this.state.details.aid,
				aname: this.state.details.activity_title
			}
		})
	}
	render () {
		return (
			<div className='details-content'>
			{
				this.state.details.title || this.state.details.activity_title  ? 
				<div className='bottomline'>
					<h1>{this.state.details.title}</h1>
					{
						this.state.details.activity_title ? 
						<div className='huodong' data-id={this.state.details.aid} data-type={this.state.details.type} onClick={this.gotoHuodong.bind(this)}>
							<span>来自</span>
							<span>{this.state.details.activity_title}</span>
						</div> : ''
					}
				</div> : ''
			}
			{/*主题内容列表*/}
				<div className='lists'>
					<div className='lists-item'>
						<div className='item-top flex flex-space-between flex-ver-center'>
							<div className='item-top-left flex flex-ver-center'>
								
								{
									this.state.details.avatar ? <img src={this.state.details.avatar} /> : <img src='img/headExample.jpg'/>
								}
								<span className='name'>{this.state.details.username}</span>
							</div>
							<div className='item-top-right'>
								{/*<span className='guanzhu'>+关注</span>*/ }
								<span className='all' data-uid={this.state.details.uid} data-uname={this.state.details.username} onClick={this.gotoAll.bind(this)}>查看该用户全部作品</span>
							</div>
						</div>
						{	
							this.state.picture_list.map((item, index) => {
								return (
									<div className='pic' key={index}>
										<div className='img-box'>
											{
												item.video_url&&item.video_width==0?
												<div style={{display:'none'}}></div> :
												<img src={item.pic_url ? (item.pic_url + '?x-oss-process=image/resize,w_40') : (item.video_url ? (item.video_url + ',w_40') : '')} />
											}
											
											<LazyLoad height={300} offset={300}>
												{
													item.video_url&&item.video_width==0?
													<div style={{backgroundColor:'#ffffff',padding:'15px'}}>
														<div className="" style={{padding:'15px 0px',backgroundColor:'#eeeeee',width:'100%', color:'#282828',textAlign:'center',fontSize:'16px'}}>视频已上传(暂不支持页面播放)</div>
													</div>:
													<img className='real-pic' src={item.pic_url ? (item.pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth) : (item.video_url ? (item.video_url + ',w_' + Store.getInstance().clientWidth) : '')} />
												}
												
											</LazyLoad>
											
											<div className='img-mask'></div>
										</div>
										<div className='item-mid'>
											{
												item.pic_desc ? <p>{item.pic_desc}</p> : (item.video_desc ? <p>{item.video_desc}</p> : '')
											}
										</div>
									</div>
								)
							})
						}
						<div className='mid-bottom flex  flex-ver-center flex-space-between'>
							<div className='bottom-left flex flex-space-between'>
								<div className='bottom-left-item flex flex-center flex-ver-center'>
									<div>{Commonfn.numberToWan(this.state.details.viewcount, '万')}</div>
									<div style={{marginLeft: this.state.details.viewcount > 10000 ? '0px' : '2px'}}>浏览</div>
								</div>
								<div className='bottom-left-item flex flex-center flex-ver-center'>
									<div>{Commonfn.numberToWan(this.state.details.like_cnt, '万')}</div>
									<div style={{marginLeft: this.state.details.like_cnt > 10000 ? '0px' : '2px'}}>赞</div>
								</div>
							</div>
							<div style={{color:'#888'}} onClick={this.showAccusationList.bind(this)}>举报</div>
						</div>
					</div>
				</div>
			{/*拍摄地点*/}
				{
					!this.state.details.allAddress && (this.state.details.lat == 0 && this.state.details.lng == 0) ? 
					'' : <div className='info-item flex flex-space-between' onClick={this.gotoAddress}>
						<div className='item-left flex flex-ver-center'>
							<img src="img/icon-site.png"/>
							<span>拍摄地点</span>
						</div>
						<div className='item-right flex flex-ver-center'>
							<div>
								{
									this.state.details.allAddress ? this.state.details.allAddress : (this.state.details.lat != 0 && this.state.details.lng != 0 ? (this.state.details.lat + ',' + this.state.details.lng) : '')
								}
							</div>
							{
								(this.state.details.lat == 0 && this.state.details.lng == 0) ? '' : <img src="img/icon-right.png"/>
							}
						</div>
					</div>
				}
			{/*大赛投票专区*/}
			{
				this.state.showMode==2?
				<div className="voteArea">
					<div className="voteArea-activity">
						<div className="voteArea-tips">本组图片已参加</div>
						<div className="function-text vote-title" data-id={this.state.details.aid} data-type={this.state.details.type} onClick={this.gotoHuodong.bind(this)}>{this.state.details.activity_title}</div>
					</div>
					<div className="voteShow flex-column flex-center flex-ver-center"> 
						{
							this.state.details.vote_cnt?
							<div className="vote-cnt">{'已得票 '+this.state.details.vote_cnt}</div>:
							<div style={{display:'none'}}></div>
						}
						{
							this.state.details.is_vote==-1?
							<div style={{display:'none'}}></div>:
							<div>
								<div className="vote-btn" style={{marginTop:this.state.details.vote_cnt?'20px':'0px',backgroundColor:this.state.details.is_vote?'#b2b2b2':'#09bb07'}} onClick={this.handleVote.bind(this)}>{this.state.details.is_vote?'已投票':'投一票'}</div>
							</div>
						}
					</div>
				</div>:<div style={{display:'none'}}/>
			}  
			{
				this.state.showMode==3?
				<div className="voteArea">
					<div className="voteArea-activity">
						<div className="voteArea-tips">本组图片已参加</div>
						<div className="function-text vote-title" data-id={this.state.details.aid} data-type={this.state.details.type} onClick={this.gotoHuodong.bind(this)}>{this.state.details.activity_title}</div>
					</div>
					<div className="voteShow flex-column flex-center flex-ver-center">
						<div className="vote-cnt">{'共得票 '+this.state.details.vote_cnt}</div>
					</div>
				</div>:<div style={{display:'none'}}/>
			}
			{/*点评内容*/}
				{
					this.state.commentData.length > 0 ? 
					<div className='dianping'>
					<h4>点评</h4>
					{
						this.state.commentData.map((item, index) => {
							return (
								<div className='bottomline' key={index}>
									<div className='item-top flex flex-space-between flex-ver-center'>
										<div className='item-top-left flex flex-ver-center'>
											{
												item.avatar ? <img src={item.avatar} /> : <img src='img/headExample.jpg'/>
											}
											<span className='name'>{item.username}</span>
										</div>
										<div className='item-top-right'>
											<span className='time'>{item.create_at}</span>
										</div>
									</div>
									<div className='item-bottom'>
										{item.content}
									</div>
								</div>
							)
						})
					}
					
				</div> : ''
				}

			{/*底部操作栏*/}
				<div className='bottom flex flex-space-around flex-ver-center'>
					{/*<div>点评</div>*/}
					{
						this.state.showMode==1||this.state.showMode==3?
						<div data-type='1' onClick={this.handleInteract.bind(this)}>
						{
							this.state.details.is_thumbs == 1 ? '已点赞' : '点赞'
						}
						</div>:<div style={{display:'none'}}/>
					}
					<div data-type='2' onClick={this.handleInteract.bind(this)}>
						{
							this.state.details.is_collect == 1 ? '已收藏' : '收藏'
						}
					</div>
					<div onClick={()=>{this.setState({showShare:true});}}>分享</div>
					{
						this.state.aid==this.state.details.aid?
						<div style={{backgroundColor:'#09bb07',color:'#fff',flex:2}} onClick={()=>{this.join();}}>继续上传</div>:
						<div style={{display:'none'}}/>
					}
					
				</div>
			{/*分享弹出层*/}
			{
				this.state.showShare&&fn.isWXWB()?
				<div className='share-box' onClick={()=>{this.setState({showShare:false});}}>
					<img src="img/sharetips.png" alt=""/>
				</div>:
				<div style={{display:'none'}}></div>
			}
			</div>
		)
	}
}