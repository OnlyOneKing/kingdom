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
export default class Caogao extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			page: 1, // 页码
			limit: 5, // 每页数据
			dataList: [], // 数据列表
			status: false  // 是否能继续加载
		}
	}
	componentWillMount () {
		document.title = '我的草稿'
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
		this.setState({
			dataList: []
		})
		this.getDataList()
	}
	/**
	 * [获得图片数据列表]
	 */
	getDataList = () => {
		let _this = this
		if (this.state.page == -1) {
			this.setState({
				status: false
			})
			return
		}
		let opt = {
			limit: this.state.limit,
			page: this.state.page,
		}
		Service.draftList(opt).then((resp) => {
			console.log('resp', resp)
			switch (resp.code) {
				case 0:
					let dataList = [...this.state.dataList]
					let data = resp.data.list
					data.forEach((item) => {

						if (item.pic.length > 0) {
								item.pic[0].pic_desc = item.pic[0].pic_desc || item.pic[0].pic_desc == "" ? item.pic[0].pic_desc : item.pic[0].video_desc
								item.pic[0].pic_height = item.pic[0].pic_height ? item.pic[0].pic_height : item.pic[0].video_height
								item.pic[0].pic_url = item.pic[0].pic_url ? item.pic[0].pic_url : item.pic[0].video_url
								item.pic[0].pic_width = item.pic[0].pic_width ? item.pic[0].pic_width : item.pic[0].video_width
							}
						
						item.allAddress = Commonfn.getAddress(item)
					})
					dataList = dataList.concat(data)
					this.state.page = resp.data.next_page
					_this.setState({
						dataList,
						status: true
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
		hashHistory.push({
			pathname: 'details',
			query: {
				rid
			}
		})
	}
	/**
	 * [删除草稿]
	 */
	delete = (index, e) => {
		let _this = this
		let rid = e.currentTarget.getAttribute("data-id")
		let opt = {
			id: rid
		}
		Service.deleteCaogao(opt).then((resp) => {
			console.log('resp', resp)
			switch (resp.code) {
				case 0:
					let dataList = [...this.state.dataList]
					dataList = dataList.filter((_, i) => i !== index)
					this.setState({
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
	 * [继续编辑]
	 */
	bianji = (e) => {
		let _this = this
		let rid = e.currentTarget.getAttribute("data-id")
		// 跳转到上传页
		hashHistory.push({
			pathname: 'uploadpic',
			query: {
				rid,
				wType: 1 // wType，表示是否是继续编辑
			}
		})
	}
	
	render () {
		return (
			<div className='caogao-content allphotos-content'>
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
									<div className='lists-item' key={index}>
										<div>
											<div className='img-box'>
												{
													item.pic_cnt > 1 ? <img src='img/icon-photos.png' className='photos' /> : ''
												}
												{
													item.pic.length && item.pic[0].pic_url ?
													<img src={item.pic.length?(item.pic[0].pic_url.match('video') ? (item.pic[0].pic_url + ',w_' + Store.getInstance().clientWidth) : (item.pic[0].pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth)):'' } /> : <div className='no-pic'></div>
												}
												<div className='btn bianji' data-id={item.rid} onClick={this.bianji.bind(this)}>继续编辑</div>
											</div>
											<div className='item-mid' style={{display:item.allAddress||item.title||item.pic.pic_desc||item.activity_title?'block':'none'}}>
												{
													item.allAddress ? 
													<div className='mid-top flex flex-ver-center'>
														<img src='img/icon-site.png' />
														<span>{item.allAddress}</span>
													</div> : ''
												}
												{
													item.title ? 
													<h1>
														{item.title}
														{
															item.pic_cnt > 1 ? <span className='pic_cnt'>（共{item.pic_cnt}张图）</span> : ''
														}
													</h1> : ''
												}
												<p>{item.pic.pic_desc}</p>
												{
													item.activity_title ? <a><span>来自</span>{item.activity_title}</a> : ''
												}
											</div>
										</div>
										<div className='item-bot'>
											<div className='btn delete' data-id={item.rid} onClick={this.delete.bind(this, index)}>删除草稿</div>
										</div>
									</div>
								)
							})
						}
					</InfiniteScroll>
				</div> : <div className='noData'>还没有数据哟~</div>
				}
			</div>
		)
	}
}