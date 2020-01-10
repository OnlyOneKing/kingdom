import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import { Swiper, Slide } from 'react-dynamic-swiper';
import 'react-dynamic-swiper/lib/styles.css';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './service.js';
import Store from '../../store.js';
import Commonfn from '../../base/commonfn.js'
export default class Fengmian extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			picData: Store.getInstance().index.picData ? Store.getInstance().index.picData : []
		}
	}
	componentWillMount () {
		document.title = '选择封面'
		if (this.state.picData.length == 0) {
			hashHistory.goBack(-1)
		}
	}
	componentDidUpdate () {
		
	}
	componentDidMount () {
		let picData = [...this.state.picData]
		console.log('picData', picData)
		picData.forEach((item, i) => {
			if (item.focus == 1) {
				item.select = true
			} else {
				item.select = false
			}
		})
		this.setState({
			picData
		})
	}
	componentWillReceiveProps (newProps) {

	}
	componentWillUnmount () {
		
	}
	/**
	 * [选择图片]
	 */
	selectImg = (index, e) => {
		let picData = [...this.state.picData]
		picData.forEach((item, i) => {
			if (index != i) {
				item.select = false
			}
		})
		let select = picData[index].select 
		picData[index].select = !select
		this.setState({
			picData
		})
	}
	/**
	 * [选择封面]
	 */
	ok = () => {
		let picData = [...this.state.picData]
		let haveSelect = false
		picData.forEach((item) => {
			if (item.select) {
				Store.getInstance().index.fengImg = item.pic_url
				item.focus = 1
				haveSelect = true
			} else {
				item.focus = 0
			}
		})
		if (!haveSelect) {
			Store.getInstance().index.fengImg = ''
		}
		Store.getInstance().index.picData = picData
		hashHistory.goBack(-1)
	}
	
	render () {
		return (
			<div className='fengmian-content'>
				<div className='tips'>提示：勾选图片作为封面图</div>
				<div className='lists'>
					{
						this.state.picData.length > 0 ?
						this.state.picData.map((item, index) => {
							return (
								<div key={index} className='list-item flex flex-space-between' onClick={this.selectImg.bind(this, index)}>
									<div className='item-left flex flex-ver-center'>
										<div className='img' style={{backgroundImage:'url('+item.pic_url+')'}}></div>
									</div>
									<div className='item-right flex flex-ver-center'>
										{
											item.select ? <img src="img/icon-select.png"/> : <img src="img/icon-noselect.png"/>
										}
									</div>
								</div>
							)
						}) : <div></div>
					}
				</div>
				{/*底部操作*/}
				<div className='bottom flex'>
					<div className='back' onClick={()=>{hashHistory.goBack(-1)}}>返回</div>
					<div className='ok' onClick={this.ok}>完成</div>
				</div>
			</div>
		)
	}
}