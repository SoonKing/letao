$(function() {
    $(".loginBtn").on("tap", function() {
        //获取到用户名和密码

        var userName = $(".userTxt").val();
        var pwd = $(".pwdTxt").val();

        if (!$.trim(userName)) {
            mui.toast("请输入合法的用户名");
            return false;
        }
        if (!$.trim(pwd)) {
            mui.toast("请输入合法的密码");
            return false;
        }



        //发送ajax请求---登录
        $.ajax({

            url: "/user/login",
            type: "post",
            data: $("form").serialize(),
            success: function(result) {
                if (result.success) {
                    location.href = getUrlParam("returnUrl");
                } else {
                    mui.toast(result.massage);
                }

            }
        })
    })
});