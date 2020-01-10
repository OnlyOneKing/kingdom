import React from 'react';
import './paymode.css';
export default class Paysuc extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			qrcode:this.props.qrcode?this.props.qrcode:'',
			mode:this.props.mode?this.props.mode:'',
			showPaySucMode:'',
			closebtn:''
		}
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		this.init(this.props);
	}
	componentWillReceiveProps(nextProps) {
		this.init(nextProps);
	}
	init=(props)=>{
		this.setState({
			qrcode:props.qrcode?props.qrcode:'',
			mode:props.mode?props.mode:'',
			showPaySucMode:props.showPaySucMode?props.showPaySucMode:'',
			closebtn:props.closebtn?props.closebtn:{}
		});
	}
	render(){
		let shelfsrc = 'img/goshelf.png';
		let discountsrc = 'img/godiscount.png';
		shelfsrc = this.state.qrcode?this.state.qrcode:shelfsrc;
		return(
			<div className="paymode-box-bg">
				<div className="paymode-box" style={this.state.style}>
					<div className="paymode">
						<div className="paymode-close" onClick={()=>{this.state.closebtn&&this.state.closebtn.callback()}}/>
						<div className="paymode-title">{this.state.closebtn&&this.state.closebtn.hidetitle?'':(this.state.showPaySucMode=="nopay"?'已购买':'支付成功')}</div>
						<div className="paymode-subtitle">{this.state.mode=='discount'?'长按识别二维码 查看我的兑换券':'长按识别二维码开始阅读'}</div>
						<img className="goShelf" src={this.state.mode=="discount"?discountsrc:shelfsrc}/>
						<div className="paymode-bottominfo">中国国家地理畅读提供阅读服务</div>
					</div>
				</div>
			</div>
		)
	}
}