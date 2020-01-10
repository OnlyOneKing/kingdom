import React from 'react';
import './loading.css';
export default class Loading extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			
		}
	}
	componentWillMount(){
		
	}
	componentDidMount(){
	}
	componentWillReceiveProps(nextProps) {
	}
	
	render(){
		return(
			<div className="loadingBox" style={{position:'fixed'}}>
				<div style={{
					zIndex:9999999,
					position:'fixed',
					top: '35%',
					left: '50%',
					marginLeft:'-36px'
				}} className="ball-pulse" id="loadingBox">
					<div></div>
					<div></div>
					<div></div>
			    </div>
			</div>
		)
	}
}