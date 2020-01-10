import $ from 'jquery';
// import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
let serverURL = window.location.href.split(".com/")[0] + '.com/';
export default {
    // home(opt){
    //     return $.post(serverURL + 'index/home', encryptParam(opt));
    // },
    // 删除图片
    deletImg(opt){
        return $.post(serverURL + 'picture/deleteImg', opt);
    },
    // 上传并添加新数据
    addRecord(opt){
        return $.post(serverURL + 'record/addRecord', opt);
    },
    // 更新上传的数据
    updateRecord(opt){
        return $.post(serverURL + 'record/updateRecord', opt);
    },
    // 活动列表
    huodongList(){
        return $.get(serverURL + 'record/activityList');
    },
    // 标签列表
    biaoqianList(opt){
        return $.post(serverURL + 'tag/index', opt);
    },
    // 全部标签列表，用于联想
    biaoqianListAll(){
        return $.get(serverURL + 'tag/leIndex');
    },
    // 添加标签
    addTag(opt){
        return $.post(serverURL + 'tag/addTag', opt);
    },
    getRegion(opt){
        return $.post(serverURL + 'record/getRegion',opt);
    },
    // 草稿内容
    getStorage(opt){
        return $.post(serverURL + 'record/draftDetails', opt);
    },
    // 获取活动需要填写的自定义信息
    getField(opt){
        return $.post(serverURL + 'record/field', opt);
    },
    getFieldUserInfo(opt){
        return $.post(serverURL + 'record/fieldUserInfo',opt);
    },
    addUserInfo(opt){
        return $.post(serverURL + 'my/finishInfo',opt);
    },
    // 删除草稿
    deleteCaogao(opt){
        return $.post(serverURL + 'record/delRecord', opt);
    },
    // 活动详情焦点图列表
    getDetailsFocusList(opt){
        return $.post(serverURL + 'focus/detailsFocus', opt);
    },
    // 上传视频
    deleteVideo(opt){
        return $.post(serverURL + 'picture/deleteVideo', opt);
    },
}