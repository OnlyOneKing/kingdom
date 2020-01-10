 export default class HttpRequest {
   static post(url, opt, format = 'json') {
     return new Promise(function(resolve, reject) {
       var oReq = new XMLHttpRequest();
       oReq.open("POST", url, true);
       oReq.onreadystatechange = function() {
         if (oReq.readyState === 4 && oReq.status === 200) {
           let result = oReq.responseText;
           if (format == 'json') {
             result = eval('(' + result + ')');
           }
           resolve(result);
         } else {
           // console.log("other not 200");
           //                console.error(oReq.statusText);
           //            	reject(oReq.statusText);
         }
       }
       oReq.onerror = function(e) {
         // console.log("error: ");
         //   	console.error(oReq.statusText);
         //      	reject(oReq.statusText);
       }
       oReq.send(opt);
     });
   }
   static get(url, opt, format = 'json') {
     return new Promise(function(resolve, reject) {
       var oReq = new XMLHttpRequest();
       let tempURL = url;
       if (opt) {
         for (let i in opt) {
           tempURL = urlParam(tempURL, i, opt[i])
         }
       }
       oReq.open("GET", tempURL, true);
       oReq.onreadystatechange = function() {
         if (oReq.readyState === 4 && oReq.status === 200) {
           let result = oReq.responseText;
           if (format == 'json') {
             result = eval('(' + result + ')');
           }
           resolve(result);
         } else {
           // console.log("other not 200");
           //                console.error(oReq.statusText);
           //            	reject(oReq.statusText);
         }
       }
       oReq.onerror = function(e) {
         // console.log("error: ");
         //   	console.error(oReq.statusText);
         //      	reject(oReq.statusText);
       }
       oReq.send(null);
     });
   }
 }
 const urlParam = function(url, name, value) {
   url += (url.indexOf('?') == -1) ? '?' : '&';
   url += encodeURIComponent(name) + "=" + encodeURIComponent(value);
   return url;
 }