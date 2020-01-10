import React, { PropTypes } from 'react';
import {hashHistory} from 'react-router';
import Store from '../store.js';
import StoreEvent from '../base/storeEvent.js';
import Commonfn from '../base/commonfn.js'
import Loading from '../base/loading.jsx';
import $ from 'jquery';
import Commonservice from './commonservice.js';
import Tips from '../../../../../common/utils/Tips.jsx';
import {deepCopy} from '../../../../../common/utils/simpleUtil.js';
export default class Accusation extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			tips:'',
			accusationList:[],
			accusateItem:'',
			loading:false,
			demo:'',
			realname:'',
			tel:'',
			userInfo:''
		}
	}
	componentDidMount(){
		Store.getInstance();
		this.getUserInfo();
		this.setList();
		if(!Store.getInstance().accusateItem||!Store.getInstance().accusateItem.rid)hashHistory.goBack(-1);
		// if(!this.state.bottompath){
		// 	this.checkShow(this.props.params.id);
		// }
	}
	componentWillMount(){
		
	}
	componentWillReceiveProps(newProps){
		console.log(newProps)
	}
	setLoading=(v)=>{
		this.setState({
			loading:v
		});
	}
	getUserInfo=()=>{
		// console.log(window.localStorage['Photodili365UserinfoSession']);
		// if (window.localStorage['Photodili365UserinfoSession'] && JSON.parse(window.localStorage['Photodili365UserinfoSession'])) {
		// 	console.log("getUserInfo1");
		// 	let userInfo = JSON.parse(window.localStorage['Photodili365UserinfoSession'])
		// 	this.setState({
		// 		realname:userInfo.realname,
		// 		tel:userInfo.tel
		// 	});
		// }else{
		// 	console.log("getUserInfo2");
			this.setLoading(true); 
			Commonservice.getMyInfo().then(resp=>{
				this.setLoading(false);
				switch(resp.code){
					case 0:
						window.localStorage['Photodili365UserinfoSession'] = JSON.stringify(resp.data);
						this.setState({
							realname:resp.data.realname,
							tel:resp.data.tel
						});
						break;
					case 111:
						Commonfn.aotoLogin()
						break;
					default:
						alert(resp.msg)
						break;
				}
			})
		// }
	}
	setList=()=>{
		if(Store.getInstance().accusationList instanceof Array && Store.getInstance().accusationList[0].length){
			console.log("setlist");
			let accusationList = deepCopy(Store.getInstance().accusationList);
			this.setState({
				accusationList:accusationList
			});
		}else{
			setTimeout(()=>{
				this.setList();
			},5)
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
	submit=()=>{
		if(this.state.accusateItem==''){
			this.showTips('请选择举报内容');
			return;
		}
		if(this.state.realname==''){
			this.showTips('需填写真实姓名');
			return;
		}
		let reg = /^1[3456789]\d{9}$/;
		if(reg.test(this.state.tel) === false){
			this.showTips('请填写举报人真实手机号');
			return;
		}
		this.setLoading(true);
    	let opt = {
    		"rid":Store.getInstance().accusateItem.rid,         //记录id
		    "type_id": this.state.accusateItem.code,  //真实姓名
		    "content": this.state.accusateItem.name,  //身份证
		    "realname": this.state.realname,
		    "tel": this.state.tel,
		    "demo": this.state.demo
    	};
    	Commonservice.accusate(opt).then(resp=>{
    		this.setLoading(false);
    		switch(resp.code){
    			case 0:
					this.showTips('已举报');
					hashHistory.goBack(-1);
    			break;
    			case 111:

    			break;
    			default:
    				this.showTips(resp.msg);
    			break;
    		}
    	})
	}
	selectChange=(item)=>{
		for(let i in this.state.accusationList){
			for(let j in this.state.accusationList[i]){
				this.state.accusationList[i][j].selected = 0;
			}
		}
		item.selected = item.selected?0:1;
		this.state.accusateItem = item;
		this.setState(this.state);
	}
	inputChange=(params,obj)=>{
		this.state[params] = obj.target.value;
		this.setState(this.state);
	}
	render () {
		console.log(this.state);
		let selectSrc = 'img/icon-select.png';
		let unselectSrc = 'img/icon-noselect.png';
		return(
			<div>
				<div className="accusationBar">选择举报原因（必填）<span className="accusationAttention">*</span></div>
				{
					this.state.accusationList.length&&this.state.accusationList[0].length&&this.state.accusationList[0].map((item,index)=>{
						return(
							<div key={index} className="accusationItem flex flex-ver-center" onClick={this.selectChange.bind(this,item)}>
								<img src={item.selected?selectSrc:unselectSrc} alt=""/>
								<div>{item.name}</div>
							</div>
						)
					})
				}
				<div className="accusationBar">描述举报内容（必填）<span className="accusationAttention">*</span></div>
				<div className="accusationDemo">
					<textarea name="" id="" cols="30" rows="10" value={this.state.demo} onChange={this.inputChange.bind(this,'demo')}></textarea>
				</div>
				<div className="accusationBar">投诉人姓名（必填）<span className="accusationAttention">*</span></div>
				<div className="accusationInput">
					<input value={this.state.realname} onChange={this.inputChange.bind(this,'realname')}></input>
				</div>
				<div className="accusationBar">投诉人电话（必填）<span className="accusationAttention">*</span></div>
				<div className="accusationInput">
					<input value={this.state.tel} onChange={this.inputChange.bind(this,'tel')}></input>
				</div>
				<div className="accusationSubmit" onClick={this.submit}>提 交</div>
		        <Tips words={this.state.tips}></Tips>
		        {
					this.state.loading ? <Loading></Loading> : ''
				}
			</div>
		)
	}
}