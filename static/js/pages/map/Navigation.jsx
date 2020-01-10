import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import EXIF from 'exif-js';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from '../zuimei/service.js';
import Store from '../../store.js';
import Commonfn from '../../base/commonfn.js'
export default class Navigation extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			map: '',
			id: 0,
			province: '北京',
			dataList: [],
			loading: false,
		}
	}
	componentWillMount() {
		
	}
	componentDidMount() {
		this.initPage(this.props)
	}
	componentWillReceiveProps(newProps) {
		this.initPage(newProps)
	}
	/**
	 * [初始化页面参数]
	 */
	initPage = (props) => {
		let id = props.location.query.id
		let province = props.location.query.province
		this.state.id = id
		this.state.province = province
		this.getSonActivityList()
		document.title = province + '最美观景点111'
	}
	/**
	 * [获得子分组列表]
	 */
	getSonActivityList = () => {
		let aid = this.state.id
		console.log('aid', aid)
		let opt = {
			limit: 500,
			aid: this.state.id,
			page: 1,
		}
		this.setState({
			loading: true
		})
		Service.getSonActivityList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					
					this.init()
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
	
	init = () => {
		let map = new AMap.Map("mapContainer", {
                zoom: 16,
                center:["89.600000","28.916667"]
            })
		let marker = new AMap.Marker({
                map:map,
                position:["89.600000","28.916667"]
            })
		marker.setLabel({
                offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                content: "点击Marker获得高德导航"
            })
		marker.on('click',function(e){
                marker.markOnAMAP({
                    position:marker.getPosition()
                })
            })
		map.plugin(["AMap.ToolBar"], function(){
			let tool = new AMap.ToolBar()
			map.addControl(tool)
		})
	}
	
	render() {
		return ( 
			<div className='map-content'>
				<div 
					className='map-container' 
					id='mapContainer'></div>
				{
					this.state.loading ? <Loading></Loading> : ''
				}
			</div>
		)
	}
}