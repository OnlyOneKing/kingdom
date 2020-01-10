import React from 'react';
import './dialogCom.css';
export default class Dialogcom extends React.Component{
	constructor(props) {
		super(props);
		console.log(this.props);
		this.state={
			style:this.props.style?this.props.style:{},
			mode:this.props.mode?this.props.mode:'',
			btn:this.props.btn&&this.props.btn.length?this.props.btn:[],
			title:this.props.title?this.props.title:'',
			content:this.props.content?this.props.content:''
		}
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		
	}
	componentWillReceiveProps(nextProps) {
		// / style="left: {{ sliderLeft }}px; transform: translateX({{ sliderOffset }}px); -webkit-transform: translateX({{ sliderOffset }}px);margin-left:{{sliderOffset?7:36}}rpx;"
	}
	tapClick=(event)=>{
		event.preventDefault();
		
	    this.props.callback&&this.props.callback(parseInt(event.currentTarget.id))
	}
	render(){
		return(
			<div className="dialogCom" style={this.state.style}>
				<div className="dialogCom-box">
					<div className="dialogCom-title">{this.state.title}</div>
					<div className="dialogCom-content">{this.state.content}</div>
					<div className="dialogCom-funbtn">
					{
						this.state.btn.map((item,index)=>{
							return (
								<div
									key={index}
									className="dialogCom-btn"
									style={{
										color:item.color?item.color:"#333",
										width: 100/this.state.btn.length+'%',
										padding: '10px'
    								}}
    								onClick={item.callback}
    							>{item.name}</div>
							)
						})
					}
					</div>
				</div>
			</div>
		)
	}
}