import $ from 'jquery';
// import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
let serverURL = window.location.href.split(".com/")[0] + '.com/';
export default {
    // 获得图片详情
    recordDetails(opt){
        return $.post(serverURL + 'record/recordDetails', opt);
    },
    // 获得评论列表
    getComment(opt){
        return $.post(serverURL + 'comment/index', opt);
    },
    // 图片记录点赞/收藏
    handleInteract(opt){
        return $.post(serverURL + 'record/interact', opt);
    },
    handleVote(opt){
        return $.post(serverURL + 'record/recordVote',opt);
    }
}