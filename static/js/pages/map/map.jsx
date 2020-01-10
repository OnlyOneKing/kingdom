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
export default class Map extends React.Component {
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
		console.log(window.location.href.split(".com/")[0] + '.com/')
		let id = props.location.query.id
		let province = props.location.query.province
		this.state.id = id
		this.state.province = province
		this.getSonActivityList()
		document.title = province + '最美观景点'
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
					let dataList = resp.data.list 
					if (dataList.length > 0) {
						dataList.forEach(item => {
							let center = []
							center.push(item.lng_int)
							center.push(item.lat_int)
							item.center = center
							if (item.focus) {
								item.focus = item.focus + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth
							}
						})
					}
					this.state.dataList = dataList
					this.addMarker()
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
	 * [添加marker标记]
	 */
	addMarker = () => {
		let imgSrc = 'img/lbs.svg';
		let _this = this
		let map = new AMap.Map('container', {
			resizeEnable: true,
			zoom: 4
		})
		this.state.map = map
		// 省份描边
		let district = null
		let polygons = [];
		let color = ['#ff9190', '#ff66ff', '#b2df8a', '#c9c1f2', '#80d8ff', '#33ff33']
		let random = 0 // 0-4的随机数 用于取色
		random = parseInt(4*Math.random())
		console.log('random', random)
		// 加载行政区划插件
		AMap.service('AMap.DistrictSearch', function () {
			if (!district) {
			//实例化DistrictSearch
			var opts = {
				subdistrict: 0, //获取边界不需要返回下级行政区
				extensions: 'all', //返回行政区边界坐标组等具体信息
				level: 'district' //查询行政级别为 市
			};
			district = new AMap.DistrictSearch(opts)
			district.setLevel('district')
			console.log('this.state.province111', _this.state.province)
			if(_this.state.province=='甘南'){
				map.remove(polygons) //清除上次结果
				return;
			}
			district.search(_this.state.province, function(status, result) {
				map.remove(polygons) //清除上次结果
				polygons = [];
				var bounds = result.districtList[0].boundaries;
				if (bounds) {
					for (var i = 0, l = bounds.length; i < l; i++) {
						//生成行政区划polygon strokeColor: '#0091ea' 描边颜色
						var polygon = new AMap.Polygon({
							strokeWeight: 1,
							path: bounds[i],
							fillOpacity: 0.4,
							fillColor: color[random],
							strokeColor: color[random]
						});
						polygons.push(polygon);
					}
				}
				map.add(polygons)
            	map.setFitView(polygons);//视口自适应
			})
		}
		})
		
		// 多个点实例组成的数组
		let markers = []
		
		let provinces = this.state.dataList
		
		for (let i = 0; i < provinces.length; i += 1) {
			let marker;
			let title = provinces[i].title
			let content = []
			// content.push("<img src='http://tpc.googlesyndication.com/simgad/5843493769827749134'>");
			// content.push();
			content.push('<a href=' + window.location.href.split(".com/")[0] + '.com/#/zuimeinoson?id=' + provinces[i].id + '>' + '<img src=' + provinces[i].focus + '>' + '</a>');
			let infoWindow = new AMap.InfoWindow({
				isCustom: true, //使用自定义窗体
				content: _this.createInfoWindow(title, content.join("<br/>"), map),
				offset: new AMap.Pixel(16, -45)
			});




			marker = new AMap.Marker({
				position: provinces[i].center,
				icon: new AMap.Icon({
				    //图标大小
				    size:new AMap.Size(18,26.66),
				    //大图地址
				    image:imgSrc,
				    imageOffset:new AMap.Pixel(0,0)
				}),
				offset: new AMap.Pixel(-9,-26.66),
    			title: title,
    			map: map
			})
			//鼠标点击marker弹出自定义的信息窗体
			AMap.event.addListener(marker, 'click', function() {
				_this.closeInfoWindow()
				infoWindow.open(map, marker.getPosition())
			})
			markers.push(marker)
		}
		// 将创建的点标记添加到已有的地图实例
		 map.setFitView();
	}
	/**
	 * [构建自定义信息窗体]
	 */
	createInfoWindow = (title, content, map) => {
		var info = document.createElement("div");
		info.className = "custom-info input-card content-window-card";

		//可以通过下面的方式修改自定义窗体的宽高
		//info.style.width = "400px";
		// 定义顶部标题
		var top = document.createElement("div");
		var titleD = document.createElement("div");
		var closeX = document.createElement("img");
		top.className = "info-top";
		titleD.innerHTML = title;
		closeX.src = "https://webapi.amap.com/images/close2.gif";
		closeX.onclick = this.closeInfoWindow;

		top.appendChild(titleD);
		top.appendChild(closeX);
		info.appendChild(top);

		// 定义中部内容
		var middle = document.createElement("div");
		middle.className = "info-middle";
		middle.style.backgroundColor = 'white';
		middle.innerHTML = content;
		info.appendChild(middle);

		// 定义底部内容
		var bottom = document.createElement("div");
		bottom.className = "info-bottom";
		bottom.style.position = 'relative';
		bottom.style.top = '0px';
		bottom.style.margin = '0 auto';
		var sharp = document.createElement("img");
		// sharp.src = "https://webapi.amap.com/images/sharp.png"
		bottom.appendChild(sharp);
		info.appendChild(bottom);
		return info;
	}
	/**
	 * [关闭信息窗体]
	 */
	closeInfoWindow = () => {
		this.state.map.clearInfoWindow()
	}
	render() {
		return ( 
			<div className='map-content'>
				<div 
					className='map-container' 
					id='container'></div>
				{
					this.state.loading ? <Loading></Loading> : ''
				}
			</div>
		)
	}
}