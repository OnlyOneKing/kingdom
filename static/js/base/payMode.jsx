import React from 'react';
import './paymode.css';
export default class Paymode extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			barinfo:this.props.barinfo?this.props.barinfo:'',
			title:this.props.title?this.props.title:'',
			subtitle:this.props.subtitle?this.props.subtitle:'',
			content:this.props.content?this.props.content:[],
			style:this.props.style?this.props.style:{},
			btns: this.props.btns?this.props.btns:[],
			btninfo:this.props.btninfo?this.props.btninfo:'',
			extrainfo:this.props.extrainfo?this.props.extrainfo:'',
			extrabtn:this.props.extrabtn?this.props.extrabtn:{},
			closefun:''
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
			barinfo:props.barinfo?props.barinfo:'',
			title:props.title?props.title:'',
			subtitle:props.subtitle?props.subtitle:'',
			content:props.content?props.content:[],
			style:props.style?props.style:{},
			btns: props.btns?props.btns:[],
			btninfo:props.btninfo?props.btninfo:'',
			extrainfo:props.extrainfo?props.extrainfo:'',
			extrabtn:props.extrabtn?props.extrabtn:{},
			closebtn:props.closebtn?props.closebtn:{}
		});
	}
	tapClick=(event)=>{
		event.preventDefault();
		this.setState({
	      sliderOffset: event.currentTarget.offsetLeft,
	      activeIndex: event.currentTarget.id,
	    })
	    this.props.callback&&this.props.callback(parseInt(event.currentTarget.id))
	}
	render(){
		let slidestyle = {
			width:this.state.sliderwidth,
			transform:"translateX("+this.state.sliderOffset+"px)",
			marginLeft:(this.state.sliderOffset?3:18)+'px'
		};
		return(
			<div className="paymode-box-bg">
				<div className="paymode-box" style={this.state.style}>
					<div className="paymode">
						<div className="paymode-close" onClick={()=>{this.state.closebtn&&this.state.closebtn.callback()}}/>
						<div className="paymode-barinfo">{this.state.barinfo}</div>
						<div className="paymode-title">{this.state.title}</div>
						<div className="paymode-subtitle">{this.state.subtitle}</div>
						{
							this.state.content&&this.state.content.length&&this.state.content[0]?
							<div className="paymode-content">
								{
									this.state.content.map((item,index)=>{
										return (
											<div key={index}>{item}</div>
										)
									})
								}
							</div>:''
						}
						<div className="paymode-btnbox">
							{
								this.state.btns.map((item,index)=>{
									return (
										<div 
											onClick={item.callback}
											key={index}
											className="paymode-btn"
											style={{
												backgroundColor:item.backgroundcolor?item.backgroundcolor:'#f0f0f0',
												color:item.color?item.color:'#ffffff'
											}}>{item.name}</div>
									)
								})
							}
							<div className="paymode-btninfo">{this.state.btninfo}</div>
						</div>
						<div className="paymode-extra">
							<div className="paymode-extrainfo">{this.state.extrainfo}</div>
							<div className="paymode-extrabtn" style={{color:this.state.extrabtn.color?this.state.extrabtn.color:'#ffffff'}} onClick={this.state.extrabtn.callback}>{this.state.extrabtn.name}</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}