import React from 'react';
import ReactDom from 'react-dom';
import {
	hashHistory
} from 'react-router';
import EXIF from 'exif-js';
import Selfservice from './service.js';
import $ from 'jquery';
import Loading from '../../base/loading.jsx';
import Service from './service.js';
import Commonfn from '../../base/commonfn.js'
import Store from '../../store.js';
import Tips from '../../../../../../common/utils/Tips.jsx';
import {getGpsFromExif} from '../../../../../../common/utils/simpleUtil.js';
import WeChatUtil from '../../../../../../common/utils/wechatUtil.js'
export default class Uploadpic extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			rid: '', // 记录ID
			tips:'', // 弹框提示
			progress: 0, // 上传视频进度
			canClick: true, // 防止多次点击上传 
			toggleNav: Store.getInstance().info.upload.toggleNav, // 是否滚动到当前游览位置
			rule:  Store.getInstance().info.rule, // 上传规则
			showInput: Store.getInstance().index.title ? false : true, // 是否显示标题输入框
			editInput: false, // 是否编辑标题输入框
			loading: false, // 是否显示loading
			picData: Store.getInstance().index.picData ? Store.getInstance().index.picData : [], // 阿里云返回图片地址
			exifSrcData: [],
			aname: (Object.prototype.toString.call(Store.getInstance().index.aname) == '[object String]') && Store.getInstance().index.aname ? Store.getInstance().index.aname : '', // 活动名称
			fengImg: Store.getInstance().index.fengImg ? Store.getInstance().index.fengImg : '', // 封面图
			tagName: '', // 标签名称
			allAddress: Store.getInstance().index.allAddress ? Store.getInstance().index.allAddress : '', // 详细地址
			allInfo: {
				add_type: 1 , // 添加图片记录类型 1正常 2暂存
				title: Store.getInstance().index.title ? Store.getInstance().index.title : '', // 标题
				address: Store.getInstance().index.address ? Store.getInstance().index.address : '', // 地点
				aid: Store.getInstance().index.aid ? Store.getInstance().index.aid : '', // 活动id
				lat: Store.getInstance().index.lat ? Store.getInstance().index.lat : '', // 纬度
				lng: Store.getInstance().index.lng ? Store.getInstance().index.lng : '', // 经度
				country: Store.getInstance().index.country ? Store.getInstance().index.country : '', // 国家
				country_code: Store.getInstance().index.country_code ? Store.getInstance().index.country_code : '', // 国家编码
				province_code: Store.getInstance().index.province_code ? Store.getInstance().index.province_code : '', // 省码
				city_code: Store.getInstance().index.city_code ? Store.getInstance().index.city_code : '', // 市码
				district_code: Store.getInstance().index.district_code ? Store.getInstance().index.district_code : '', // 县（区）码
				province: Store.getInstance().index.province ? Store.getInstance().index.province : '', // 省
				city: Store.getInstance().index.city ? Store.getInstance().index.city : '', // 市
				district: Store.getInstance().index.district ? Store.getInstance().index.district : '', //县（区）
				source: 0, // 来源：0-pc 1-微信 2-微博
				pic_cnt: Store.getInstance().index.pic_cnt ? Store.getInstance().index.pic_cnt : '', // 图片数量
				tag: Store.getInstance().index.tag ? Store.getInstance().index.tag : {},
				media_type: Store.getInstance().index.media_type ? Store.getInstance().index.media_type : 1
			}, // 总体描述
			deletImg: {
				pic_id: ''
			}, // 需要被删除的图片id，字符串格式pic_id: '1, 2, 3'
		}
	}
	componentWillMount () {
		document.title = '发布'
	}
	componentDidUpdate () {
		if (this.state.editInput && this.state.showInput) {
			$('#inputTitle')[0].focus()
		}
		WeChatUtil.getInstance().set({'showShare':false});
		// 滚动到上次游览位置
		if (Store.getInstance().info.upload.scrollTop && this.state.toggleNav) {
			let top = Store.getInstance().info.upload.scrollTop
			this.state.toggleNav = false
			Store.getInstance().info.upload.toggleNav = false
			setTimeout(() => {
				$('body,html').animate({scrollTop: top}, 300)
			}, 500)
		}
	}
	componentDidMount () {
		// 标签名称
		if (Object.prototype.toString.call(this.state.allInfo.tag) == '[object Object]') {
			if (Object.keys(this.state.allInfo.tag).length > 0) {
				let tagName = []
				let tag = this.state.allInfo.tag
				for (let key in tag) {
					tagName.push(tag[key])
				}
				tagName = tagName.join(',')
				this.setState({
					tagName
				})
			}
		}
		// 判断来源
		let ua = navigator.userAgent.toLowerCase()
		if (ua.match(/MicroMessenger/i) == "micromessenger") {
			// 微信登录
			this.state.source = 1
		} else if (ua.indexOf('weibo') > -1) {
			// 微博登录
			this.state.source = 2
		}
		this.initPage(this.props)
		
	}
	componentWillReceiveProps (newProps) {
		this.initPage(newProps)
	}
	componentWillUnmount () {
		// 离开时记录游览位置
		let scrollTop = document.body.scrollTop || document.documentElement.scrollTop
		Store.getInstance().info.upload.scrollTop = scrollTop
		Store.getInstance().info.upload.toggleNav = true
	}
	// 初始化页面参数
	initPage = (props) => {
		this.checkTipsShow();
		this.state.allInfo.aid = props.location.query.aid?props.location.query.aid:this.state.allInfo.aid;
		if (this.state.allInfo.aid) {
			this.getBannerList()
		}
		// 草稿或者继续编辑的记录id
		let rid = props.location.query.rid
		let wType = props.location.query.wType

		if (rid) {
			this.state.rid = rid
			Store.getInstance().info.upload.rid = rid
		}
		console.log('缓存', Object.keys(Store.getInstance().index).length)
		console.log('缓存wType', wType)
		if (wType == 1) {
		
			if (Object.keys(Store.getInstance().index).length == 0) {
				this.bianji()
			}
		}
		if (Store.getInstance().info.upload.rid) {
			this.state.rid = Store.getInstance().info.upload.rid
		}
	}
	checkTipsShow=()=>{
		Store.getInstance().copyright_info.tips = Store.getInstance().copyright_info.tips.replace(/<p[^>]*><img/ig,'<img');
		if(window.localStorage['photo_activity_tips_id'+Store.getInstance().copyright_info.id]==JSON.stringify(Store.getInstance().copyright_info)||!Store.getInstance().copyright_info.tips){
			
		}else{
			if(Store.getInstance().copyright_info.tips.length>6){
				$('.info-all').addClass('disabled');
				this.setState({
					copyright_tips:Store.getInstance().copyright_info.tips
				});
				$('.copyright_tips_box').show(600);
			}
		}
	}
	/**
	 * [清空store数据]
	 */
	 initData = () => {
	 	// 清空store里的数据
		Store.getInstance().index = {}
		Store.getInstance().info.upload.scrollTop = 0
		Store.getInstance().info.upload.toggleNav = false
		Store.getInstance().info.rule.need_pic_desc = 0
		Store.getInstance().info.rule.need_pic_position = 0
		Store.getInstance().info.upload.rid = ''
	 }
	/**
	 * [继续编辑]
	 */
	bianji = (e) => {
		let _this = this
		let rid = this.state.rid
		let opt = {
			record_id: rid
		}

		Service.getStorage(opt).then(resp => {
			_this.setState({
				loading: false
			})
			
			switch (resp.code) {
				case 0:
					let caogao = resp.data.details
					let allInfo = this.state.allInfo
					let allInfoStore = Store.getInstance().index
					let fengImg = ''
					let tagName = []
					let allAddress = ''
					let tag = caogao.tag_list
					let rule = this.state.rule
					if (caogao.length == 0) {
						hashHistory.push({
							pathname: 'uploadpic'
						})
						this.showTips('该记录不存在, 请重新上传')
						this.setState({
							canClick: true
						})
						return
					}
					caogao.picture_list.forEach((item) => {

						item.pic_desc = item.pic_desc || item.pic_desc == "" ? item.pic_desc : item.video_desc
						item.pic_url = item.pic_url ? item.pic_url : item.video_url
						item.pic_id = item.pic_id ? item.pic_id : item.video_id
						
						item.focus == 1 ? fengImg = item.pic_url : ''
					})
					for (let key in tag) {
						tagName.push(tag[key])
					}
					allAddress = Commonfn.getAddress(caogao)
				
					tagName = tagName.join(',')
					allInfo.title = caogao.title
					allInfo.address = caogao.address
					allInfo.aid = caogao.aid
					allInfo.lat = caogao.lat
					allInfo.lng = caogao.lng
					allInfo.country = caogao.country
					allInfo.province = caogao.province
					allInfo.city = caogao.city
					allInfo.district = caogao.district
					allInfo.country_code = caogao.country_code
					allInfo.province_code = caogao.province_code
					allInfo.city_code = caogao.city_code
					allInfo.district_code = caogao.district_code
					allInfo.pic_cnt = caogao.pic_cnt
					allInfo.tag = caogao.tag_list
					allInfo.media_type = caogao.media_type

					rule.allow_media_type = caogao.media_type
					rule.show_title = caogao.show_title

					_this.setState({
						picData: caogao.picture_list,
						aname: caogao.activity_title,
						fengImg,
						tagName,
						allInfo,
						rule,
						allAddress,
						showInput: false
					})

					// 将记录写入store
					allInfoStore.title = caogao.title
					allInfoStore.address = caogao.address
					allInfoStore.aid = caogao.aid
					allInfoStore.aname = caogao.activity_title
					allInfoStore.lat = caogao.lat
					allInfoStore.lng = caogao.lng
					allInfoStore.country = caogao.country
					allInfoStore.province = caogao.province
					allInfoStore.city = caogao.city
					allInfoStore.district = caogao.district
					allInfoStore.country_code = caogao.country_code
					allInfoStore.province_code = caogao.province_code
					allInfoStore.city_code = caogao.city_code
					allInfoStore.district_code = caogao.district_code
					allInfoStore.pic_cnt = caogao.pic_cnt
					allInfoStore.tag = caogao.tag_list
					allInfoStore.picData = caogao.picture_list
					allInfoStore.fengImg = fengImg
					allInfoStore.allAddress = allAddress
					allInfoStore.media_type = caogao.media_type

					this.getBannerList()
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
	/**
	 * [获得banner数据列表]
	 */
	getBannerList = () => {
		let _this = this
		let opt = {
			aid: this.state.allInfo.aid
		}
		Service.getDetailsFocusList(opt).then((resp) => {
			this.setState({
				loading: false
			})
			switch (resp.code) {
				case 0:
					
					let rule = this.state.rule
					let allInfo = this.state.allInfo
					rule.need_pic_desc = resp.data.need_pic_desc
					rule.need_pic_position = resp.data.need_pic_position
					rule.allow_media_type = resp.data.allow_media_type
					rule.show_title = resp.data.show_title;
					allInfo.media_type = resp.data.allow_media_type
					_this.setState({
						allInfo,
						rule
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
	/**
	 * [删除图片]
	 * @param  imgID [被删除图片id字符串]
	 */
	deletImg = (imgID) => {
		if (this.state.rule.allow_media_type == 2) {
			let opt = {
				video_id: imgID
			}
			Service.deleteVideo(opt).then(resp => {
				switch (resp.code) {
					case 0:
						console.log('删除成功')
						break;
					case 111:
						Commonfn.aotoLogin()
						break;
					default:
						alert(resp.msg)
						break;
				}
			})
		} else {
			let opt = {
				pic_id: imgID
			}
			Service.deletImg(opt).then(resp => {
				switch(resp.code){
	                case 0:
	                    console.log('删除成功')
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
		
	}
	
	/**
	 * [清空store中存储的数据]
	 */
	clearStorage = () => {
		// 删除草稿中的图片
		let store = Store.getInstance().index
		for (let key in store) {
			if (key == 'picData' ) {
				store[key] = []
			} else {
				store[key] = ''
			}
		}

	}
	/**
	 * [弹框提示]
	 * [tips数据]
	 */
	showTips = (tips) => {
		this.setState({
			tips: tips,
			loading: false
		});
		let _this = this;
		setTimeout(function() {
			_this.setState({
				tips: ''
			});
		}, 4500);
	}
	/**
	 * [保存整个页面数据]
	 * [保存方式，正常1 暂存2]
	 */
	save = (e) => {
		if(!this.state.canClick) return
		this.setState({
			canClick: false
		})
		let _this = this
		let type = e.currentTarget.getAttribute("data-type")
		type == 1 ? this.state.allInfo.add_type = 1 : this.state.allInfo.add_type = 2
		let picData = [...this.state.picData]
		let allInfo = {...this.state.allInfo}
		let newPicData = [] // 用于过滤后的图片数据
		// 上传类型 media_type 1 图片 2 视频
		if (this.state.rule.allow_media_type == 2) {
			allInfo.media_type = 2
		} else {
			allInfo.media_type = 1
		}

		if (picData.length > 0) {
			// 过滤图片的属性，并增加 sort 表示顺序
			
			picData.forEach((item, index) => {
				let newItem = {}
				if (this.state.rule.allow_media_type == 2) {
					newItem['video_id'] = item.video_id ? item.video_id : item.pic_id
					newItem['video_desc'] = item.video_desc ? item.video_desc : item.pic_desc
				} else {
					newItem['pic_id'] = item.pic_id
					newItem['pic_desc'] = item.pic_desc
				}
				newItem['sort'] = index
				newItem['focus'] = item.focus
				

				newPicData.push(newItem)
			})
		}
		// 是否上传图片
			if (newPicData.length > 0) {
				// 封面不存在则将数组第一张当做封面
				this.state.fengImg ? '' : newPicData[0].focus = 1
				// 将修改过的图片数组整合到页面信息中
				Store.getInstance().index.pic_cnt = newPicData.length
				allInfo.pic_cnt = newPicData.length
				allInfo.pic = newPicData
				this.setState({
					loading: true
				})
			} else {
				if (this.state.rule.allow_media_type == 2) {
					this.showTips('请上传视频')
				} else {
					this.showTips('请上传图片')
				}
				this.setState({
					canClick: true
				})
				return
			}

		// 上传规则检测
		
		if (type == 1) {

			// 检测上传规则

			// 判断是否必需填写图片描述
		
			if (this.state.rule.need_pic_desc == 1) {
				let index = []
				newPicData.forEach((item, i) => {
					if (item.pic_desc == '' || item.video_desc == '') {
						index.push(i)
					}
				})
				if (index.length > 0) {
					this.showTips('请撰写说明')
					let i = index[0]
					let top = $($('.picItem')[i]).offset().top
					$('body,html').animate({
						scrollTop: top
					}, 300)
					$($('.picItem')[i]).find('textarea').css({
						'borderStyle': 'dashed',
						'borderColor': 'red',
						'borderWidth': '1px'
					})
					this.setState({
						canClick: true
					})
					return
				}
			}

			// 判断是否必需填写图片位置
			if (this.state.rule.need_pic_position == 1) {
				if (!this.state.allAddress && this.state.allInfo.lng == 0 && this.state.allInfo.lat == 0) {
					this.showTips('请填写拍摄地点')
					this.setState({
						canClick: true
					})
					return
				}
			}
		}
		
		// 如果页面存在记录id，则更新数据，否则添加数据
		if (this.state.rid) {
			// 更新数据到服务器
			allInfo.record_id = this.state.rid
			Service.updateRecord(allInfo).then(resp => {
				_this.setState({
					loading: false,
					canClick: true
				})
				switch (resp.code) {
					case 0:
						// 清空store里的数据
						this.initData()
						let rid = this.state.rid
						if (type == 1) {
							hashHistory.push({
								pathname: 'details',
								query: {
									rid
								}
							})
						} else if (type == 2) {
							hashHistory.push({
								pathname: 'caogao'
							})
						}
						break;
					case 111:
						Commonfn.aotoLogin()
						break;
					default:
						alert(resp.msg)
						break;
				}

			})
		} else {
			// 上传数据到服务器
			Service.addRecord(allInfo).then(resp => {
				_this.setState({
					loading: false,
					canClick: true
				})
				switch (resp.code) {
					case 0:
						// 保存这条数据的id，用于更新数据
						_this.state.rid = resp.data.rid
						// 清空store里的数据
						this.initData()
						let rid = resp.data.rid
						let aid = allInfo.aid
						if (type == 1) {
							hashHistory.push({
								pathname: 'details',
								query: {
									rid,
									aid
								}
							})
						} else if (type == 2) {
							hashHistory.push({
								pathname: 'caogao'
							})
						}
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
		
	}
	/**
	 * [将对象数组转换为json字符串]
	 * @param  objArr [对象数组]
	 */
	objArrToJson = (objArr) => {
		if (!Array.isArray(objArr)) {
			throw new Error("参数格式不正确")
		}
		const result = {}
		objArr.forEach((item) => {
			for (let i in item) {
				result[i] = item[i]
			}
		})
		return JSON.stringify(result)
	}
	/**
	 * [拿到exif信息]
	 * @param  file [文件数据]
	 */
	getExif = (file) => {
		let _this = this
		const promise = new Promise((resolve) => {
			EXIF.getData(file, function() {
				var allMetaData = _this.filterObj(EXIF.getAllTags(this), ["Make", "Model", "Orientation", "DateTime", "GPSLatitude", "GPSLongitude", "GPSLatitudeRef", "GPSLongitudeRef", "GPSAltitudeRef", "GPSAltitude"])
				let name = file.name.split('.')[0];
				let exifPic = {}
				exifPic[name] = allMetaData
				if(!Store.getInstance().index.lat){
					let lnglat = getGpsFromExif(allMetaData);
					
					Store.getInstance().index.lat = lnglat.lat;
					Store.getInstance().index.lng = lnglat.lng;
					_this.state.allInfo.lat = lnglat.lat;
					_this.state.allInfo.lng = lnglat.lng;
				}
				
				resolve(exifPic)
			})
		})
		return promise
	}
	/**
	 * [过滤对象]
	 * @param  obj [过滤前数据]
	 * @param  arr [过滤条件，要求为数组]
	 */
	filterObj = (obj, arr) => {
		if (typeof (obj) !== "object" || !Array.isArray(arr)) {
			throw new Error("参数格式不正确")
		}
		const result = {}
		Object.keys(obj).filter((key) => arr.includes(key)).forEach((key) => {
			result[key] = obj[key]
		})
		return result
	}

	/**
	 * [加载图片]
	 * @param  data [图片信息]
	 */
	showPic = (data) => {
		event.preventDefault()
		let files = data.files
		let fromData = new FormData()
		let exifData = []
		let result = [] // 存储多个promise对象
		let serverURL = window.location.href.split(".com/")[0] + '.com/'
		let serverPic = "https://cng-hd.oss-cn-beijing.aliyuncs.com/"
		let _this = this
		let index = data.getAttribute("data-index") // index如果存在，则是在更换图片
		this.setState({
			loading: true
		})
		console.log('ssssssssssssssssssss111111111', files[0])
		// 利用promise解决exif的异步问题
		for(let i =0; i < files.length; i++) {
			
			if (files[i].size < 30*1024*1024) {
				result.push(_this.getExif(files[i]))
				fromData.append('file[]', files[i])
			} else {
				this.setState({
					loading: false
				})
				this.showTips('图片大小不能超过30M，请压缩后上传')
			}
		}

		Promise.all(result).then((res) => {
			let exifStr = _this.objArrToJson(res)
			fromData.append('exif', exifStr)
			
			// 上传图片
			$.ajax({
				url: serverURL + 'picture/upload',
				type: 'POST',
				dataType: 'json',
				data: fromData,
				processData: false,
				contentType: false,
				success: function(res) {
					switch (res.code) {
						case 0:
							let picList = res.data.pic
							let picData = _this.state.picData
							if (picList.length > 0) {
								// 图片加上阿里云服务器地址
								picList.forEach((item) => {
									item.pic_url = serverPic + item.pic_url + '?x-oss-process=image/resize,w_' + Store.getInstance().clientWidth
									item.focus = 0
									item.pic_desc = ''
								})
								// index存在则更换当前序号图片，否则在当前图片后增加图片
								if (index) {
									picList.unshift(index+1, 0)
									Array.prototype.splice.apply(picData, picList)
								} else {
									picData = picData.concat(picList)
								}
								Store.getInstance().index.picData = picData
								Store.getInstance().index.pic_cnt = picData.length
								_this.state.allInfo.pic_cnt = picData.length
								_this.setState({
									picData,
									loading: false
								})

								// 清空input的值
								data.value = ''
							}
							break;
						case 111:
							Commonfn.aotoLogin()
							break;
						default:
							alert(resp.msg)
							break;
					}
				},
				error: function(data) {
					console.log('error', data)
					_this.setState({
						loading: false
					})
				}
			})
		})
	}
	/**
	 * [加载视频]
	 * @param  data [视频信息]
	 */
	showVideo = (data) => {
		event.preventDefault()
		let _this = this
		let files = data.files
		let fromData = new FormData()
		let serverURL = window.location.href.split(".com/")[0] + '.com/'
		let serverPic = "https://cng-video.oss-cn-beijing.aliyuncs.com/"
		this.setState({
			loading: true
		})
		
		if (files[0].size < 40*1024*1024) {
			fromData.append('file', files[0])
			// 上传图片
			$.ajax({
				url: serverURL + 'Picture/uploadVideo',
				type: 'POST',
				dataType: 'json',
				data: fromData,
				processData: false,
				contentType: false,
				xhr: function(e){

					 let myXhr = $.ajaxSettings.xhr();
					
					if (myXhr.upload) {
						myXhr.upload.addEventListener('progress', function(e){
							if (e.lengthComputable) {
								let progress = Math.floor(e.loaded/e.total*100)
								if (progress <= 100) {
									_this.setState({
										progress
									})
								}
							}
						}, false)
					}
					return myXhr
				},
				success: function(res) {
					switch (res.code) {
						case 0:
								let videoData =  res.data.video
								let focusImg =  {
									'pic_url': serverPic + videoData.video_focus,
									'pic_id': videoData.video_id,
									'focus': 0,
									'pic_desc': '',
									'pic_width': videoData.video_width,
									'pic_height': videoData.video_height,
								}
								let picData = _this.state.picData
								picData.push(focusImg)
								Store.getInstance().index.picData = picData
								_this.setState({
									picData,
									loading: false,
									progress: 0
								})

								// 清空input的值
								data.value = ''

							break;
						case 111:
							Commonfn.aotoLogin()
							break;
						default:
							alert(resp.msg)
							break;
					}
				},
				error: function(data) {
					console.log('error', data)
					_this.setState({
						loading: false
					})
				}
			})
		} else {			
			this.setState({
				loading: false
			})
			this.showTips('视频大小不能超过40M，请压缩后上传')
		}
		
	}
	handleDeletePic = (index, e) => {
		let picData = [...this.state.picData]
		let id = e.currentTarget.getAttribute("data-id")
		if (picData[index].focus == 1) {
			Store.getInstance().index.fengImg = ''
			this.setState({
				fengImg: ''
			}) 
		}
		picData = picData.filter((_, i) => i !== index)
		
		this.state.picData = picData
		if (picData.length == 0) {
			Store.getInstance().index.fengImg = ''
			this.setState({
				fengImg: ''
			}) 
		}

		Store.getInstance().index.picData = picData
		
		this.setState({
			picData
		})
		this.deletImg(id)
	}
	handleUp = (index) => {
		let picData = [...this.state.picData]
		if (index != 0) {
			let temp = picData[index - 1]
			picData[index - 1] = picData[index]
			picData[index] = temp
			
			this.setState({
				picData
			})
		} else {
			console.log("已经是第一张了")
			return
		}
	}
	handleDown = (index) => {
		let picData = [...this.state.picData]
		if (index != picData.length - 1) {
			let temp = picData[index + 1]
			picData[index + 1] = picData[index]
			picData[index] = temp
			this.setState({
				picData
			}) 
		} else {
			console.log("已经是最后一张了")
			return
		}
	}
	
	handlePicInfo = (index, e) => {
		let picData = [...this.state.picData]
		let value = e.target.value
		$($('.picItem')[index]).find('textarea').css({'border': 'none'})
		picData[index].pic_desc = value
		Store.getInstance().index.picData = picData
		this.setState({
			picData
		})
	} 
	goto = (e) => {
		let router = e.currentTarget.getAttribute("data-router")
		// 如果有活动id 则无法选择活动
		if (router == 'huodong' && this.state.allInfo.aid) {
			this.showTips('无法更改活动')
		} else {
			hashHistory.push(router)
		}
		
	}
	/**
	 * [输入标题]
	 */
	inputTitle = (e) => {
		this.state.allInfo.title = e.target.value;
		Store.getInstance().index.title = e.target.value;
		this.setState({
			allInfo:this.state.allInfo
		});
	}
	/**
	 * [点击输入标题]
	 */
	titleInput = () => {
		this.setState({
			showInput: true,
			editInput: true
		})
		
	}
	render() {
		return ( 
			<div className='uploadpic-main'>
				<div className='info-all'>
					<from name="editForm" method="post">
						{/*游览图片*/}
						{
							this.state.picData.length === 0 ?
							<div className='pic'>
								<div className='pic-box flex flex-center flex-ver-center'>
									<div className='pic-show flex flex-ver-center flex-column flex-center'>
										<img src="img/icon-photo.png"/>
										<div>{this.state.rule.allow_media_type == 2 ? '浏览视频' : '浏览图片'}</div>
									</div>
									
									{
										this.state.rule.allow_media_type == 2 ? 
										<input type="file"
										accept="video/*"
										ref="files"
										multiple={false}
										onChange={(e) => {this.showVideo(e.target)}}/> : 
										<input type="file"
										accept="image/*"
										ref="files"
										multiple={true}
										onChange={(e) => {this.showPic(e.target)}}/>
									}
								</div>
							</div> 
							:
							<div className='pic' data-router='fengmian' onClick={this.goto.bind(this)}>
								<div className='pic-box flex flex-center flex-ver-center' style={{backgroundImage:'url('+ this.state.fengImg +')'}}>
									{
										this.state.fengImg ? 
										<div className='pic-show pic-show-white flex flex-ver-center flex-column flex-center'>
											<img src="img/icon-addfengbai.png"/>
											<div>更改封面图</div>
										</div>
										:
										<div className='pic-show flex flex-ver-center flex-column flex-center'>
											<img src="img/icon-addfeng.png"/>
											<div>设置封面图</div>
										</div>
									}
								</div>
							</div>  
						}
						
						{/*图片及描述*/}
						<div className='showPic'>
						{
							this.state.picData.map((item, index) => {
								return (
										<div className='picItem' key={index}>
											<div className='picInfo'>
												<img className='icon-delete' src='img/baseline-delete_forever-24px.svg' data-id={item.pic_id} onClick={this.handleDeletePic.bind(this, index)} />
												{
													item.pic_height != 0 && item.pic_width != 0? 
													<img src={item.pic_url} /> :
													<div className='video-bg'>视频已上传，暂不支持播放</div>
												}
								   				<textarea onChange={this.handlePicInfo.bind(this, index)} placeholder={this.state.rule.need_pic_desc == 0 ? '撰写说明' : '撰写说明（必填）'} value={item.pic_desc}></textarea>
											</div>
											<div className='addPic'>
												<img src="img/icon-addPic.png"/>
												{
													this.state.rule.allow_media_type == 2 ? 
													<input type="file"
													accept="video/*"
													ref="files"
													multiple={false}
													onChange={(e) => {this.showVideo(e.target)}}/> : 
													<input type="file"
													accept="image/*"
													ref="files"
													multiple={true}
													onChange={(e) => {this.showPic(e.target)}}/>
												}
											</div>
										</div>
									)
							})
						}
						</div>
						{/*其他信息*/}
						<div className='info-part'>  
							{
								this.state.rule.show_title == 1 ? 
								<div className='info-item flex flex-space-between' onClick={this.titleInput}>
									<div className='item-left flex flex-ver-center'>
										<img src="img/icon-title.png"/>
										<span>标题</span>
									</div>
									<div className='item-right flex flex-ver-center'>
										<div>
											{
												this.state.showInput ? <input id='inputTitle' onBlur={() => {this.setState({showInput: false})}} type="text" value={this.state.allInfo.title} onChange={this.inputTitle.bind(this)} />
												 :
												 this.state.allInfo.title ? this.state.allInfo.title : ''
											}
											
										</div>
										<img src="img/icon-right.png"/>
									</div>
								</div> : <div style={{display: 'none'}}></div>
							}
							<div className='info-item flex flex-space-between' data-router='address' onClick={this.goto.bind(this)}>
								<div className='item-left flex flex-ver-center'>
									<img src="img/icon-title.png"/>
									<span>拍摄地点</span>
								</div>
								<div className='item-right flex flex-ver-center'>
									<div>
										{
											this.state.allAddress ? this.state.allAddress : ''
										}
									</div>
									<img src="img/icon-right.png"/>
								</div>
							</div>
							{
								this.state.rule.show_title == 1 ? 
								<div className='info-item flex flex-space-between' data-router='biaoqian' onClick={this.goto.bind(this)}>
									<div className='item-left flex flex-ver-center'>
										<img src="img/icon-title.png"/>
										<span>{this.state.rule.allow_media_type == 2 ? '选择视频标签' : '选择图片标签'}</span>
									</div>
									<div className='item-right flex flex-ver-center'>
										<div>
											{
												this.state.tagName? this.state.tagName : ''
											}
										</div>
										<img src="img/icon-right.png"/>
									</div>
								</div> : <div style={{display: 'none'}}></div>
							}
							<div className='info-item flex flex-space-between' data-router='huodong' onClick={this.goto.bind(this)}>
								<div className='item-left flex flex-ver-center'>
									<img src="img/icon-title.png"/>
									<span>参加活动</span>
								</div>
								<div className='item-right flex flex-ver-center'>
									<div>
										{
											this.state.aname? this.state.aname : ''
										}
									</div>
									<img src="img/icon-right.png"/>
								</div>
							</div>
						</div>
					</from>
					{
						this.state.progress > 0 ? 
						<div className="jindu flex">
							<div className='jindu-left' style={{width: this.state.progress + '%'}}></div>
							<div className='jindu-right'>{this.state.progress == 100 ? '上传成功，等待服务器处理' : '视频上传中'}</div>
						</div> : <div style={{display: 'none'}}></div>
					}
					{
						this.state.picData.length === 0 ? 
							<div className='bottom flex flex-ver-center flex-space-around'>
								
								<div className='caogao flex flex-ver-center flex-column flex-center'
								     data-type='2'
									 onClick={this.save.bind(this)}>
									<img src="img/icon-caogao.png"/>
									<span>保存草稿</span>
								</div>
								<div className='shangchuan flex flex-ver-center flex-column flex-center'
									 data-type='1'
									 onClick={this.save.bind(this)}>
									<img src="img/icon-shangchuan.png"/>
									<span>开始上传</span>
								</div>
							</div> 
							: 
							<div className='bottom2 flex flex-ver-center'>
								<div className='bottom-left flex flex-space-around'>
									<div className='bottom-item flex flex-ver-center flex-column flex-center'
										data-router='sort'
										onClick={this.goto.bind(this)}>
										<img src="img/icon-paixu.png"/>
										<span>排序</span>
									</div>
									<div className='bottom-item flex flex-ver-center flex-column flex-center'
									     data-type='2'
									     onClick={this.save.bind(this)}>
										<img src="img/icon-caogao.png"/>
										<span>暂存</span>
									</div>
								</div>
								<div className='bottom-right flex flex-ver-center flex-column flex-center'
								     data-type='1'
								     onClick={this.save.bind(this)}>
									<img src="img/icon-shangchuanwhite.png"/>
									<span>开始上传</span>
								</div>
							</div>
					}
					
					
				</div>
			
				
				{/*loading层*/}

				{
					this.state.loading ? <Loading></Loading> : ''
				}

				{/*弹框提示*/}
				<Tips words={this.state.tips}></Tips>
				<div className="copyright_tips_box" style={{display:'none'}}>
					<div className='copyright_tips'>
						<div className="copyright_tips_content">
							<div className="copyright_tips_title">请先阅读</div>
							<div className='copyright_tips_info' dangerouslySetInnerHTML={{__html: this.state.copyright_tips}}></div>
						</div>
						<div className="copyright_tips_bottombtn" onClick={()=>{
							$('.info-all').removeClass('disabled');
							window.localStorage['photo_activity_tips_id'+Store.getInstance().copyright_info.id]=JSON.stringify(Store.getInstance().copyright_info);
							$('.copyright_tips_box').hide(300);
						}}>知道了</div>
					</div>
				</div>
					
			</div>
		)
	}
}