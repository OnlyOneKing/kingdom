/**
 * Created by CNG-laengyog on 2015/11/16.
 */
module.exports = {
    CONST:{
        SCENIC:1,
        SPOT:2,
        RECORD:3,
        TRIP:4,
        POI_COMMENT:5,
        RECORD_COMMENT:6,
        TRIP_COMMENT:7,
        TRACK:8,
        TOPIC:9
    },
    browser:{
        versions:function(){
            var u = navigator.userAgent, app = navigator.appVersion;
            return{
                trident: u.indexOf('Trident')>-1,//IE内核
                presto: u.indexOf('Presto')>-1,//opera内核
                webKit: u.indexOf('AppleWebKit')>-1,//苹果、谷歌内核
                gecko: u.indexOf('Gecko')>-1&& u.indexOf('KHTML')==-1,//火狐内核
                mobile:!!u.match(/AppleWebKit.*Mobile.*/),//是否为移动终端
                ios:!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),//ios终端
                android: u.indexOf('Android')>-1|| u.indexOf('Linux')>-1,//android终端或者uc浏览器
                iPhone: u.indexOf('iPhone')>-1|| u.indexOf('Mac')>-1,//是否为iPhone或者QQHD浏览器
                justIphone : u.indexOf('iPhone')>-1,
                iPad: u.indexOf('iPad')>-1,//是否iPad
                webApp: u.indexOf('Safari')==-1,//是否web应该程序，没有头部与底部
                weixin: u.toLowerCase().indexOf("micromessenger")>-1,//微信内置浏览器
                qqlive:u.toLowerCase().indexOf("qqlivebrowser")>-1,//腾讯视频内置浏览器
                weibo: u.toLowerCase().indexOf('weibo')>-1,//微博内置浏览器
                zhangtu: u.indexOf("zhangtu")>-1,//微信内置浏览器
                ios10 : u.match()
            };
        }()
    },
    isQQLive:function(){
        return this.browser.versions.qqlive;
    },
    isAndroid:function(){
        return this.browser.versions.android;
    },
    isJustIphone : function(){
      return this.browser.versions.justIphone;
    },
    isIphone:function(){
        return this.browser.versions.iPhone;
    },
    isReaddy:function(){
        return true;
    },
    isMobile:function(){
        return this.browser.versions.mobile||this.browser.versions.ios||this.browser.versions.android||this.browser.versions.iPhone||this.browser.versions.iPad;
    },
    isWXWB:function(){
        return this.browser.versions.weixin||this.browser.versions.weibo;
    },
    isZhangtu:function(){
        return this.browser.versions.zhangtu;
    },
    isWeibo:function(){
        return this.browser.versions.weibo;
    },
	isWX:function(){
		return this.browser.versions.weixin;
	},
    isIOS10 : function(){
        if((navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPod/i))) {
            // 判断系统版本号是否大于 9
            return Boolean(navigator.userAgent.match(/OS 10_\d[_\d]* like Mac OS X/i));
        } else {
            return false;
        }
    },
    addJsByLink:function(url){
        var doc=document;
        var link=doc.createElement("script");
        link.setAttribute("type", "text/javascript");
        link.setAttribute("src", url);

        var heads = doc.getElementsByTagName("head");
        if(heads.length){
            heads[0].appendChild(link);
        }else{
            doc.documentElement.appendChild(link);
        }
    },
    goURL:function(url){

    },
    ready:function(fun){
        var DOMContentLoaded = false;
        function DOMContentLoadedFun(){
            DOMContentLoaded = true;
            try{
                document.removeEventListener( "DOMContentLoaded", DOMContentLoadedFun, false );
                window.removeEventListener( "load", DOMContentLoadedFun, false );
            }catch(e){}
            try{
                document.detachEvent( "onreadystatechange", DOMContentLoadedFun );
                window.detachEvent( "onload", DOMContentLoadedFun );
            }catch(e){}
            try{
                if(fun!=undefined){
                    setTimeout( fun, 1 );
                }
            }catch(e){}

        }
        if ( document.readyState === "complete" ) {
            DOMContentLoadedFun();
        } else if ( document.addEventListener ) {
            document.addEventListener( "DOMContentLoaded", DOMContentLoadedFun, false );
            window.addEventListener( "load", DOMContentLoadedFun, false );

        } else {
            document.attachEvent( "onreadystatechange", DOMContentLoadedFun );
            window.attachEvent( "onload", DOMContentLoadedFun );
            var top = false;

            try {
                top = window.frameElement == null && document.documentElement;
            } catch(e) {}

            if ( top && top.doScroll ) {
                (function doScrollCheck() {
                    if ( !DOMContentLoaded ) {
                        try {
                            top.doScroll("left");
                        } catch(e) {
                            return setTimeout( doScrollCheck, 50 );
                        }
                        DOMContentLoadedFun();
                    }
                })();
            }
        }
    },
    onscroll:function(fun){
        fun();
        if(document.addEventListener){
            document.addEventListener("DOMMouseScroll" ,fun, false);
        }
        window.onscroll=document.onscroll=fun;
    },
    GetQueryString:function(name){
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    },
    lasyloadHtml:function(s){
        var htmlString = s;
        htmlString = htmlString.replace(/(<span[^>]*>)/ig,'').replace(/<\/span[^>]*>/ig,'').replace(/style=["'][^"']*["']/ig,'').replace(/<br\/>/ig,'');
        htmlString = htmlString.replace(/(<p[^>]*>[^<]*<img[^>]*>\s*)([^<])/ig,'$1</p><p>$2');
        htmlString = htmlString.replace(/([^>])\s*(<img)/ig,'$1</p><p>$2');
        htmlString = htmlString.replace(/\s+(src=["'])([^'"]*)["']/ig,' datasrc="$2" class="blur" src="$2@50w_1x.jpg?w"');
        htmlString = htmlString.replace(/src="@50w_1x\.jpg\?w"/ig,'src=""');
        htmlString = htmlString.replace(/(<div class="text-img-wrapper">\s*<img\s+[^>]*src=["'][^\s]*)\?w(["'][^>]*)/ig,'$1?w=16&h=9$2');
        htmlString = htmlString.replace(/(<p[^>]*>\s*)(<img\s[^>]*?src\s*=\s*['\"]([^'\"]*?)['\"][^>]*?>)(\s*<\/p>)/ig,'<div class="article-imgbox">$2<\/div>');
        console.log(htmlString);
        return htmlString;
    }
};
