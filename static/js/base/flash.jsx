import React from 'react';
import './flash.css';
export default class Flash extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			show:false,
			data:this.props.data,
			content:this.props.children
		}
		this.left = 0;
		this.timer = '';
	}
	componentWillMount(){
		
	}
	componentDidMount(){
		
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.data!=this.state.data){
			console.log("next");
			this.state.data = nextProps.data;
			this.left = 3000;
			this.reset();
		}
	}
	reset=()=>{
		let $this = this;
		this.timer = setTimeout(function(){
			if($this.left>0){
				$this.setState({
					show:true
				});
				$this.left-=10;
				$this.reset();
			}else{
				clearTimeout(this.timer)
				$this.setState({
					show:false
				});
			}
		},10);
	}
	render(){
		return(
			<div className={this.state.show?'flash-show':'flash-hide'}>
				<div style={{padding:'10px 15px',textAlign:'center',backgroundColor:"rgba(0,0,0,0.8)",color:'#ffffff',fontSize:'16px',margin:'0 auto',marginTop:'40%',borderRadius:'5px',maxWidth:'140px'}}>{this.state.content}</div>
			</div>
		)
	}
}