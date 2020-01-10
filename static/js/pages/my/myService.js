import $ from 'jquery';
// import { encryptParam } from '../../../../../common/utils/simpleUtil.js';
let serverURL = window.location.href.split(".com/")[0] + '.com/';
export default {
    // 我的图片记录
    myPicture(opt){
        return $.post(serverURL + 'my/myPicture', opt);
    },
    // 草稿记录
    draftList(opt){
        return $.post(serverURL + 'my/draftList', opt);
    },
    // 收藏记录
    myCollect(opt){
        return $.post(serverURL + 'my/myCollect', opt);
    },
    // 草稿内容
    getStorage(opt){
        return $.post(serverURL + 'record/draftDetails', opt);
    },
    // 删除草稿
    deleteCaogao(opt){
        return $.post(serverURL + 'record/delRecord', opt);
    },
    // 我的页面数据
    getMy(opt){
        return $.get(serverURL + 'my/myPoints');
    },
    // 我的信息
    getMyInfo(opt){
        return $.get(serverURL + 'my/myInfo');
    },
    // 图片记录点赞/收藏
    handleInteract(opt){
        return $.post(serverURL + 'record/interact', opt);
    },
}