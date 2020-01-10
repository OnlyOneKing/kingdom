import React from 'react';
import './bottomfollow.css';
import $ from 'jquery';
import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
export default class Bottomfollow extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			result:'',
			is_subscribe:false,
			img:this.props.src,
			content:this.props.children
		}
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		this.init(this.props);
	}
	componentWillReceiveProps(nextProps) {
	}
	init=(props)=>{
		let serverURL = window.location.href.replace(/cd1/ig, 'cd1').split(".com/")[0] + '.com/';
		$.post(serverURL + 'wx/getUserInfo', encryptParam({})).then(resp=>{
			switch(resp.code){
				case 0:
					this.setState({
						result:JSON.stringify(resp),
						is_subscribe:parseInt(resp.data.subscribe)
					});
				break;
				case 111:
					if (window.location.href.match(/cd2/ig)) {
			            $.get("http://cd2.dili365.com/wx/test").then(resp => {
			                window.location.href = (window.location.href.match(/#/ig) ? (window.location.href.split("#")[0] + "#/") : window.location.href.split("?")[0]) + '_k=lukucc';
			            })
			        } else {
			            window.location.href = 'https://cd.dili365.com/wx/login?getRedirectUrl=' + encodeURIComponent(window.location.href) + '&type=wx'
			        }
				break;
				default:
					alert(resp.msg);
				break;
			}
			
		});
		this.setState({
			img:props.src,
			content:props.children
		});
	}
	render(){
		if(!this.state.is_subscribe){
			return(
				<div className="bottomfollow">
					<div className="bottomfollow-font1">长按识别二维码关注 <span style={{fontWeight:600}}>中国国家地理+</span></div>
					<img src={this.state.img}/>
					<div className="bottomfollow-font2">关注后您将可以</div>
					<div className="bottomfollow-font3">购买中国国家地理、博物、中华遗产历年所有杂志</div>
					<div className="bottomfollow-font3">随时阅读已购买杂志、查看订单</div>
				</div>
			)
		}else{
			return <div></div>
		}
			
	}
}