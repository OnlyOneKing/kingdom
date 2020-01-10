import React from 'react';
import './paymode.css';
export default class Articleqrcode extends React.Component{
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
		let shelfurl = 'https://cng-hd.oss-cn-beijing.aliyuncs.com/uploads/2018/08/5b6d69229cd1e5139.png';
		shelfurl = this.state.qrcode?this.state.qrcode:shelfurl;
		console.log('shelfurl',shelfurl);
		return(
			<div className="paymode-box-bg">
				<div className="paymode-box" style={this.state.style}>
					<div className="paymode">
						<div className="paymode-close" onClick={()=>{this.state.closebtn&&this.state.closebtn.callback()}}/>
						<div className="paymode-title">预览本篇文章内容</div>
						<div className="paymode-subtitle"></div>
						<img className="goShelf" src={shelfurl}/>
						<div className="paymode-subtitle">长按识别小程序码</div>
						<div className="paymode-bottominfo"></div>
					</div>
				</div>
			</div>
		)
	}
}