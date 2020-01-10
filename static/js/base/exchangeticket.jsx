import React from 'react';
import './exchangeticket.css';
export default class Exchangeticket extends React.Component{
	constructor(props) {
		super(props);
		this.state={
			onClick:this.props.onClick?this.props.onClick:'',
			cards:this.props.cards?this.props.cards:0,
			backgroundColor:this.props.backgroundColor,
			name:this.props.name,
			expiretime:this.props.expiretime,
			bigpart:this.props.bigpart?this.props.bigpart:''
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
			onClick:props.onClick?props.onClick:'',
			cards:props.cards?props.cards:0,
			backgroundColor:props.backgroundColor,
			name:props.name?props.name:'',
			expiretime:props.expiretime?props.expiretime:'',
			bigpart:props.bigpart?props.bigpart:''
		})
	}
	render(){
		return(
			<div className="exchangeticket" onClick={this.state.onClick?this.state.onClick:()=>{}} style={{backgroundColor:this.state.backgroundColor}}>
				<div className="exchangeticket-circle-left"></div>
				<div className="exchangeticket-circle-right"></div>
				<img className="exchangeticket-star" src='img/star.svg'/>
				<div className="exchangeticket-bar">兑换券</div>
				<div className="exchangeticket-title">{this.state.name}</div>
				<div className="exchangeticket-exprietime"><span className='exchangeticket-exprietime-big'>{this.state.bigpart?this.state.bigpart:''}</span><span>{this.state.expiretime}</span></div>
				{
					this.state.cards?
					<div className="exchangeticket-cardsnum"><span style={{fontSize:'9px'}}>x </span>{this.state.cards}</div>
					:''
				}
			</div>
		)
	}
}