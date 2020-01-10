import React, { PropTypes } from 'react';
import {hashHistory} from 'react-router';
import Store from '../store.js';
export default class Bottom extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			show:true,
			bottompath:'',
			lastpath:'',
			color:'#7a7e83',
			selectcolor:'#000000',
			data:[{
					itemName: "首页",
					path:'index',
					src: 'img/icon-home.png',
					selectsrc:'img/icon-my-selected.png'
				},{
					itemName: "上传",
					path:'uploadpic',
					src: 'img/icon-upload.png',
					selectsrc:'img/icon-upload.png'
				}, {
					itemName: "我的",
					path:'my',
					src: 'img/icon-my.png',
					selectsrc:'img/icon-my-selected.png'
				}],
		}
	}
	componentDidMount(){
		this.checkShow(this.props.params.id);
		this.checkPath(this.props);
		// if(!this.state.bottompath){
		// 	this.checkShow(this.props.params.id);
		// }
	}
	componentWillMount(){
		
	}
	componentWillReceiveProps(newProps){
		console.log(newProps)
		this.checkPath(newProps);
		this.checkShow(newProps.params.id);
	}
	checkShow=(type)=>{
		let show = false;
		for(let i=0;i<this.state.data.length;i++){
			if(this.state.data[i].path==type && type!='uploadpic'){
				show = true;
				break;
			}
		}
		this.state.show = show;
		this.setState(this.state);
	}
	checkPath=(props)=>{
		let pathname = props.location.pathname.replace(/\//ig,'');
		let has = false;
		for(let i=0;i<this.state.data.length;i++){
			if(this.state.data[i].path==pathname){
				has = true;
				if(!this.state.bottompath)this.state.bottompath =pathname;
				this.state.data[i].currentpath = pathname+props.location.search;
				this.state.data[i].selected = true;
			}else{
				this.state.data[i].selected = false;
			}
		}
		
		this.setState(this.state);
	}
	onSelect=(item)=>{
		if (item == 1) {
			// 清空store
			Store.getInstance().index = {}
		}
		for(let i=0;i<this.state.data.length;i++){
			this.state.data[i].selected = false;
		}
		this.state.data[item].selected = true;
		this.setState(this.state);
		hashHistory.push(this.state.data[item].path);
	}
	render () {
		if(this.state.show){
			return (
				<div className='bottom-bar flex flex-space-between'>
					<div className='bottom-item' onClick={this.onSelect.bind(this, 0)}>
						<img src={this.state.data[0].selected?this.state.data[0].selectsrc:this.state.data[0].src}></img>
						<div style={{color:this.state.data[0].selected?this.state.selectcolor:this.state.color}}>{this.state.data[0].itemName}</div>
					</div>
					<div className='bottom-item' onClick={this.onSelect.bind(this, 1)}>
						<div className='bg-cir'></div>
						<div className='bg-white'>
							<img src={this.state.data[1].selected?this.state.data[1].selectsrc:this.state.data[1].src}></img>
						<div style={{color:this.state.data[1].selected?this.state.selectcolor:this.state.color}}>{this.state.data[1].itemName}</div>
						</div>
					</div>
					<div className='bottom-item' onClick={this.onSelect.bind(this, 2)}>
						<img src={this.state.data[2].selected?this.state.data[2].selectsrc:this.state.data[2].src}></img>
						<div style={{color:this.state.data[2].selected?this.state.selectcolor:this.state.color}}>{this.state.data[2].itemName}</div>
					</div>
				</div>
			)
		}else{
			return <div />
		}
	}
}