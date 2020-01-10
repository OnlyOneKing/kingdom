import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import EXIF from 'exif-js';
import $ from 'jquery';
import Store from '../../store.js';
import Commonfn from '../../base/commonfn.js'
import {Dragact,DragactLayoutItem, GridItemProvided} from 'dragact';
const fakeData = () => {
    return Words.map((item, index) => {
        return {
            ...item,
            GridX: 0,
            GridY:0,
            w: 16,
            h: 2,
            key: index + ''
        }
    })
}
const Card: (item: any) => any = ({ item, provided }) => {
    provided.props.style['touchAction']='auto';
    return (
        <div ref={"key"+item.key} className={"layout-Item"+" key"+item.key} style={{width:'100%',backgroundColor:"#fff"}} {...provided.props}>
            <div style={{ padding: 5, textAlign: 'center', color: '#595959' ,position:'relative'}}>
                {item.key}
                <img src='img/move.svg' className="card-handle" {...provided.dragHandle} />
            </div>
        </div>
    )
}
export default class Sort extends React.Component {
	constructor(props) {
		super(props);
		this.animate = false;
		this.state = {
			photos: Store.getInstance().index.picData==undefined?[]:Store.getInstance().index.picData
		}
	}
	componentWillMount() {
		document.title = '图片排序'
	}
	componentDidMount() {
		console.log('1',Store.getInstance().index.picData);
		console.log('2',Store.getInstance().index.picData==undefined);
		if(Store.getInstance().index.picData==undefined){
			hashHistory.goBack(-1);
		}
	}
	componentWillReceiveProps(newProps) {

	}
	
	onDragStart=()=>{

		console.log(123123);
		$(".body").css("position",'fixed');
		$(".body").css("left",'0px');
		$(".body").css("right",'0px');
		$(".body").css("bottom",'0px');
		$(".body").css("top",'0px');
		$(".body").css("overflow",'scroll');
	}
	onDragEnd=(e,c)=>{ 
		$(".body").css("position",'relative');
		$(".body").css("left",'0px');
		$(".body").css("right",'0px');
		$(".body").css("bottom",'0px');
		$(".body").css("top",'0px');
		$(".body").css("overflow",'scroll');
		let newAry = [];
		for(let i in c){
			this.state.photos.forEach(item=>{
				if(c[i].pic_id == item.pic_id){
					newAry.push(item);
				}
			})
		}
		this.state.photos = newAry;
		this.setState({
			photos:this.state.photos
		});
	}
	getCards = ()=>{
		console.log("this.state.photos",this.state.photos);
		return this.state.photos.map((item, index) => {
	        return {
	            ...item,
	            GridX: 0,
	            GridY:index,
	            w: 16,
	            h: 1,
	            editItem:this.state.editItem,
	            inputChange:this.inputChange,
	            key: index + ''
	        }
	    })
	}
	finished=()=>{
		console.log(this.state.photos);
		Store.getInstance().index.picData = this.state.photos
		hashHistory.goBack(-1);
	}
	render() {
		let Cards = this.getCards();
		return ( 
			<div className="sort">
				<div className="sort-tips" style={{zIndex:99999999,fontWeight:600,position:'fixed',top:0,height:'55px',lineHeight:'55px',left:0,right:0,fontSize:'14px',backgroundColor:'#f1f4f6',paddingLeft:'15px'}}>提示：按住并拖动图片条目即可完成排序</div>
				<div className="dragact-box">
					<Dragact
				        layout={Cards} //必填项
				        col={16} //必填项
				        width={1} //必填项
				        rowHeight={92} //必填项
				        margin={[0, 4]} //必填项
				        className="plant-layout" //必填项
				        style={{  }} //非必填项
				        placeholder={true}
				        onDragStart = {this.onDragStart}
				        onDragEnd = {this.onDragEnd}
				    >
				        {(
		                    item: DragactLayoutItem,
		                    provided: GridItemProvided
		                ) => {
		                	provided.props.style['touchAction']='auto';
		                    return(
								<div ref={"key"+item.key} className="sort-item layout-child flex card-handle flex flex-space-between flex-ver-center" {...provided.props}>
									<div className="cover img" style={{backgroundImage:'url('+item.pic_url+')'}}></div>
									<div style={{height:'100%'}} className="sort-btn flex flex-ver-center" {...provided.dragHandle}>
										<img src='img/sort_btn.png'/>
									</div>
								</div>
							)
		                }}
				    </Dragact>
				</div>
				<div className="sort-bottombtn flex">
					<div className="back flex flex-center flex-ver-center" onClick={()=>{hashHistory.goBack(-1)}}>返回</div>
					<div className="finish flex flex-center flex-ver-center" onClick={this.finished.bind(this)}>完成</div>
				</div>
		    </div>
		)
	}
}