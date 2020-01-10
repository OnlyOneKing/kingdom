/**
 * Created by CNG-laengyog on 2017/2/28.
 */
import StoreEvent from './base/storeEvent.js';
import Commonservice from './pages/commonservice.js';
export default class store {
    static getInstance() {
        if (!store.instance) {
            store.instance = new Object();
            store.instance.clientWidth = 480;
            store.instance.showLogin = false;
            // 首页
            store.instance.initIndex = function(obj) {
                store.instance.sindex = {
                    'index': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['推荐', '最新'],
                        'dataList': [], // 推荐数据列表
                        'picList': [], // 最新数据列表
                        'sonScroll': [0, 0], // 选项卡的滚动高度, 0 推荐 1 最新
                        'page': [1, 1], // 数据分页页码 0 推荐 1 已结束
                        'status': [false, false], // 是否能继续加载 0 推荐 1 最新
                        'toggleNav': false, // 是否自动滚到当前查看
                        'changeData': {
                            id: null,
                            zan: 0,
                            collect: 0
                        }, // 详情页跳回后改变的数据
                    },
                    'rank': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['今日热度榜', '本周热度榜', '当月热度榜'],
                        'dayList': [], // 今日数据列表
                        'weekList': [], // 本周数据列表
                        'monthList': [], // 当月数据列表
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 今日 1 本周 2 当月
                        'page': [1, 1, 1], // 数据分页页码 0 今日 1 本周 2 当月
                        'status': [false, false, false], // 是否能继续加载 0 今日 1 本周 2 当月
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'rankCopy': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['今日热度榜', '本周热度榜', '当月热度榜'],
                        'dayList': [], // 今日数据列表
                        'weekList': [], // 本周数据列表
                        'monthList': [], // 当月数据列表
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 今日 1 本周 2 当月
                        'page': [1, 1, 1], // 数据分页页码 0 今日 1 本周 2 当月
                        'status': [false, false, false], // 是否能继续加载 0 今日 1 本周 2 当月
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'competition': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['进行中', '已结束'],
                        'dataList': [], // 进行中数据列表
                        'picList': [], // 已结束数据列表
                        'sonScroll': [0, 0], // 选项卡的滚动高度, 0 进行中 1 已结束
                        'page': [1, 1], // 数据分页页码 0 进行中 1 已结束
                        'status': [false, false], // 是否能继续加载 0 进行中 1 已结束
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'competitionCopy': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['进行中', '已结束'],
                        'dataList': [], // 进行中数据列表
                        'picList': [], // 已结束数据列表
                        'sonScroll': [0, 0], // 选项卡的滚动高度, 0 进行中 1 已结束
                        'page': [1, 1], // 数据分页页码 0 进行中 1 已结束
                        'status': [false, false], // 是否能继续加载 0 进行中 1 已结束
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'competnoson': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['最新发布', '最受关注', '大赛说明'],
                        'dataList': [
                            [],
                            []
                        ], // 最新发布数据列表 0左侧数据 1右侧数据
                        'dataHeigth': [0, 0], // 最新发布数据高度 0左侧数据 1右侧数据
                        'picList': [
                            [],
                            []
                        ], // 最受关注数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最受关注数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 最新发布 1最受关注
                        'status': [false, false], // 是否能继续加载 0 最新发布 1最受关注
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'competnosonCopy': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['最新发布', '最受关注', '大赛说明'],
                        'dataList': [
                            [],
                            []
                        ], // 最新发布数据列表 0左侧数据 1右侧数据
                        'dataHeigth': [0, 0], // 最新发布数据高度 0左侧数据 1右侧数据
                        'picList': [
                            [],
                            []
                        ], // 最受关注数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最受关注数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 最新发布 1最受关注
                        'status': [false, false], // 是否能继续加载 0 最新发布 1最受关注
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'compethaveson': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['全部分组', '最新作品', '大赛说明'],
                        'dataList': [], // 全部分组数据列表
                        'picList': [
                            [],
                            []
                        ], // 最新作品数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最新作品数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 全部分组 1最新作品 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 全部分组 1最新作品
                        'status': [false, false], // 是否能继续加载 0 全部分组 1最新作品
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'compethavesonCopy': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['全部分组', '最新作品', '大赛说明'],
                        'dataList': [], // 全部分组数据列表
                        'picList': [
                            [],
                            []
                        ], // 最新作品数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最新作品数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 全部分组 1最新作品 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 全部分组 1最新作品
                        'status': [false, false], // 是否能继续加载 0 全部分组 1最新作品
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'collect': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['进行中', '已结束'],
                        'dataList': [], // 进行中数据列表
                        'picList': [], // 已结束数据列表
                        'sonScroll': [0, 0], // 选项卡的滚动高度, 0 进行中 1 已结束
                        'page': [1, 1], // 数据分页页码 0 进行中 1 已结束
                        'status': [false, false], // 是否能继续加载 0 进行中 1 已结束
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'collectCopy': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['进行中', '已结束'],
                        'dataList': [], // 进行中数据列表
                        'picList': [], // 已结束数据列表
                        'sonScroll': [0, 0], // 选项卡的滚动高度, 0 进行中 1 已结束
                        'page': [1, 1], // 数据分页页码 0 进行中 1 已结束
                        'status': [false, false], // 是否能继续加载 0 进行中 1 已结束
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'collectnoson': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['最新发布', '最受关注', '征集说明'],
                        'dataList': [
                            [],
                            []
                        ], // 最新发布数据列表 0左侧数据 1右侧数据
                        'dataHeigth': [0, 0], // 最新发布数据高度 0左侧数据 1右侧数据
                        'picList': [
                            [],
                            []
                        ], // 最受关注数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最受关注数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 最新发布 1最受关注
                        'status': [false, false], // 是否能继续加载 0 最新发布 1最受关注
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'collectnosonCopy': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['最新发布', '最受关注', '征集说明'],
                        'dataList': [
                            [],
                            []
                        ], // 最新发布数据列表 0左侧数据 1右侧数据
                        'dataHeigth': [0, 0], // 最新发布数据高度 0左侧数据 1右侧数据
                        'picList': [
                            [],
                            []
                        ], // 最受关注数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最受关注数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 最新发布 1最受关注
                        'status': [false, false], // 是否能继续加载 0 最新发布 1最受关注
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'collecthaveson': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['全部分组', '最新作品', '征集说明'],
                        'dataList': [], // 全部分组数据列表
                        'picList': [
                            [],
                            []
                        ], // 最新作品数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最新作品数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 全部分组 1最新作品 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 全部分组 1最新作品
                        'status': [false, false], // 是否能继续加载 0 全部分组 1最新作品
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                    'collecthavesonCopy': {
                        'currentlist': [],
                        'list': [],
                        'tabs': ['全部分组', '最新作品', '征集说明'],
                        'dataList': [], // 全部分组数据列表
                        'picList': [
                            [],
                            []
                        ], // 最新作品数据列表 0左侧数据 1右侧数据
                        'picHeigth': [0, 0], // 最新作品数据高度 0左侧数据 1右侧数据
                        'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 全部分组 1最新作品 2大赛说明
                        'page': [1, 1], // 数据分页页码 0 全部分组 1最新作品
                        'status': [false, false], // 是否能继续加载 0 全部分组 1最新作品
                        'toggleNav': false, // 是否自动滚到当前查看
                    }
                }
            }
            store.instance.initIndex()
            // 全部作品
            store.instance.initAllPhotos = function(obj) {
                store.instance.allPhotos = {
                    'index': -1,
                    'currentlist': [],
                    'list': [],
                    'tabs': ['全部', '精华'],
                    'dataList': [], // 推荐数据列表
                    'picList': [], // 最新数据列表
                    'sonScroll': [0, 0], // 选项卡的滚动高度, 0 推荐 1 最新
                    'page': [1, 1], // 数据分页页码 0 推荐 1 已结束
                    'status': [false, false], // 是否能继续加载 0 推荐 1 最新
                    'toggleNav': false, // 是否自动滚到当前查看
                }
            }
            store.instance.initAllPhotos();
            // 最美观景点列表
            store.instance.initZuimei = function(obj) {
                store.instance.zuiMei = {
                    'currentlist': [],
                    'list': [],
                    'tabs': ['进行中', '已结束'],
                    'dataList': [], // 进行中数据列表
                    'picList': [], // 已结束数据列表
                    'sonScroll': [0, 0], // 选项卡的滚动高度, 0 进行中 1 已结束
                    'page': [1, 1], // 数据分页页码 0 进行中 1 已结束
                    'status': [false, false], // 是否能继续加载 0 进行中 1 已结束
                    'toggleNav': false, // 是否自动滚到当前查看
                }
            }
            store.instance.initZuimei();
            // 最美观景点有分组
            store.instance.initZuimeiHaveson = function(obj) {
                store.instance.zuimeiHaveson = {
                    'currentlist': [],
                    'list': [],
                    'tabs': ['全部分组', '最新作品', '基本信息'],
                    'dataList': [], // 全部分组数据列表
                    'picList': [
                        [],
                        []
                    ], // 最新作品数据列表 0左侧数据 1右侧数据
                    'picHeigth': [0, 0], // 最新作品数据高度 0左侧数据 1右侧数据
                    'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 全部分组 1最新作品 2大赛说明
                    'page': [1, 1], // 数据分页页码 0 全部分组 1最新作品
                    'status': [false, false], // 是否能继续加载 0 全部分组 1最新作品
                    'toggleNav': false, // 是否自动滚到当前查看
                }
            }
            store.instance.initZuimeiHaveson();
            // 最美观景点无分组
            store.instance.initZuimeiNoson = function(obj) {
                store.instance.zuimeiNoson = {
                    'currentlist': [],
                    'list': [],
                    'tabs': ['最新发布', '最受关注', '基本信息'],
                    'dataList': [
                        [],
                        []
                    ], // 最新发布数据列表 0左侧数据 1右侧数据
                    'dataHeigth': [0, 0], // 最新发布数据高度 0左侧数据 1右侧数据
                    'picList': [
                        [],
                        []
                    ], // 最受关注数据列表 0左侧数据 1右侧数据
                    'picHeigth': [0, 0], // 最受关注数据高度 0左侧数据 1右侧数据
                    'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
                    'page': [1, 1], // 数据分页页码 0 最新发布 1最受关注
                    'status': [false, false], // 是否能继续加载 0 最新发布 1最受关注
                    'toggleNav': false, // 是否自动滚到当前查看
                }
            }
            store.instance.initZuimeiNoson();
            // 摄影基地列表
            store.instance.initPhotobase = function(obj) {
                store.instance.photobase = {
                    'currentlist': [],
                    'list': [],
                    'tabs': ['进行中', '已结束'],
                    'dataList': [], // 进行中数据列表
                    'picList': [], // 已结束数据列表
                    'sonScroll': [0, 0], // 选项卡的滚动高度, 0 进行中 1 已结束
                    'page': [1, 1], // 数据分页页码 0 进行中 1 已结束
                    'status': [false, false], // 是否能继续加载 0 进行中 1 已结束
                    'toggleNav': false, // 是否自动滚到当前查看
                }
            }
            store.instance.initPhotobase();
            // 摄影基地有分组
            store.instance.initPhotobaseHaveson = function(obj) {
                store.instance.photobaseHaveson = {
                    'currentlist': [],
                    'list': [],
                    'tabs': ['全部分组', '最新作品', '基本信息'],
                    'dataList': [], // 全部分组数据列表
                    'picList': [
                        [],
                        []
                    ], // 最新作品数据列表 0左侧数据 1右侧数据
                    'picHeigth': [0, 0], // 最新作品数据高度 0左侧数据 1右侧数据
                    'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 全部分组 1最新作品 2大赛说明
                    'page': [1, 1], // 数据分页页码 0 全部分组 1最新作品
                    'status': [false, false], // 是否能继续加载 0 全部分组 1最新作品
                    'toggleNav': false, // 是否自动滚到当前查看
                }
            }
            store.instance.initPhotobaseHaveson();
            // 摄影基地无分组
            store.instance.initPhotobaseNoson = function(obj) {
                store.instance.photobaseNoson = {
                    'currentlist': [],
                    'list': [],
                    'tabs': ['最新发布', '最受关注', '基本信息'],
                    'dataList': [
                        [],
                        []
                    ], // 最新发布数据列表 0左侧数据 1右侧数据
                    'dataHeigth': [0, 0], // 最新发布数据高度 0左侧数据 1右侧数据
                    'picList': [
                        [],
                        []
                    ], // 最受关注数据列表 0左侧数据 1右侧数据
                    'picHeigth': [0, 0], // 最受关注数据高度 0左侧数据 1右侧数据
                    'sonScroll': [0, 0, 0], // 选项卡的滚动高度, 0 最新发布 1最受关注 2大赛说明
                    'page': [1, 1], // 数据分页页码 0 最新发布 1最受关注
                    'status': [false, false], // 是否能继续加载 0 最新发布 1最受关注
                    'toggleNav': false, // 是否自动滚到当前查看
                }
            }
            store.instance.initPhotobaseNoson();
            // 收藏页
            store.instance.initShoucang = function(obj) {
                store.instance.shouCang = {
                    'shouCang': {
                        'dataList': [], // 推荐数据列表
                        'sonScroll': 0, // 选项卡的滚动高度
                        'page': 1, // 数据分页页码 
                        'status': false, // 是否能继续加载
                        'toggleNav': false, // 是否自动滚到当前查看
                    },
                }
            }
            store.instance.initShoucang();
            // 上传页
            store.instance.initUpload = function(obj){
                store.instance.index = {
                    // title: '', // 标题
                    // address: '', // 地点
                    //aid: '', // 活动id
                    // aname: '', // 活动名称
                    // lat: '', // 纬度
                    // lng: '', // 经度
                    // country: '', // country
                    // province: '', // 省
                    // city: '', // 市
                    // district: '', //县（区）
                    // "country_code":"45445",//国家编码
                    // "province_code":"454445",//省码
                    // "city_code":"45454",//市码
                    // "district_code":"45454",//县（区）码
                    // source: '', // 来源：0-pc 1-微信 2-微博
                    // pic_cnt: '', // 图片数量
                    // tag: {}, // 标签 obj key为标签id value为标签名称 如{'1': '图像摄影'}
                    // picData: [], // 图片数组
                    // fengImg: '', // 封面图
                    // allAddress: '', // 详细地址
                }
            }
            store.instance.initUpload();
            // 辅助信息
            store.instance.initInfo = function(obj) {
                store.instance.info = {
                    'upload': {
                        scrollTop: 0,
                        toggleNav: false,
                        rid: ''
                    },
                    'rule': {
                        need_pic_desc: 0, // 是否需要描述 0 不必需 1 必需
                        need_pic_position: 0, // 是否需要地点 0 不必需 1 必需
                    }
                }
            }
            store.instance.initInfo();
            store.instance.accusationList = '';
            store.instance.getAccusationList = function(){
                Commonservice.getAccusationList().then(resp=>{
                    switch(resp.code){
                        case 0:
                            store.instance.accusationList = [];
                            store.instance.accusationList.push([]);
                            resp.data.list.forEach(item=>{
                                store.instance.accusationList[0].push({
                                    "selected":0,
                                    "code": item.id,
                                    "name": item.type,
                                    "upid": "0"
                                });
                            });
                            console.log('store.instance.accusationList',store.instance.accusationList);
                        break;
                        default:
                            alert(resp.msg);
                        break;
                    }
                })
            }
            if(store.instance.accusationList==''){
                store.instance.getAccusationList();
            }
            store.instance.userinfo = '';
            store.instance.copyright_info = {
                id:'',
                tips:''
            };
        }
        return store.instance;
    }
}