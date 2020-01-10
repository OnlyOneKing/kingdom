import React, { PropTypes }  from 'react';
import ReactDom from 'react-dom';
import Store from '../store.js';
import StoreEvent from '../base/storeEvent.js';

//main
import Index from './index/index.jsx';
import Uploadpic from './upload/index.jsx';
import Huodong from './upload/huodong.jsx';
import Biaoqian from './upload/biaoqian.jsx';
import Address from './upload/address.jsx';
import Fengmian from './upload/fengmian.jsx';
import Info from './upload/info.jsx';
import My from './my/index.jsx';
import Details from './details/index.jsx';
import Allphotos from './my/allphotos.jsx';
import Caogao from './my/caogao.jsx';
import Shoucang from './my/shoucang.jsx';
import Sort from './sort/index.jsx';
import Competition from './competition/competition.jsx';
import Competnoson from './competition/competnoson.jsx';
import Compethaveson from './competition/compethaveson.jsx';
import Collect from './collect/collect.jsx';
import Collectnoson from './collect/collectnoson.jsx';
import Collecthaveson from './collect/collecthaveson.jsx';
import Zuimei from './zuimei/zuimei.jsx';
import Zuimeinoson from './zuimei/zuimeinoson.jsx';
import Zuimeihaveson from './zuimei/zuimeihaveson.jsx';
import Photobase from './photobase/photobase.jsx';
import Photobasenoson from './photobase/photobasenoson.jsx';
import Photobasehaveson from './photobase/photobasehaveson.jsx';
import Rank from './rank/rank.jsx';
import Accusation from './accusation.jsx';
import Map from './map/map.jsx';
import Aba from './simple/aba.jsx';
import Navigation from './map/Navigation.jsx';
const { bool, func, shape, string, number, array } = PropTypes
export default class Content extends React.Component{
	constructor(props) {
		super(props);
		this.doms=[];
		this.state={
			dom : '',
			props:props
		};
	}
	componentDidMount(){
		this.initData(this.props);
	}
	componentWillReceiveProps(newProps){
		if(newProps.className==this.props.className){
			this.initData(newProps);
		}
	}
	initData=(props)=>{
		let domName='',tempDom;
		this.doms = [
			<Uploadpic {...props} />,
			<Sort {...props} />,
			<Index {...props} />,
			<My {...props} />,
			<Huodong {...props} />,
			<Biaoqian {...props} />,
			<Details {...props} />,
			<Allphotos {...props} />,
			<Caogao {...props} />,
			<Shoucang {...props} />,
			<Address {...props} />,
			<Fengmian {...props} />,
			<Info {...props} />,
			<Competition {...props} />,
			<Competnoson {...props} />,
			<Compethaveson {...props} />,
			<Rank {...props} />,
			<Collect {...props} />,
			<Collectnoson {...props} />,
			<Collecthaveson {...props} />,
			<Accusation {...props} />,
			<Zuimei {...props} />,
			<Zuimeinoson {...props} />,
			<Zuimeihaveson {...props} />,
			<Photobase {...props} />,
			<Photobasenoson {...props} />,
			<Photobasehaveson {...props} />,
			<Map {...props} />,
			<Navigation {...props} />,
			<Aba {...props} />,
		];
		for(let i =1;i<props.location.pathname.split("/").length;i++){
			domName+=props.location.pathname.split("/")[i]+'_';
		}
		domName = domName.substring(0,domName.length-1);
		for(let item of this.doms){
			if(item.type.name.toLowerCase()==domName.toLowerCase()){
				tempDom=item;
				break;
			}
		}
		this.setState({
			dom : tempDom?tempDom:'',
			props:props
		});
	}
	render(){
		return (
			<div className='content'>
				{
					this.state.dom
				}
			</div>
		)
	}
}