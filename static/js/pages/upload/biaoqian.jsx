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
export default class Biaoqian extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			loading: false, // 显示加载中
			biaoqianList: [], // 热门标签列表
			biaoqianListMy: [], // 我的标签列表
			biaoqianListAll: [], // 全部标签列表，用于联想
			lianXiangList: [], // 联想列表
		}
	}
	componentWillMount () {
		document.title = '选择标签'
	}
	componentDidUpdate () {
		
	}
	componentDidMount () {
		// 清空标签数据
		// Store.getInstance().index.tag = {}
		console.log('Store.getInstance().index.tag', Store.getInstance().index.tag)
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
		this.getBiaoqianList()
		this.getBiaoqianListMy()
		// this.getBiaoqianListAll()
	}
	/**
	 * [获得热门列表]
	 */
	getBiaoqianList = () => {
		let _this = this
		let opt = {
			type: 1
		}
		this.setState({
			loading: true
		})
		Service.biaoqianList(opt).then(resp => {
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let biaoqianList = resp.data.list
					// 标签名称
					if (Store.getInstance().index.tag) {
						if (Object.keys(Store.getInstance().index.tag).length > 0) {
							let tag = Store.getInstance().index.tag
							let keyArr = []
							for (let key in tag) {
								keyArr.push(key)
							}

							biaoqianList.forEach((item) => {
								keyArr.indexOf((item.tag_id).toString()) != -1 ? item.select = true : item.select = false
							})
						}
					}
					
					_this.setState({
						biaoqianList
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
	 * [获得我的列表]
	 */
	getBiaoqianListMy = () => {
		let _this = this
		let opt = {
			type: 2
		}
		this.setState({
			loading: true
		})
		Service.biaoqianList(opt).then(resp => {
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let biaoqianListMy = resp.data.list
					// 标签名称
					if (Store.getInstance().index.tag) {
						if (Object.keys(Store.getInstance().index.tag).length > 0) {
							let tag = Store.getInstance().index.tag
							let keyArr = []
							for (let key in tag) {
								keyArr.push(key)
							}

							biaoqianListMy.forEach((item) => {
								keyArr.indexOf((item.tag_id).toString()) != -1 ? item.select = true : item.select = false
							})
						}
					}
					_this.setState({
						biaoqianListMy
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
	 * [获得全部列表]
	 */
	getBiaoqianListAll = () => {
		let _this = this
		this.setState({
			loading: true
		})
		Service.biaoqianListAll().then(resp => {
			_this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					let biaoqianListAll = resp.data.list
					// 标签名称
					if (Object.keys(Store.getInstance().index.tag).length > 0) {
						let tag = Store.getInstance().index.tag
						for (let key in tag) {
							biaoqianListAll.forEach((item) => {
								item.tag_id == key ? item.select = true : item.select = false
							})
						}
					}

					_this.setState({
						biaoqianListAll
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
	 * [选择热门标签]
	 */
	selectTag = (index, e) => {
		let list = [... this.state.biaoqianList]
		let select = !list[index].select
		list[index].select = select
		this.setState({
			biaoqianList: list
		})
	}
	/**
	 * [选择我的标签]
	 */
	selectTagMy = (index, e) => {
		let list = [... this.state.biaoqianListMy]
		let select = !list[index].select
		list[index].select = select
		this.setState({
			biaoqianListMy: list
		})
	}
	/**
	 * [选择联想标签]
	 */
	selectTagLian = (index, e) => {
		let list = [... this.state.lianXiangList]
		let biaoqianList = [... this.state.biaoqianList]
		list[index].select = true
		biaoqianList.push(list[index])
		this.setState({
			lianXiangList: [],
			biaoqianList
		})
		$('#searchTag').val()
		console.log('lianXiangList2',this.state.lianXiangList )
		console.log('biaoqianList',this.state.biaoqianList )
	}
	/**
	 * [搜索标签]
	 */
	searchTag = (e) => {
		let value = e.target.value
		let biaoqianListAll = [... this.state.biaoqianListAll]
		let lianXiangList = []
		biaoqianListAll.forEach((item) => {
			if (item.tag_name.indexOf(value) != -1 && value) {
				lianXiangList.push(item)
			}
		})
		this.setState({
			lianXiangList
		})
	}
	/**
	 * [输入框完成输入]
	 */
	inputKeyUp = (e) => {
		e.preventDefault()
		let _this = this
		let value = e.target.value
		let list = [... this.state.biaoqianListMy]
		if (e.keyCode === 13 && value) {
			console.log('value', value)
			let opt = {
				tag_name: value
			}
			Service.addTag(opt).then(resp => {
				_this.setState({
					loading: false
				})
				console.log('添加标签', resp)
				switch (resp.code) {
					case 0:
						let newTag = [{
							tag_name: value,
							tag_id: resp.data.tag_id,
							select: true
						}]
						list = list.concat(newTag)
						_this.setState({
							biaoqianListMy: list
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
	}
	/**
	 * [跳转页面]
	 */
	goto = (e) => {
		// 将选中的标签存入store
		Store.getInstance().index.tag = {}
		let biaoqianList = [...this.state.biaoqianList]
		let biaoqianListMy = [...this.state.biaoqianListMy]
		biaoqianList.forEach((item) => {
			if (item.select) {
				console.log(item)
				Store.getInstance().index.tag[item.tag_id] = item.tag_name
			}
		})
		biaoqianListMy.forEach((item) => {
			if (item.select) {
				Store.getInstance().index.tag[item.tag_id] = item.tag_name
			}
		})
		hashHistory.goBack()
	}
	render () {
		return (
			<div className='biaoqian-content'>
				<div className='top'>
					<input id='searchTag' type="text" placeholder='输入想要添加的标签' onKeyUp={this.inputKeyUp} onChange={this.searchTag.bind(this)}/>
				</div>
				<div className='mid'>
					{
						this.state.biaoqianList.length > 0 && this.state.lianXiangList.length === 0 ? 
						<div>
							<h4>热门标签</h4>
							<div className='list flex'>
								{
									this.state.biaoqianList.map((item, index) => {
										return (
											<div className={item.select ? 'list-item select' : 'list-item'} key={index} onClick={this.selectTag.bind(this, index)}>{item.tag_name}</div>
										)
									})
								}
							</div>
						</div> : ''
					}
					{
						this.state.biaoqianListMy.length > 0 && this.state.lianXiangList.length === 0 ? 
						<div>
							<h4>我的标签</h4>
							<div className='list flex'>
								{
									this.state.biaoqianListMy.map((item, index) => {
										return (
											<div className={item.select ? 'list-item select' : 'list-item'} key={index} onClick={this.selectTagMy.bind(this, index)}>{item.tag_name}</div>
										)
									})
								}
							</div>
						</div> : ''
					}
					{
						this.state.lianXiangList.length > 0 ? 
						
							<div className='lianxiang'>
								{
									this.state.lianXiangList.map((item, index) => {
										return (
											<div className='bottomline' key={index}>
												<div className='lianxiang-item' onClick={this.selectTagLian.bind(this, index)}>
													<span>#</span>{item.tag_name}
												</div>
											</div>
										)
									})
								}
							</div>
						
						 : ''
					}
				</div>

				{/*底部确定按钮*/}
				<div className='btn-ok' onClick={this.goto.bind(this)}>确定</div>
			</div>
		)
	}
}