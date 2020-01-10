import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import 'react-dynamic-swiper/lib/styles.css';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './service.js';
import Store from '../../store.js';
import Commonfn from '../../base/commonfn.js'
import Picker from '../../../../../../common/utils/react-mobile-picker';
import DatePicker from '../../../../../../common/utils/react-mobile-datepicker';
import {convertDate} from '../../../../../../common/utils/simpleUtil.js';
import Tips from '../../../../../../common/utils/Tips.jsx';
const UserInfo  = function(){
	return {
		"is_join":0,
		"realname":'',
		"id_number":'',
		"age":'',
		"tel":'',
		"gender":1,
		"profession":'',
		"hometown":'',
		"income":'',
		"education":'',
		"camera":'',
		"wechat":'',
		"qq":'',
		"birthday":Date.parse(new Date())/1000,
		"address":'',
		"custom1":'',
		"custom2":'',
		"custom3":'',
		"custom4":''
	}
}
const SEX = [
	[
	// {
	// 	"code": "1",
	// 	"name": "保密",
	// 	"upid": "0"
	// }, 
	{
		"code": "2",
		"name": "男",
		"upid": "0"
	}, {
		"code": "3",
		"name": "女",
		"upid": "0"
	}]
];
export default class Info extends React.Component {
	constructor (props) {
		super(props)
		this.maxValue = Date.parse(new Date())/1000;
        this.minValue = Date.parse(new Date(1900, 0, 1))/1000;
		this.state = {
			tid:'',
			tips:'',
			pickerType:'',
            isPickerOpen:false,
			aid: this.props.location.query.aid, // 活动id
			userInfo:new UserInfo(),
			info: [], // 自定义信息列表
		}
		this.load = 0;
	}
	componentWillMount () {
		document.title = '完善信息'
	}
	componentDidUpdate () {
		
	}
	componentDidMount () {
		this.loadData(this.props)
	}
	componentWillReceiveProps (newProps) {
		this.loadData(newProps)
	}
	componentWillUnmount () {
		
	}
	setLoading=(b)=>{
		this.setState({
			loading:b
		});
	}
	/**
	 * [加载页面数据]
	 */
	loadData = (props) => {
		this.load = 0;
		this.state.tid = props.location.query.tid?props.location.query.tid:props.location.query.aid;
		this.state.aid = props.location.query.aid;
		this.state.aname = props.location.query.aname;
		this.setState({
			aname:this.state.aname,
			aid:this.state.aid
		})

		this.getField();
		this.getFieldUserInfo();
	}
	/**
	 * [获得图片数据列表]
	 */
	getField = () => {
		let _this = this
		let opt = {
			aid: this.state.tid
		}
		Service.getField(opt).then((resp) => {
			switch (resp.code) {
				case 0:
					let info = $.parseJSON((resp.data.field?resp.data.field:'{"data":[]}')).data;
					if(info.length==0){
						Store.getInstance().index.aid = this.state.aid;
						Store.getInstance().index.aname = this.state.aname;
						hashHistory.replace('uploadpic')
						return;
					}
					for(let i=0;i<info.length;i++){
						info[i]['dom'] = info[i].value;
						if(info[i]['dom']!='birthday' && info[i]['dom']!='gender'){
							info[i]['dom'] = 'input';
						}
					}
					this.state.info = info;
					this.setState({
						info
					})
					this.load++;
					this.rebuildInfo();
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
	getFieldUserInfo =() =>{
		let opt = {aid:this.state.tid};
		Service.getFieldUserInfo(opt).then(resp=>{
			switch (resp.code) {
				case 0:
					this.load++;
					this.state.userInfo = resp.data;
					if(!parseInt(this.state.userInfo.gender))this.state.userInfo.gender=1;
					this.rebuildInfo();
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
	rebuildInfo=()=>{
		if(this.load>=2){
			for(let i in this.state.userInfo){
				for(let j in this.state.info){
					if(this.state.info[j].value==i){
						this.state.info[j].submit = this.state.userInfo[i];
						this.state.info[j].format = 0;
						if(i=='birthday'&&!this.state.info[j].submit){
							this.state.info[j].submit = Date.parse(new Date())/1000;
							this.state.userInfo[i] = Date.parse(new Date())/1000;
						}
					}
				}
			}
		}
		this.setState({
			info:this.state.info
		});
		for(let i in this.state.info){
			if(this.state.info[i].submit)this.checkFormat(i,this.state.info[i].value);
		}
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
	 * [输入信息]
	 */
	inputChange = (params,obj) => {
		let value = obj.target.value;
		if(params=='id_number'){
			value = value.replace(/[^0-9Xx]/ig,'')
		}else if(params=='tel'){
			value = value.replace(/[^0-9\-,+]/ig,'')
		}	
		this.state.userInfo[params] = value;
		for(let i=0;i<this.state.info.length;i++){
			if(this.state.info[i].value == params){
				this.state.info[i].submit = value;
				if(this.state.info[i].format){
					this.checkFormat(i,this.state.info[i].value);
				}
				break;
			}
		}
		this.setState(this.state);
	}
	checkFormat = (index,params)=>{
		let format = 0;
		if(params=='id_number'){
			let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			console.log(this.state.info[index]['submit'],reg.test(this.state.info[index]['submit']));
			if(reg.test(this.state.info[index]['submit']) === false){
				format = 1;
			}
		}else if(params == 'tel'){
			let reg = /^1[3456789]\d{9}$/;
			if(reg.test(this.state.info[index]['submit']) === false){
				format = 1;
			}
		}else if(params =='email'){
			let reg = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
			if(reg.test(this.state.info[index]['submit']) === false){
				format = 1;
			} 
		}

		this.state.info[index]['format'] = format;
		this.setState({
			info:this.state.info
		});
	}
	_pickerChange = (type)=>{
		$('.info-content').css('position',this.state.isPickerOpen?'relative':'fixed');
        this.setState({pickerType:type,isPickerOpen:!this.state.isPickerOpen});
    }
	_renderPicker(){
		// new Date(this.minValue*1000)
        switch(this.state.pickerType){
            case "birthday":
                return (
                     <DatePicker
						dateFormat={['YYYY年', 'MM月', 'DD日']}
						theme={"ios"}
	                    value={new Date(this.state.userInfo.birthday*1000)}
	                    max={undefined}
	                    min={undefined}
	                    isOpen={this.state.isPickerOpen}
	                    onSelect={this._pickerConfirm}
	                    onCancel={this._hidePicker} />
                )
            break;
            case "gender":
                return (
                    <Picker
                        startIndex = {parseInt(this.state.userInfo.gender)+1}
                        dataArr = {SEX}
                        value={''}
                        values={[]}
                        theme={"ios"}
                        isOpen={this.state.isPickerOpen}
                        onSelect={this._pickerConfirm}
                        onCancel={this._hidePicker}
                    ></Picker>
                )
            break;
        }        
    }
    _pickerConfirm=(value)=>{
    	$('.info-content').css('position',this.state.isPickerOpen?'relative':'fixed');
		switch(this.state.pickerType){
            case 'birthday':
            	this.state.userInfo.birthday = Date.parse(value)/1000;
				for(let i=0;i<this.state.info.length;i++){
					if(this.state.info[i].value==this.state.pickerType){
						this.state.info[i].submit = Date.parse(value)/1000;
						break;
					}
				}
            	this.setState({
            		isPickerOpen:false,
            		info:this.state.info,
            		userInfo:this.state.userInfo
            	});
            break;
            case 'gender':
            	this.state.userInfo.gender = parseInt(value.code)-1;
				for(let i=0;i<this.state.info.length;i++){
					if(this.state.info[i].value==this.state.pickerType){
						this.state.info[i].submit = parseInt(value.code)-1;
						break;
					}
				}
            	this.setState({
            		isPickerOpen:false,
            		info:this.state.info,
            		userInfo:this.state.userInfo
            	});
            break;
        }
    }
    _hidePicker=()=>{
    	$('.info-content').css('position',this.state.isPickerOpen?'relative':'fixed');
		this.setState({isPickerOpen:false});
    }
    convertSexCode=(code)=>{
		switch(code){
			case 0:
				return '保密'
			break;
			case 1:
				return '男'
			break;
			case 2:
				return '女'
			break;
		}
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
	render () {
		// if(this.state.info.length){
			return (
				<div className='info-content' style={{display:this.state.info.length?'block':'none'}}>
					<h4>上传作品前，请先完善以下信息，以方便我们及时与您联系。</h4>
					<div className='lists'>
					{
						this.state.info.length > 0 ? 
						this.state.info.map((item, index) => {
							return (
								<div className='item' key={index} onClick={()=>{
									if(item.dom=='birthday'||item.dom=='gender'){
										this._pickerChange(item.dom)
									}
								}}>
									<div className='item-box flex flex-ver-center' style={{border:item.format?'1px solid #ff3300':'none'}}>
										<div className='item-left'>
											{item.name}
										</div>
										<div className='item-right flex flex-ver-center'>
										{
											item.dom=="birthday"?
											<div>{item.submit?(convertDate(new Date(item.submit*1000),'YYYY年MM月DD日')):'点击设置'}</div>
											:<div style={{display:'none'}}></div>
										}
										{
											item.dom=="gender"?
											<div>{item.submit?(item.submit==1?'男':'女'):'点击设置'}</div>
											:<div style={{display:'none'}}></div>
										}
										{
											item.dom=="input"?
											<input type="text" placeholder={'输入' + item.name} value={item.submit} onChange={this.inputChange.bind(this,item.value)} onBlur={this.checkFormat.bind(this,index,item.value)}/>
											:<div style={{display:'none'}}></div>
										}	
										</div>
										{
											item.format?
											<img src="img/error.svg" style={{height:20,width:20,position:'absolute',top:'50%',marginTop:'-10px',right:'15px'}} alt=""/>
											:<div style={{display:'none'}}></div>
										}
										
									</div>
									<div className='item-tips'>{item.tips}</div>
								</div>
							)
						}) : ''
					}
					</div>
					<div className="info-confirm-btn" onClick={()=>{
						console.log('this.state.userInfo',this.state.userInfo);
						for(let i in this.state.info){
							if(!this.state.userInfo[this.state.info[i].value]){
								this.showTips('请填写“'+this.state.info[i].name+'”');
								return;
							}
							if(this.state.info[i].format){
								this.showTips('“'+this.state.info[i].name+'”格式错误');
								return;
							}
						}
						this.setLoading(true);
						this.state.userInfo['aid'] = this.state.aid;
						Service.addUserInfo(this.state.userInfo).then(resp=>{
							this.setLoading(false);
							switch (resp.code) {
								case 0:
									Store.getInstance().index.aid = this.state.aid;
									Store.getInstance().index.aname = this.state.aname;
									hashHistory.replace('uploadpic')
									break;
								case 111:
									Commonfn.aotoLogin()
									break;
								default:
									alert(resp.msg)
									break;
							}
						})
						
					}}>确认信息</div>
					{
						this.state.loading?
						<Loading />:''
					}
					<Tips words={this.state.tips}></Tips>
					{this._renderPicker()}
				</div>
			)
		// }else{
		// 	return <div />
		// }
		
	}
}