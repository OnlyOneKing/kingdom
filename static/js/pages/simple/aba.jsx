import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import { Swiper, Slide } from 'react-dynamic-swiper';
import 'react-dynamic-swiper/lib/styles.css';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Jiazai from '../../base/jiazai.jsx';
import Navbar from '../../base/Navbar.jsx';
import Store from '../../store.js';
import Fn from '../../base/fn.js'
import InfiniteScroll from 'react-infinite-scroller'
import LazyLoad from 'react-lazyload'
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js'
import {deepCopy} from '../../../../../../common/utils/simpleUtil.js';
export default class Aba extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			need_pic_desc:0,
			tips:'',
			dataList: [{
			id: 130,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f76db4a4b8062810689.jpg',
			title: '阿坝晨雾',
			dongjing: "101°41′",
			beiwei: "32°53′",
			haiba: "3528米",
			fangxiang: "北偏西30°",
			time: "6:00-9:00",
			jijie: "8月至11月",
			},
			{
			id: 152,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f6fcbb1b68i65909570.jpg',
			title: '毕棚沟',
			dongjing: "102°57′",
			beiwei: "31°20′",
			haiba: "2943米",
			fangxiang: "东偏南30°",
			time: "7:30-10:00",
			jijie: "秋冬两季",
			},
			{
			id: 157,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d4804db3f0481t74889922.jpg',
			title: '黄河九曲第一湾',
			dongjing: "102°28′",
			beiwei: "33°28′",
			haiba: "3599米",
			fangxiang: "东偏北10°",
			time: "17:00-19:00",
			jijie: "8-11月",
			},
			{
			id: 160,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f70a459188t78432635.jpg',
			title: '金川河谷',
			dongjing: "102°03′",
			beiwei: "31°34′",
			haiba: "2866米",
			fangxiang: "南偏东10°",
			time: "6:30-8:00",
			jijie: "3月中旬和10月下旬",
			},
			{
			id: 97,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f715492a24z47358103.jpg',
			title: '热尔大坝',
			dongjing: "102°52′",
			beiwei: "28°11′",
			haiba: "3504米",
			fangxiang: "东偏北3°",
			time: "7:00-9:00",
			jijie: "夏季",
			},
			{
			id: 96,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f730167410860050389.jpg',
			title: '若尔盖花湖',
			dongjing: "102°49′",
			beiwei: "33°55′",
			haiba: "3442米",
			fangxiang: "南偏东16°",
			time: "7:00-9:30,17:30-19:30",
			jijie: "6-8月",
			},
			{
			id: 135,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f73c678249281293694.jpg',
			title: '三奥雪山',
			dongjing: "102°36′",
			beiwei: "32°14′",
			haiba: "4291米",
			fangxiang: "南偏东20°",
			time: "17:30-19:30",
			jijie: "8-11月",
			},
			{
			id: 140,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f850a42576305614247.jpg',
			title: '四姑娘山',
			dongjing: "102°51′",
			beiwei: "30°60′",
			haiba: "3581米",
			fangxiang: "北偏东20°",
			time: "17:00-19:00",
			jijie: "夏秋两季",
			},
			{
			id: 129,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7608e4991204646981.jpg',
			title: '五彩池',
			dongjing: "103°50′",
			beiwei: "32°43′",
			haiba: "3453米",
			fangxiang: "北偏东20°",
			time: "8:00-10:00",
			jijie: "夏秋两季",
			},
			{
			id: 136,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f748bef7c0c21100141.jpg',
			title: '五花海',
			dongjing: "103°53′",
			beiwei: "33°09′",
			haiba: "2510米",
			fangxiang: "北偏东10°",
			time: "16:00-18:00",
			jijie: "9月至次年2月",
			},
			{
			id: 139,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f875dcdf55t63418016.jpg',
			title: '西索民居',
			dongjing: "102°18′",
			beiwei: "31°52′",
			haiba: "2627米",
			fangxiang: "北偏西20°",
			time: "7:00-10:00",
			jijie: "春冬两季",
			},
			{
			id: 137,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7562c2663h93446855.jpg',
			title: '雪宝鼎',
			dongjing: "103°44′",
			beiwei: "32°44′",
			haiba: "3831米",
			fangxiang: "东偏南20°",
			time: "17:30-19:30",
			jijie: "秋季",
			},
			{
			id: 93,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f722d41ee2o86856896.jpg',
			title: '月亮湾',
			dongjing: "102°30′",
			beiwei: "32°47′",
			haiba: "3528米",
			fangxiang: "东偏北6°",
			time: "6:30-8:00",
			jijie: "6-9月",
			},
			{
			id: 202,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f813741304h31557049.jpg',
			title: '壤塘觉囊文化中心',
			dongjing: "101°11′",
			beiwei: "32°21′",
			haiba: "3600米",
			fangxiang: "东偏北45°",
			time: "9:00-17:00",
			jijie: "四季皆宜",
			},
			{
			id: 203,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7a9110009002945601.jpg',
			title: '直波碉群',
			dongjing: "102°05′",
			beiwei: "31°54′",
			haiba: "2518米",
			fangxiang: "正西",
			time: "8:00-10:00,16:00-19:00",
			jijie: "冬季下雪、春天花开时节",
			},
			{
			id: 204,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d4804ed436992k20421743.jpg',
			title: '甘堡藏寨',
			dongjing: "103°11′",
			beiwei: "31°29′",
			haiba: "1933米",
			fangxiang: "北偏东10°",
			time: "9:00-11:00,16:00-18:00",
			jijie: "夏秋两季",
			},
			{
			id: 216,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7825ae875z17164515.jpg',
			title: '咯尔乡世外梨园',
			dongjing: "102°04′",
			beiwei: "31°33′",
			haiba: "2562米",
			fangxiang: "南偏西15°",
			time: "16:00-18:00",
			jijie: "春秋两季",
			},
			{
			id: 217,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f78fcb9414e15213695.jpg',
			title: '卓克基土司官寨',
			dongjing: "102°17′",
			beiwei: "31°52′",
			haiba: "2697米",
			fangxiang: "北偏东15°",
			time: "15:00-18:00",
			jijie: "四季皆可",
			},
			{
			id: 218,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f79c8317f8i91404231.jpg',
			title: '大藏寺',
			dongjing: "102°13′",
			beiwei: "32°07′",
			haiba: "3530米",
			fangxiang: "西偏北30°",
			time: "6:30-8:00,17:30-19:30",
			jijie: "5-10月",
			},
			{
			id: 219,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7fa031fd2316205310.jpg',
			title: '神座风光',
			dongjing: "101°58′",
			beiwei: "32°44′",
			haiba: "3308米",
			fangxiang: "西偏南15°",
			time: "9:00-17:00",
			jijie: "3-5月",
			},
			{
			id: 220,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7edec5684t78037853.jpg',
			title: '麦昆藏寨',
			dongjing: "101°45′",
			beiwei: "32°54′",
			haiba: "3290米",
			fangxiang: "东偏南45°",
			time: "6:30-8:30,18:00-19:30",
			jijie: "6-10月",
			},
			{
			id: 221,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7d305be12a20404454.jpg',
			title: '达古冰山',
			dongjing: "102°45′",
			beiwei: "32°13′",
			haiba: "4840米",
			fangxiang: "南偏西10°",
			time: "16:00-19:00",
			jijie: "春秋两季",
			},
			{
			id: 222,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7e27f7009q90190743.jpg',
			title: '东措日月海',
			dongjing: "102°47′",
			beiwei: "32°13′",
			haiba: "4660米",
			fangxiang: "西偏南30°",
			time: "7:30-10:00",
			jijie: "春秋两季",
			},
			{
			id: 223,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f7c5b45388o78425463.jpg',
			title: '色尔古藏寨',
			dongjing: "103°25′",
			beiwei: "31°55′",
			haiba: "1780米",
			fangxiang: "北偏西40°",
			time: "9:00-10:00,16:00-17:00",
			jijie: "夏秋两季",
			},
			{
			id: 228,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f81fa96333457264667.jpg',
			title: '雪域城堡与隆珠措',
			dongjing: "102°77′",
			beiwei: "31°07′",
			haiba: "3490米",
			fangxiang: "正北",
			time: "9:00-17:00",
			jijie: "4-10月",
			},
			{
			id: 229,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f807eb4029499646882.jpg',
			title: '羌城远眺',
			dongjing: "103°50′",
			beiwei: "31°40′",
			haiba: "1558米",
			fangxiang: "正西",
			time: "9:00-13:00",
			jijie: "四季皆宜",
			},
			{
			id: 230,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f882b87365w04429234.jpg',
			title: '云朵上的羌城',
			dongjing: "103°49′",
			beiwei: "31°40′",
			haiba: "1546米",
			fangxiang: "东偏北30°",
			time: "7:30-9:30,17:00-19:00",
			jijie: "四季皆可",
			},
			{
			id: 231,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f842837b36e43854041.jpg',
			title: '花绿二海之花海',
			dongjing: "103°53′",
			beiwei: "32°29′",
			haiba: "2986米",
			fangxiang: "东偏北45°",
			time: "9:00-17:00",
			jijie: "5-9月",
			},
			{
			id: 235,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d47f85a911d18589515786.jpg',
			title: '曲流',
			dongjing: "102°34′",
			beiwei: "31°32′",
			haiba: "4026米",
			fangxiang: "西偏南60°",
			time: "9:00-17:00",
			jijie: "4-10月",
			},
			{
			id: 1709,
			focus: 'http://img1.dili360.com/pic/2019/08/05/5d48149c6a0075b42269070.jpg',
			title: '阿坝•卧龙大熊猫观察拍摄基地'
			}], // 子分组数据列表
			id: 0, // 大赛id
			title: '', // 大赛标题
		}
		this.serverURL = window.location.href.split(".com/")[0] + '.com/';
	}
	componentWillMount () {
		document.title = '“阿坝州观景大使”线上打卡评选活动'
		if (!Fn.isMobile()){
			document.documentElement.style.cssText = "width: 100%!important"
		}
		let _this = this
		let opt = {
			aid: 1712
		}
		$.post(this.serverURL + 'focus/detailsFocus', opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					// let data = resp.data.focus
					// let content = resp.data.content
					// let title = resp.data.title
					// let zuimeiDetail = resp.data
				
					// if (!Store.getInstance().zuimeiNoson.gotoDetailYe) {
					// 	$('.navBarItem')[2].click()
					// }
					
					// document.title = title
					// this.state.title = title;
					// this.state.desc = resp.data.desc;
					// this.state.zuimeiDetail = zuimeiDetail;
					this.setShare()
					_this.setState({
						tips:resp.data.tips
					})
					
					break;
				case 111:
					Commonfn.aotoLogin()
					break;
				default:
					alert(resp.msg)
					break;
			}
		})
	}
	componentWillUnmount () {
		document.documentElement.style.cssText = ""
	}
	/**
	 * [微信分享 ]
	 */
	setShare = () => {
		let sharetitle = '“阿坝州观景大使”线上打卡评选活动'
		let sharedes = '中国国家地理&阿坝州文化和旅游局联合主办';//'西藏山南市【错那县】的风景，和【杜鹃花】的摄影作品都可参赛！'
		let shareTimeLinedes = sharedes
		let link = window.location.href
		let sharesrc = 'https://cng-hd.oss-cn-beijing.aliyuncs.com/uploads/2019/08/photo_5d4900f6f33b7.jpg?x-oss-process=image/resize,w_220'
		let hideMenuItems = ['menuItem:share:facebook']
        WeChatUtil.getInstance().set({'hideMenuItems':hideMenuItems,'icon':sharesrc,'title':sharetitle,'link':link,'desc':sharedes,'shareTimeLinedes':shareTimeLinedes,'showShare':true});
	}
	
	/**
	 * [跳转页面]
	 * @param  url [跳转地址]
	 */
	goto = (url) => {
		hashHistory.push(url)
	}
	
	/**
	 * [跳转到详情]
	 */
	join = (e) => {
		let copyright = {
			id:1712,
			tips:this.state.tips
		}
		Store.getInstance().copyright_info = copyright;

		let id = e.currentTarget.getAttribute("data-id")
		let title = e.currentTarget.getAttribute("data-title")
		Store.getInstance().info.rule.need_pic_desc = this.state.need_pic_desc;
		hashHistory.push({
			pathname: 'info',
			query: {
				tid:'1712',
				aid: id,
				aname: title
			}
		})
	}
	/**
	 * [跳转到下一页]
	 */
	gotoNext = (e) => {
		let id = e.currentTarget.getAttribute("data-id")
		if (id != 1709) {
			Store.instance.initZuimeiNoson()
			hashHistory.push({
				pathname: 'zuimeinoson',
				query: {
					id,
					son: 1
				}
			})
		} else {
			Store.instance.initPhotobaseNoson()
			hashHistory.push({
			pathname: 'photobasenoson',
			query: {
				id,
				son: 1
			}
		})
		}
		
	}
	
	render () {
		if (!Fn.isMobile()) {
			return(
				<div className='pc-con'>
					<div className='pc-banner'>
						<img src='img/pc-aba.jpg' />
					</div>
					<div className='pc-content'>
						<ul className='pic-list flex flex-space-between'>
							{
								this.state.dataList.map((item, index) => {
									return (
										<li className='pic-item' key={index}>
											<div className='pic-box' data-id={item.id} onClick={this.gotoNext.bind(this)} style={{backgroundImage: 'url(' + item.focus + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth + ')' }} >
												
											</div>
											<div className='pic-con-box'>
												<div className="pic-mid">
													<p className="pic-name">{item.title}</p>
												</div>
												<div className='pic-bottom'>
													
														{
															item.dongjing ? 
															<ul>
																<li>东经：{item.dongjing}</li>
																<li>北纬：{item.beiwei}</li>
																<li>海拔：{item.haiba}</li>
																<li>观看方向：{item.fangxiang}</li>
																<li>最佳拍摄时间：{item.time}</li>
																<li>最佳拍摄季节：{item.jijie}</li>
															</ul>
														: 
															<div className='xiongmao' style={{textIndent: '26px',paddingBottom: '20px'}}>阿坝•卧龙大熊猫观察拍摄基地位于四川卧龙自然保护区中国保护大熊猫研究中心卧龙神树坪基地，是集大熊猫饲养、繁育、研究、野化培训与放归研究以及公众教育和高端科学观察为一体的世界一流的大熊猫研究中心。</div>
														}
												
												</div>
												<div className='daka'>
													<span className='btn-daka' data-title={item.title} data-id={item.id} onClick={this.join.bind(this)}>打卡</span>
												</div>
											</div>	
										</li>
									)
								})
							}
						</ul>
					</div>
				</div>
			)
		} else {
			return (
			<div className='index-content competition-content compethaveson-content collecthaveson-content'>
			{/*轮播图*/}
				<Swiper
                        ref="swiperObj"
                        swiperOptions={{
                          slidesPerView: 'auto'
                        }}
                        navigation={false}
                        pagination={false}
                        scrollBar={false}
                      >
                        <Slide className="_swiper__slide">
                            <img src='https://cng-hd.oss-cn-beijing.aliyuncs.com/uploads/2019/08/photo_5d48f021d5f20.jpg?x-oss-process=image/resize,w_750'/>
                        </Slide>
                </Swiper>
	  
			{/*主题内容列表*/}
				{
					<div className='lists'>
						{
							this.state.dataList.map((item, index) => {
									return (
												<div className='lists-item' key={index}>
													<div className='bottomline'>
														<div className='img-box'>
															<img src={item.focus + '?x-oss-process=image/resize,w_750'} />
														</div>
													
													<div className='item-con'>
														<h1>{item.title}</h1>
													</div>
													</div>
													<div className='compethaveson-bottom flex flex-space-around flex-ver-center'>
															<div className='bottom-btn' data-id={item.id} onClick={this.gotoNext.bind(this)}>查看本组作品</div>
															<div className='bottom-btn green' data-title={item.title} data-id={item.id} onClick={this.join.bind(this)}>传图打卡</div>
													</div>
												</div> 
											)
										})
						}
					</div>
				}
				
			</div>
		)
		}
		
	}
}