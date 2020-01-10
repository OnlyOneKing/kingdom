import $ from 'jquery';
// import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
let serverURL = window.location.href.split(".com/")[0] + '.com/';
export default {
    // home(opt){
    //     return $.post(serverURL + 'index/home', encryptParam(opt));
    // },
    // 删除图片
    deletImg(opt){
        return $.post(serverURL + 'index/deleteImg', opt);
    },
    // 上传并添加新数据
    addRecord(opt){
        return $.post(serverURL + 'record/addRecord', opt);
    },
    // 更新上传的数据
    updateRecord(opt){
        return $.post(serverURL + 'record/updateRecord', opt);
    },
    getAccusationList(opt){
        return $.get(serverURL + 'My/complainType?page=1&limit=100');
    },
    accusate(opt){
        return $.post(serverURL + 'my/complain',opt)
    },
    // 我的信息
    getMyInfo(opt){
        return $.get(serverURL + 'my/myInfo');
    },

}