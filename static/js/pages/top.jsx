import React, { PropTypes } from 'react';
import {hashHistory} from 'react-router';
import $ from 'jquery';
export default class Top extends React.Component {
	constructor(props) {
		super(props);
		this.state={
			topShow: false,
			indexShow: false,
			scrollviewTop: 0,
			topPath: ['index', 'details', 'allphotos', 'caogao', 'shoucang', 'competition', 'compethaveson', 'competnoson', 'rank', 'collect', 'collecthaveson', 'collectnoson', 'zuimei', 'zuimeihaveson', 'zuimeinoson','aba'], // 显示返回顶部的页面
			indexPath: ['details','allphotos', 'caogao', 'shoucang','competition', 'compethaveson', 'competnoson', 'rank', 'collect', 'collecthaveson', 'collectnoson', 'zuimei', 'zuimeihaveson', 'zuimeinoson'], // 显示返回顶部的页面
		}
	}
	componentDidMount(){
		this.checkShow(this.props);
		window.addEventListener('scroll', this.handleScroll.bind(this))
	}
	componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll.bind(this))
	}
	componentWillReceiveProps(newProps){
		this.checkShow(newProps);
	}
	// 检查是否显示返回顶部或者返回首页
	checkShow = (props) => {
		let pathname = props.location.pathname.replace(/\//ig,'')
		let topPath = [...this.state.topPath]
		let indexPath = [...this.state.indexPath]
		if (topPath.indexOf(pathname) > -1) {
			this.setState({
				topShow: true
			})
		} else {
			this.setState({
				topShow: false
			})
		}
		if (indexPath.indexOf(pathname) > -1) {
			this.setState({
				indexShow: true
			})
		} else {
			this.setState({
				indexShow: false
			})
		}
	}
	// 滚动事件
	handleScroll = () => {
		let scrollviewTop = document.body.scrollTop || document.documentElement.scrollTop
		this.setState({
			scrollviewTop
		})
	}
	// 点击返回顶部
	toTop = () => {
		$('body,html').animate({scrollTop:0}, 300);
	}
	// 点击返回首页
	toIndex = () => {
		hashHistory.push('index')
	}
	
	render () {
		const topStyle = {
			bottom: this.state.scrollviewTop > 150 ? '80px' : '-100px',
			opacity: this.state.scrollviewTop > 150 ? 1 : 0
		}
		const indexStyle = {
			bottom: this.state.topShow ? (this.state.scrollviewTop > 150 ? '130px' : '80px') : '80px',
			opacity: 1
		}
		return (
			<div>
				{
					this.state.topShow ? <img src="img/top.png" className="toTop" onClick={this.toTop} style={topStyle} /> : ''
				}
				{
					// this.state.indexShow ? <img src="img/icon-xf-index.png" className="toIndex" onClick={this.toIndex} style={indexStyle} /> : ''
				}
			</div>
		)
	}
	
}