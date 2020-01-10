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
import Picker from '../../../../../../common/utils/react-mobile-picker';
import Commonfn from '../../base/commonfn.js';
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js';
import Tips from '../../../../../../common/utils/Tips.jsx';
const fast_nav = ['#','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
export default class Address extends React.Component {
	constructor (props) {
		super(props)
		this.mapMove = false;
		this.waitor = undefined;
		this.iswait = 500;
		this.markers = [];
		this.index = deepCopy(Store.getInstance().index);
		this.touchStartY = 0;
		this.state = {
			editEnable:this.props.location.query.lat||this.props.location.query.lng?0:1,
			currentNav:1,
			startNav:1,
			fast_nav:'',
			tips:'',
			markerSrc:'img/mark.png',
			keymode:0,
			// lat:Store.getInstance().index.lat?Store.getInstance().index.lat:39.90923,
			// lng:Store.getInstance().index.lng?Store.getInstance().index.lng:116.397428,
			searchPois:[],
			// adcode:130000,
			region: [
				[{
				"code": "130000",
				"name": "beijing1",
				"upid": "0"
				},
				{
				"code": "130000",
				"name": "beijing2",
				"upid": "0"
				},
				{
				"code": "130000",
				"name": "beijing3",
				"upid": "0"
				}],
			],
			place:'',
            isPickerOpen: false,
            address_mode:Store.getInstance().index['country_code']?0:1,
            
            picker_ary:[[]],
            countrys:[],
            countrys_power:[],
            provinces:[],
			citys:[],
			districts:[],
			pid:1, //0 为选择国家
			country_code:0,
			province_code:0,
			city_code:0,
			district_code:0,
			regionMode:'',
			regionMode_name:'',
			country:Store.getInstance().index['country_code']?{
				area: Store.getInstance().index['country'].toString(),
				id: Store.getInstance().index['country_code'].toString(),
				pid: 0,
				pinyin: "",
				code: Store.getInstance().index['country_code'].toString(),
				name: Store.getInstance().index['country'].toString(),
				upid:0
			}:'',
			province:Store.getInstance().index['province_code']?{
				area: Store.getInstance().index['province'].toString(),
				id: Store.getInstance().index['province_code'].toString(),
				pid: 0,
				pinyin: "",
				code: Store.getInstance().index['province_code'].toString(),
				name: Store.getInstance().index['province'].toString(),
				upid:0
			}:'',
			city:Store.getInstance().index['city_code']?{
				area: Store.getInstance().index['city'].toString(),
				id: Store.getInstance().index['city_code'].toString(),
				pid: 0,
				pinyin: "",
				code: Store.getInstance().index['city_code'].toString(),
				name: Store.getInstance().index['city'].toString(),
				upid:0
			}:'',
			district:Store.getInstance().index['district_code']?{
				area: Store.getInstance().index['district'].toString(),
				id: Store.getInstance().index['district_code'].toString(),
				pid: 0,
				pinyin: "",
				code: Store.getInstance().index['district_code'].toString(),
				name: Store.getInstance().index['district'].toString(),
				upid:0
			}:'',

		}

		console.log('Store.getInstance().index111',Store.getInstance().index);
	}
	componentWillMount () {
		document.title = this.props.location.query.lat||this.props.location.query.lng?'拍摄位置':'选择地址';
		for(let i in fast_nav){
			this.state.countrys_power.push({name:fast_nav[i],ary:[]})
		}
		
	}
	componentDidUpdate () {
		let that = this;
		// setTimeout(function(){
		// 	that.setState({
		// 		isPickerOpen:true
		// 	});
		// },1500);
	}
	componentDidMount () {
		document.querySelector('body').addEventListener('touchmove', function(e) {
		    if (!document.querySelector('.touchMoveItem').contains(e.target)) {
		        e.preventDefault();
		    }
		})
		this.state.editEnable = this.props.location.query.lat||this.props.location.query.lng?0:1;
		if(!this.state.editEnable){
			this.index.lat = this.props.location.query.lat;
			this.index.lng = this.props.location.query.lng;
		}
		this.getRegion(0,'countrys',()=>{});
		let listener=this; 
		listener.mapMove = false;
		this.map = new AMap.Map('amap_container', {
			isHotspot:true,
			resizeEnable: true,
			zoom:9,//listener.index.lat?16:13,
			center: [this.index.lng?this.index.lng:116.397428, this.index.lat?this.index.lat:39.90923]        
		});
		Store.getInstance().map = this.map;
		this.map.on('hotspotclick', function(result) {
        	var position = new AMap.LngLat(result.lnglat.lng, result.lnglat.lat);  // 标准写法
			// 简写 var position = [116, 39]; 
			listener.map.setCenter(position); 
			console.log(result);
			listener.searchBySn(result.id);
			listener.index.lng = result.lnglat.lng;
			listener.index.lat = result.lnglat.lat;
			listener.index.country = '中国';
		    
		});
		AMap.event.addListener(listener.map,'dragstart',function(e){
			listener.mapMove = true;
			listener.iswait=4;
		});
		AMap.event.addListener(listener.map,'dragend',function(e){
			console.log("map moved end");
			if(listener.waitor==undefined){
				listener.waitor=setInterval(function(){
					// listener.setState({loading:true});
					listener.iswait--;
					if(listener.iswait<=0){
						clearInterval(listener.waitor);
						listener.iswait = 500;
						listener.waitor=undefined;
						console.log("end");	
						//,listener.map.getCenter().lat
					}	
				},250);
				listener.nidili();
				listener.setState({
					keymode:false
				});
			}	
			listener.mapMove = false;	
		});

		AMap.event.addListener(listener.map,'complete',function(e){
			if(!listener.state.editEnable){
				let marker = new AMap.Marker({	            
		            offset: new AMap.Pixel(-10.5,-33),
		            position: [listener.index.lng, listener.index.lat],
		            icon: new AMap.Icon({            
			            image: listener.state.markerSrc,
			            size: new AMap.Size(42, 66),  //图标大小		            
			            imageSize:new AMap.Size(21,33)
			        })   
		        });
		        marker.setMap(listener.map);
		        setTimeout(function(){
		        	listener.nidili();
		        },200)
		        // listener.map.setFitView();
			}else{
				// listener.map.setFitView();
		        listener.map.plugin('AMap.Geolocation', function () {
					let geolocation = new AMap.Geolocation({
						enableHighAccuracy: true,//是否使用高精度定位，默认:true
						timeout: 10000,          //超过10秒后停止定位，默认：无穷大
						maximumAge: 0,           //定位结果缓存0毫秒，默认：0
						convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
						showButton: true,        //显示定位按钮，默认：true
						buttonPosition: 'RB',    //定位按钮停靠位置，默认：'LB'，左下角
						buttonOffset: new AMap.Pixel(10, 80),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
						showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
						showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
						panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
						zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
					});				
					listener.map.addControl(geolocation);
					if(!listener.index.lat){
						geolocation.getCurrentPosition();
					}else{
						listener.nidili();
					}
					AMap.event.addListener(geolocation, 'complete', listener.onGeolocationComplete);//返回定位信息
					AMap.event.addListener(geolocation, 'error', listener.onGeolocationError);      //返回定位出错信息
				});
			}	        
		});


		$("#search_text").on('keypress',function(e) {  
                var keycode = e.keyCode;  
                var searchName = $(this).val();  
                if(keycode=='13') {  
                    e.preventDefault();    
                    //请求搜索接口  
					listener.searchByKey(listener.state.place);
					$('#search_text').blur();
                }  
         })
	}
	componentWillReceiveProps (newProps) {

	}
	componentWillUnmount () {
		
	}
	nidili=()=>{
		let listener = this;
		listener.index.lng = listener.map.getCenter().lng;
		listener.index.lat = listener.map.getCenter().lat;
        
		listener.map.plugin('AMap.Geocoder', function() {
			var geocoder = new AMap.Geocoder({
				// city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
				city: ''
			})

			var lnglat = [listener.map.getCenter().lng, listener.map.getCenter().lat]

			geocoder.getAddress(lnglat, function(status, result) {
				console.log("nidili result",result);
				if (status === 'complete' && result.info === 'OK') {
					listener.index.country = '中国';
				    listener.index.address= result.regeocode.formattedAddress; // 地点
	                listener.index.province= result.regeocode.addressComponent.province; // 省
	                listener.index.city= result.regeocode.addressComponent.city; // 市
	                listener.index.district= result.regeocode.addressComponent.district; //县（区）
	                let reg = new RegExp(listener.index.province+listener.index.city+listener.index.district)
	                listener.index.address = listener.index.address.replace(reg,'');
				}else{
					listener.index.country = '';
				    listener.index.address= ''; // 地点
	                listener.index.province= ''; // 省
	                listener.index.city= ''; // 市
	                listener.index.district= ''; //县（区）
	                listener.showTips('境外地区，请在非地图模式下选取');
	                listener.setState({
	                	address_mode:0
	                });
				}
			})
		})
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
	getRegion=(pid,mode,fun)=>{
		Service.getRegion({pid:pid}).then(resp=>{
			switch(resp.code){
				case 0:
					if(resp.data instanceof Array){
						// let item = '';
						let modeItemName = mode.substring(0,mode.length-1);
						for(let i in resp.data){
							resp.data[i]["code"] = resp.data[i].id.toString();
							resp.data[i]["name"] = resp.data[i].area;
							resp.data[i]["upid"] = resp.data[i].pid.toString();
							if(resp.data[i].pinyin){
								for(let ii in this.state.countrys_power){
									if(this.state.countrys_power[ii].name==resp.data[i].pinyin){
										this.state.countrys_power[ii].ary.push(resp.data[i]);
									}
								}
							}
							if(resp.data[i].area=='中国'){
								this.state.countrys_power[0].ary.push(deepCopy(resp.data[i]));
							}
							// if(resp.data[i].pinyin && i>0 && resp.data[i].pinyin==resp.data[i-1].pinyin){
							// 	resp.data[i].pinyin='';
							// }
							// if(this.index[modeItemName+'_code']&&resp.data[i]["code"].toString()==this.index[modeItemName+'_code'].toString()){
							// 	item = resp.data[i];
							// }
						}
						// this.state[modeItemName] = item;
						this.state[mode] = resp.data;
						this.setState(this.state);
						console.log("this.state.countrys_power",this.state.countrys_power);
						fun();
					}else{
						this.state[mode] = [];
						this.setState(this.state);
						fun();
					}
						
				break;
				case 111:
					Commonfn.aotoLogin()
					break;
				default:
					alert(resp.msg);
				break;
			}
		})
	}

	searchByKey(s = '') {
		let listener = this;
		// this.setState({
		// 	keymode:true
		// });
		listener.map.setFitView();
		AMap.service(["AMap.PlaceSearch"], function() {
			var MSearch = new AMap.PlaceSearch({ //¹¹ÔìµØµã²éÑ¯Àà
			  //汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|
			  // 医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|
			  // 交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施


			  type: s != '' ? '' : '交通设施服务|体育休闲服务|公共设施|科教文化服务|通行设施|风景名胜|餐饮服务',
			  extensions: 'all',
			  pageSize: 50,
			  pageIndex: 1
			});
			console.log("key search");
			MSearch.setCity('');
			MSearch.search(s, function(status, result) {
				console.log(status);
				console.log(result);
				console.log("result.poiList.pois",result.poiList.pois);
				listener.state.searchPois = result.poiList.pois;
				listener.setState({
					keymode:true,
					searchPois:result.poiList.pois
				});
				
			});

		})
    }
    searchBySn(sn = '') {
		let listener = this;
		AMap.service(["AMap.PlaceSearch"], function() {
			var MSearch = new AMap.PlaceSearch({ //¹¹ÔìµØµã²éÑ¯Àà
			  //汽车服务|汽车销售|汽车维修|摩托车服务|餐饮服务|购物服务|生活服务|体育休闲服务|
			  // 医疗保健服务|住宿服务|风景名胜|商务住宅|政府机构及社会团体|科教文化服务|
			  // 交通设施服务|金融保险服务|公司企业|道路附属设施|地名地址信息|公共设施
			  type: '交通设施服务|体育休闲服务|公共设施|科教文化服务|通行设施|风景名胜|餐饮服务',
			  extensions: 'all',
			  pageSize: 50,
			  pageIndex: 1
			});
			MSearch.setCity('');
			MSearch.getDetails(sn, function(status, result) {
				console.log('1',status);
				console.log('2',result);
				if (result.info === 'OK') {
					let item = result.poiList.pois[0];
					console.log("item",item);
					listener.index.country = '中国';
				    listener.index.address= item.name; // 地点
	                listener.index.province= item.pname; // 省
	                listener.index.city= item.cityname; // 市
	                listener.index.district= item.adname; //县（区）
				}
			});

		})
    }
	onGeolocationComplete(data,result){
		console.log("定位结束：",data);
		if (data!='error') {
			if(data=="complete"){
				this.nidili();
				// StoreInvite.getInstance().searchProvince = result.addressComponent.province;
				// StoreInvite.getInstance().lng = result.position.getLng();
				// StoreInvite.getInstance().lat = result.position.getLat();
			}else{
				// StoreInvite.getInstance().searchProvince = data.addressComponent.province;
				// StoreInvite.getInstance().lng = data.position.getLng();
				// StoreInvite.getInstance().lat = data.position.getLat();
			}
		}
	}
	onGeolocationError(data){
		// alert(JSON.stringify(data));
	}
	inputChange = (params,obj)=>{
		this.state[params] = obj.target.value;
		this.setState(this.state);
	}
	_pickerChange = (type)=>{

        this.setState({isPickerOpen:!this.state.isPickerOpen});
    }
    _pickerConfirm = (value)=>{
        this.setState({isPickerOpen:false});
        
    }
    _hidePicker = ()=>{
        this.setState({isPickerOpen:false});
    }
	toggleAddmode=()=>{
		this.setState({
			address_mode:this.state.address_mode?0:1
		});
	}
    inputOver=()=>{
    	
    }
    selectArea=(item)=>{
    	let listener = this;
		listener.index.country='中国';
    	listener.index.address= item.address; // 地点
        listener.index.province= item.pname; // 省
        listener.index.city= item.cityname; // 市
        listener.index.district= item.adname; //县（区）
        listener.index.lat = item.location.lat;
        listener.index.lng = item.location.lng;
		var position = new AMap.LngLat(item.location.lng, item.location.lat);  // 标准写法
		// 简写 var position = [116, 39]; 
		this.map.setCenter(position); 
    }
    confirm=()=>{
		Store.getInstance().index = deepCopy(this.index)
		console.log('code1', Store.getInstance().index)
		let allAddress = Commonfn.getAddress({...Store.getInstance().index})
		Store.getInstance().index.allAddress = allAddress
		hashHistory.goBack(-1);
    }
    convertRegion=(mode)=>{
		switch(mode){
			case 'countrys':
				return '"国家"'
			break;
			case 'provinces':
				return '"省"'
			break;
			case 'citys':
				return '"市"'
			break;
			case 'districts':
				return '"县"'
			break;
		}
    }
    showPicker=(mode)=>{
    	console.log(this.state[mode].length,this.state[mode]);
    	if(this.state[mode].length==0){
    		switch(mode){
				case 'countrys':
					
				break;
				case 'provinces':
					this.showTips(this.index.country=='中国'?'请先选择国家':'无法选择');
					return;
				break;
				case 'citys':
					this.showTips(this.index.country=='中国'?'请先选择省':'无法选择');
					return;
				break;
				case 'districts':
					this.showTips(this.index.country=='中国'?'请先选择市':'无法选择');
					return;
				break;
			}
    	}
		let that = this;
		this.state.picker_ary = [];
		this.state.picker_ary.push(this.state[mode]);
		
		this.setState({
			regionMode_name:this.convertRegion(mode),
			regionMode:mode,
			isPickerOpen:true,
			picker_ary:this.state.picker_ary
		});
	}
	selectRegion=(item)=>{
    	console.log(item);
		this.state[this.state.regionMode.substring(0, this.state.regionMode.length-1)] = item;
		this.setState(this.state);
		let that = this;
		switch(this.state.regionMode){
			case 'countrys':
				this.index.country_code=item.id;
				this.index.country=item.name;
		    	this.index.address= ''; // 地点
		        this.index.province= ''; // 省
		        this.index.city= ''; // 市
		        this.index.district= ''; //县（区）
		        this.index.lat = '';
		        this.index.lng = '';
				this.getRegion(item.id,'provinces',()=>{
					that.setState({
						citys:[],
						districts:[],
						province:'',
						city:'',
						district:''
					});
				});
			break;
			case 'provinces':
				this.index.province_code=item.id;
		    	this.index.address= ''; // 地点
		        this.index.province= item.name; // 省
		        this.index.city= ''; // 市
		        this.index.district= ''; //县（区）
		        this.index.lat = '';
		        this.index.lng = '';
				this.getRegion(item.id,'citys',()=>{
					that.setState({
						districts:[],
						city:'',
						district:''
					});
				});
			break;
			case 'citys':
				this.index.city_code=item.id;
				this.index.address= ''; // 地点
		        this.index.city= item.name; // 市
		        this.index.district= ''; //县（区）
		        this.index.lat = '';
		        this.index.lng = '';
				this.getRegion(item.id,'districts',()=>{
					that.setState({
						district:''
					});
				});
			break;
			case 'districts':
				this.index.district_code=item.id;
				this.index.address= ''; // 地点
		        this.index.district= item.name; //县（区）
		        this.index.lat = '';
		        this.index.lng = '';
			break;
		}
    }
    convertMode=(item)=>{
    }
    scrollToPos=()=>{
    	let top = 0;
    	for(let i in this.state.countrys_power){
    		top += 29*(this.state.countrys_power[i].ary.length+1);
    		if(this.state.countrys_power[i].name==fast_nav[this.state.currentNav]){
				top -= 29*(this.state.countrys_power[i].ary.length+1);
				break;
    		}
    	}
		$('.area-items').animate({scrollTop:top+'px'},0);
    }
    fastMove=(item,c)=>{
    	let offsetY = this.touchStartY - c.touches[0].clientY;
    	let unitHeight = $(".area-select-box").height()/fast_nav.length;
		this.state.currentNav = parseInt(this.state.startNav)-parseInt(offsetY/unitHeight);
		if(this.state.currentNav<1){
			this.state.currentNav = 1;
		}else if(this.state.currentNav>=fast_nav.length){
			this.state.currentNav = fast_nav.length-1;
		}
    	this.setState({
    		currentNav:this.state.currentNav,
    		fast_nav:item
    	});
    	this.scrollToPos();
    }
    fastStart=(item,c)=>{
    	for(let i in fast_nav){
			if(fast_nav[i]==item){
				this.state.startNav = i?i:1;
				break;
			}
    	}
    	this.touchStartY = c.touches[0].clientY;
    	this.setState({
    		currentNav:this.state.startNav,
    		startNav:this.state.startNav,
    		fast_nav:item
    	});
    	this.scrollToPos();
    }
	render () {
		return (
			<div className='address-content'>
				<div className="area-picker-box flex flex-ver-center flex-space-between" style={{
					opacity:this.state.address_mode?0:1,
					position:this.state.address_mode?'absolute':'relative',top:this.state.address_mode?'-200px':'0px'
				}}>
					<div className="area-picker-item flex flex-ver-center flex-space-between" onClick={this.showPicker.bind(this,'countrys')}>
						<div>{this.state.country&&this.state.country.name?this.state.country.name:'国家'}</div>
						<img src="img/arrow_down_more.svg" alt="" className="arrow_down"/>
					</div>
					<div className="area-picker-item flex flex-ver-center flex-space-between" onClick={this.showPicker.bind(this,'provinces')} style={{
						opacity:this.state.provinces.length?1:0.6
					}}>
						<div>{this.state.province&&this.state.province.name?this.state.province.name:'省'}</div>
						<img src="img/arrow_down_more.svg" alt="" className="arrow_down"/>
					</div>
					<div className="area-picker-item flex flex-ver-center flex-space-between" onClick={this.showPicker.bind(this,'citys')} style={{
						opacity:this.state.citys.length?1:0.6
					}}>
						<div>{this.state.city&&this.state.city.name?this.state.city.name:'市'}</div>
						<img src="img/arrow_down_more.svg" alt="" className="arrow_down"/>
					</div>
					<div className="area-picker-item flex flex-ver-center flex-space-between" onClick={this.showPicker.bind(this,'districts')} style={{
						opacity:this.state.districts.length?1:0.6
					}}>
						<div>{this.state.district&&this.state.district.name?this.state.district.name:'县'}</div>
						<img src="img/arrow_down_more.svg" alt="" className="arrow_down"/>
					</div>
				</div>
				{
					this.state.editEnable?
					<div className="address-mode flex flex-ver-center flex-row-reverse" onClick={this.toggleAddmode.bind(this)}>
						<div>在地图上标注精确位置</div>
						<div>
							{
								this.state.address_mode?
								<img src="img/selected.png" alt=""/>:
								<img src="img/select.png" alt=""/>
							}
						</div>
						
					</div>:<div style={{display:'none'}}/>
				}
					
				<div id="amap_container" style={{top:this.state.editEnable?'50px':'0px',bottom:this.state.keymode?'300px':'0px',display:this.state.address_mode?'block':'none'}}></div>
				{
					this.state.editEnable?
					<div className="area-search-box flex flex-ver-center flex-space-between" style={{top:this.state.address_mode?'60px':'-200px'}}>
						<input id="search_text" className="flex flex-ver-center" type="search" placeholder="输入地点名称搜索" value={this.state.place} onChange={this.inputChange.bind(this,'place')} onBlur={this.inputOver.bind(this)}/>
						<img src="img/search_btn.png" alt=""/>
					</div>:<div style={{display:'none'}}/>
				}
				
				{
					this.state.address_mode&&this.state.editEnable?
					<img className="mark-icon" src="img/mark.svg" alt="" style={{marginTop:!this.state.keymode?'-10px':'-154px'}}/>
					:<div style={{display:'none'}}/>

				}
				
				{
					!this.state.keymode&&this.state.editEnable?
					<div className="btn-ok" onClick={this.confirm.bind(this)}>确定</div>:<div style={{display:'none'}}/>
				}
				{
					!this.state.keymode&&this.state.address_mode&&this.state.editEnable?
					<div className="addr-bottom-tips">拖动地图获取精确位置</div>:<div style={{display:'none'}}/>
				}
				{
					this.state.keymode&&this.state.address_mode?
					<div className="area-select-box"> 
						<div className="area-select-tips">
							<div>点击选择位置</div>
							<div className="area-select-confirm" onClick={this.confirm.bind(this)}>确定</div>
						</div>
						<div className="area-items touchMoveItem">
						{
							this.state.searchPois.map((item,index)=>{
								return (
									<div key={index} className="area-item flex flex-ver-center flex-space-between" onClick={this.selectArea.bind(this,item)}>
										<div className="">
											<div className="area-name">{item.name}</div>
											<div className="area-addr">{item.pname+(item.pname==item.cityname?'':item.cityname)+item.adname}</div>
										</div>
										<div></div>
									</div>
								)
							})
						}
						</div>
						
					</div>:<div style={{display:'none'}}/>
				}	
				<div className="area-select-box" style={{top:'110px',height:'unset',bottom:'58px',display:!this.state.address_mode&&this.state.isPickerOpen?'block':'none'}}>
					<div className="area-select-tips">
						<div>{'点击选择'+this.state.regionMode_name}</div>
					</div>
					<div className="area-items touchMoveItem">
					{
						this.state.regionMode=="countrys"?
						this.state.countrys_power.map((item,index)=>{
							return (
								<div id={'id_'+item.name} key={index} >
									<div className="area-item flex flex-ver-center flex-space-between">
										<div className="">
											<div className="area-name">{item.name}</div>
											<div className="area-addr"></div>
										</div>
										<div></div>
									</div>
									{
										item.ary.map((subitem,subindex)=>{
											return(
												<div key={subindex} className="area-item flex flex-ver-center flex-space-between"
													style={{border:subitem.id==this.state[this.state.regionMode.substring(0, this.state.regionMode.length-1)].id?'1px solid rgb(255, 144, 30)':'none'}}
													onClick={this.selectRegion.bind(this,subitem)}>
													<div className="">
														<div className="area-name">{subitem.name}</div>
														<div className="area-addr"></div>
													</div>
													<div></div>
												</div>
											)
												
										})
									}
								</div>
									
							)
						}):
						this.state.picker_ary[0].map((item,index)=>{
							return (
								<div key={index} className="area-item flex flex-ver-center flex-space-between"
									
									style={{border:item.id==this.state[this.state.regionMode.substring(0, this.state.regionMode.length-1)].id?'1px solid rgb(255, 144, 30)':'none'}}
									onClick={this.selectRegion.bind(this,item)}>
									<div className="">
										<div className="area-name">{item.name}</div>
										<div className="area-addr"></div>
									</div>
									<div></div>
								</div>
							)
						})
					}
					</div>
					{
						this.state.regionMode=="countrys"?
						<div className="fast-nav-bar flex-column flex-ver-center flex-space-around" >
							{
								fast_nav.map((item,index)=>{
									return <div className="touchMoveItem" key={index} style={{padding:'0 6px',backgroundColor:this.state.currentNav==index?'rgba(0,0,0,0.3)':'rgba(0,0,0,0)'}} onTouchStart={this.fastStart.bind(this,item)} onTouchMove={this.fastMove.bind(this,item)}>{item}</div>
								})
							}
						</div>:<div style={{display:'none'}}/>
					}
				</div>
				<Tips words={this.state.tips}></Tips>
				{/*<Picker
                    startIndex = {this.state.pid?this.state.pid:1}
                    dataArr = {this.state.picker_ary}
                    value={''}
                    values={[]}
                    theme={"ios"}
                    isOpen={this.state.isPickerOpen}
                    onSelect={this._pickerConfirm}
                    onCancel={this._hidePicker}
                ></Picker>*/}
			</div>
		)
	}
}