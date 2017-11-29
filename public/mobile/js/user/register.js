 $(function() {
     //获取验证码
     var VCODE = null;

     //点击注册
     $(".registerBtn").on("tap", function() {
         console.log(123);
         //首先获取到前端页面输入的内容--存到一个对象中
         var data = {
             username: $.trim($(".mobile").val()),
             password: $.trim($(".password").val()),
             mobile: $.trim($(".mobile").val()),
             vCode: $.trim($(".vCode").val())
         };

         //设置正则验证---需要匹配的正则,可以上网百度
         if (!/^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/.test(data.mobile)) {
             mui.toast("请输入正确的手机号");
             return false;
         }

         //密码
         if (data.password.length < 6) {
             mui.toast("请输入合法的密码...");
             return false;
         }
         //两次密码的一致性
         if (data.password != $.trim($(".password2").val())) {
             mui.toast("两次密码不一致,请核实");
             return false;
         }

         // 验证认证码
         if (data.vCode.length != 6) {
             mui.toast("请输入合法的验证码");
             return false;
         }
         if (data.vCode !== VCODE) {
             mui.toast("验证码不正确");
             return false;
         }


         //提交数据到后台,完成验证
         $.ajax({
             url: "/user/register",
             type: "post",
             data: data,
             success: function(result) {
                 //  console.log(result);
                 if (result.success) {
                     mui.toast("註冊成功");
                     setTimeout(function() {
                         location.href = "login.html";
                     }, 1000);
                 }
                 if (result.error && result.error == 403) {
                     // 用户名已经存在
                     mui.toast(result.message);
                 }

             }
         })

     })


     //获取验证码
     $(".getCodeBtn").on("tap", function() {
         //mui內置的disabled表示不能點擊
         if ($(this).attr("disabled") == true) {
             return false;
         }
         //定義that=this在下方調用
         $(this).attr("disabled", true)
         var that = this;

         //修改文字提示
         $(that).html("正在發送");

         //發送ajax請求
         $.ajax({
             url: "/user/vCode",
             type: "get",
             success: function(result) {
                 //  console.log(result);

                 VCODE = result.vCode;
                 console.log(VCODE);
                 var time = 10;
                 var timeId = setInterval(function() {
                     time--;
                     $(that).html(time + "秒后再获取");
                     if (time === 0) {
                         clearInterval(timeId);
                         //  mui.toast(VCODE);
                         //移出屬性disabled
                         $(that).removeAttr("disabled");
                         $(that).html("获取认证码");
                     }
                 }, 1000)
             }
         })

     })

 })