import $ from 'jquery';
// import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
let serverURL = window.location.href.split(".com/")[0] + '.com/';
export default {
    // 图片记录列表
    getDataList(opt){
        return $.post(serverURL + 'activity/index', opt);
    },
    // 获得服务器时间
    getConfig(){
        return $.get(serverURL + 'index/config');
    },
    // banner列表
    getBannerList(opt){
        return $.post(serverURL + 'focus/index', opt);
    },
    // 活动详情焦点图列表
    getDetailsFocusList(opt){
        return $.post(serverURL + 'focus/detailsFocus', opt);
    },
    // 子分组列表
    getSonActivityList(opt){
        return $.post(serverURL + 'activity/sonActivityIndex', opt);
    },
    // 图片记录列表
    getPicList(opt){
        return $.post(serverURL + 'activity/sonRecordList', opt);
    },
}