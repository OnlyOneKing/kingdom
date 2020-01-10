import React from 'react';
import './navbar.css';
import $ from 'jquery';
export default class Navbar extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			sliderwidth:this.props.sliderwidth?this.props.sliderwidth:44,
			sliderOffset:this.props.sliderOffset?this.props.sliderOffset:0,
			style:this.props.style?this.props.style:{},
			mode:this.props.mode?this.props.mode:'',
			tabs: this.props.tabs?this.props.tabs:[],
			content:this.props.children,
			activeIndex: this.props.activeIndex?this.props.activeIndex:0
		}
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		if(this.props.mode!='scroll'){
			this.setState({
				tabs:this.props.tabs?this.props.tabs:[],
				sliderwidth:44
			});
		}
	}
	componentWillReceiveProps(nextProps) {
		this.setState({
			tabs:nextProps.tabs?nextProps.tabs:[],
	    	sliderOffset: nextProps.sliderOffset,
	    	activeIndex: nextProps.activeIndex,
	    })
		// / style="left: {{ sliderLeft }}px; transform: translateX({{ sliderOffset }}px); -webkit-transform: translateX({{ sliderOffset }}px);margin-left:{{sliderOffset?7:36}}rpx;"
	}
	tapClick=(event)=>{
		event.preventDefault();
		this.setState({
	      sliderOffset: event.currentTarget.offsetLeft,
	      activeIndex: event.currentTarget.id,
	    })
	    this.props.callback&&this.props.callback(parseInt(event.currentTarget.id),event.currentTarget.offsetLeft)
	}
	render(){
		let slidestyle = {
			width:this.state.sliderwidth,
			transform:"translateX("+this.state.sliderOffset+"px)",
			marginLeft:this.state.mode=='scroll'?((this.state.sliderOffset?0:18)+'px'):((($(".body").width() - 100)/this.state.tabs.length-this.state.sliderwidth)/2)
		};
		return(
			<div className={"navBar "+this.state.mode} style={this.state.style}>
				{
					this.state.tabs.map((item,index)=>{
						return(
							<div id={index} onClick={this.tapClick.bind(this)} className={index == this.state.activeIndex ? 'navBarItem active' : 'navBarItem'} key={index}>{item}</div>
						)
					})
				}
				<div className="navBar-line" style={slidestyle}></div>
			</div>
		)
	}
}