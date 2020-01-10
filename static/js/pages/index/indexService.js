import $ from 'jquery';
// import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
let serverURL = window.location.href.split(".com/")[0] + '.com/';
export default {
    // 图片记录列表
    getDataList(opt){
        return $.post(serverURL + 'record/index', opt);
    },
    // banner列表
    getBannerList(opt){
        return $.post(serverURL + 'focus/index', opt);
    },
}