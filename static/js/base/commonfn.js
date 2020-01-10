import $ from 'jquery';
import StoreEvent from './storeEvent.js';
import Store from '../store.js';
import fn from './fn.js';
var autoLogin_loading = false
export default {
    // 自动登录， 微信，微博登录
    aotoLogin () {
        if (!autoLogin_loading) {
            autoLogin_loading = true
            let ua = navigator.userAgent.toLowerCase()
            let nUrl = window.location.href
            let serverURL = window.location.href.split(".com/")[0] + '.com/'
            if (window.location.href.match(/photo2/ig)) {
                $.get("http://photo2.dili365.com/user/test").then(() => {
                    window.location.href = window.location.href.split("?")[0] + '_k=lukucc';
                })
            }  else {
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    // 微信登录
                    let url = serverURL + 'user/login?' + 'type=wx&getRedirectUrl=' + encodeURIComponent(nUrl)
                    window.location.href = url
                } else if (ua.indexOf('weibo') > -1) {
                    // 微博登录
                    console.log('微博登录')
                    let url = serverURL + 'user/login?' + 'type=wb&getRedirectUrl=' + encodeURIComponent(nUrl)
                    window.location.href = url
                } else {
                    if(!Store.getInstance().showLogin){
                        console.log('请在微信或微博中打开')
                        Store.getInstance().showLogin = true;
                        StoreEvent.getInstance().fireEvents(["PC_LOGIN"]);
                    }
                }
            }

        }
        

    },
    // 时间格式转换
    simpleTimeEx: function(d) {
        if (d <= 0) {
            return 0;
        }
        let day = '',
            h = '',
            m = '',
            s = '';
        day = parseInt(d / 3600 / 24);
        day = day >= 0 ? day : 0;
        h = parseInt((d - day * 24 * 3600) / 3600);
        h = h >= 0 ? h : 0;
        m = parseInt((d - day * 24 * 3600 - h * 3600) / 60);
        m = m >= 0 ? m : 0;
        s = (d - day * 24 * 3600 - h * 3600 - m * 60);
        s = s >= 0 ? s : 0;
        let dd = day ? day : parseInt(day + 1);
        let hh = h ? h + '小时' : '';
        let mm = m ? m + '分' : '';
        let ss = s ? s + '秒' : '';
        // return dd + hh + mm + ss;
        return dd;
    },

    // 判断是否为数组
    isArray (o) {
        return Object.prototype.toString.call(o) == '[object Array]'
    },

    // 数值转换 10000 转换成 1w 1.5w  unit 单位
    numberToWan (number, unit) {
        let n = parseInt(number / 10000)
        let m = parseInt(number % 10000 / 1000)
        let num = 0
        if (n > 0) {
            if (m > 0) {
                num = n + '.' + m + unit 
            } else {
                num = n + unit
            }
        } else {
            num = number
        }
        return num
    },

    // 具体地址转换 opt{}, style '·'
    getAddress (opt) {
        let address = []
        if (opt.country) {
            address.push(opt.country)
        }
        if (opt.province) {
            address.push(opt.province)    
        }
        if (opt.city) {
            opt.city == '直辖区' ? opt.city = '' : address.push(opt.city)      
        }
        if (opt.district) {
            opt.district == '直辖县' ? opt.district = '' : address.push(opt.district)
        }
        if (opt.address) {
            address.push(opt.address)
        }
        address = address.join('·')
        return address
    },

    // 时间转换 转换规则类比朋友圈 小于一分钟显示刚刚 大于60分钟显示小时 大于24小时显示天数
    //  获取当前时间戳
    getUnix: function() {
        let date = new Date()
        return date.getTime()
    },
    //  获取今天0点0分0秒的时间戳
    getTodayUnix: function() {
        let date = new Date()
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date.getTime()
    },
    //  获取今年1月1日0点0分0秒的时间戳
    getYearUnix: function() {
        let date = new Date()
        date.setMonth(0)
        date.setDate(1)
        date.setHours(0)
        date.setMinutes(0)
        date.setSeconds(0)
        date.setMilliseconds(0)
        return date.getTime()
    },
    //  获取标准年月
    getLastDate: function(time) {
        let date = new Date(time)
        let month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        let day = date.getDate() + 1 < 10 ? '0' + (date.getDate() + 1) : date.getDate() + 1
        return date.getFullYear() + '-' + month + '-' + day
    },
    //  转换时间
    getFormatTime: function(timestamp) {
        let now = this.getUnix()
        let today = this.getTodayUnix()
        let year = this.getYearUnix()
        let timer = (now - timestamp) / 1000
        let tip = ''

        if (timer <= 0) {
            tip = '刚刚'
        } else if (Math.floor(timer / 60) <= 0) {
            tip = '刚刚'
        } else if (Math.floor(timer < 3600)) {
            tip = Math.floor(timer / 60) + '分钟前'
        } else if (timer >= 3600 && (timestamp - today >= 0)) {
            tip = Math.floor(timer / 3600) + '小时前'
        } else if (timer / 86400 <= 31) {
            tip = Math.floor(timer / 86400) + '天前'
        } else {
            tip = this.getLastDate(timestamp)
        }
        return tip
    }
}