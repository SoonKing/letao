var MASK = mui.createMask(); //callback为用户点击蒙版时自动执行的回调；

function maskShow() {
    MASK.show();
    $(".lt_loading").show();

}

function maskClose() {
    MASK.close();
    $(".lt_loading").hide();
}

$('body').on("tap", "a", function() {
    location.href = $(this).attr("href");
})



function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}





LtAjax = function(option) {
    $.ajax({
        url: option.url,
        type: option.type || "get",
        data: option.data || "",
        success: function(result) {
            if (result.success) {
                option.success && option.success(result);
            } else if (result.error == 400) {
                // 跳转到登录页面
                // location.href="/mobile/user/login.html";
                location.href = "user/login.html?returnUrl=" + location.href;
            }
        }
    });
}