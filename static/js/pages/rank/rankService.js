import $ from 'jquery';
// import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
let serverURL = window.location.href.split(".com/")[0] + '.com/';
export default {
    // 图片记录列表
    getRankList(opt){
        return $.post(serverURL + 'ranklist/rank', opt);
    },
    // banner列表
    getBannerList(opt){
        return $.post(serverURL + 'focus/index', opt);
    },
    getRecordLikeLog(opt){
    	return $.get(serverURL + 'ranklist/getRecordLikeLog',opt);
    },
    hotRecordRank(opt){
        return $.post(serverURL + 'ranklist/hotRecordRank',opt);
    }
}