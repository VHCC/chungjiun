onmessage = function(e) {
    var res = e.data;
    postMessage(res); // 將 res 回傳
}