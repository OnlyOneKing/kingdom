import React from 'react';
export default class BottomTips extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			content:this.props.children
		}

	}
	componentWillMount(){
		
	}
	componentDidMount(){
		
	}
	componentWillReceiveProps(nextProps) {
		if(nextProps.children!=this.state.content){
			this.setState({content:nextProps.children});
			let _this = this;
			if(nextProps.children!=''){			
				_this.refs.bottomTips.style['overflow']='hidden';
				_this.refs.bottomTips.style['maxHeight']='100px';	
				_this.refs.bottomTips.style['transition']='max-height 200ms ease-in-out 0ms';		
				setTimeout(function(){
					if(_this.refs.bottomTips){
						_this.refs.bottomTips.style['maxHeight']='0px';
						_this.refs.bottomTips.style['transition']='max-height 800ms ease-in-out 0ms';
					}
					setTimeout(function(){
						nextProps.init();
					},1200)
				},4000);
			}else{
				_this.refs.bottomTips.style['overflow']='hidden';
				_this.refs.bottomTips.style['maxHeight']='0px';
				_this.refs.bottomTips.style['transition']='';
			}
		}
	}
	render(){
		return(
			<div ref='bottomTips'  style={{maxHeight:'0px',overflow:'hidden',paddingBottom:this.props.style.paddingBottom}}>
				<pre style={{color:'#999',margin:'24px 0 40px 0',textAlign:'center'}}>{this.state.content}</pre>
			</div>
		)
	}
}