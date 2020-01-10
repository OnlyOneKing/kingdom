import React from 'react';
import './jiazai.css';
export default class Jiazai extends React.Component{
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
			<div className="jiazai flex flex-column flex-center flex-ver-center">
				<img src="img/icon-loading.png" />
				<div>正在加载</div>
			</div>
		)
	}
}