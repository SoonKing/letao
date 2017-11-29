 $(function() {

     $(".category_menu").on("click", function() {
         $(this).find(".sub_menu").slideToggle();
     });

     /* 给 slide_menu注册点击事件*/
     $(".slide_menu").click(function() {
         // class的切换 --让左侧的侧边栏隐藏
         $(".lt_view").toggleClass("p0");

     })

     /* 点击登出按钮--发送ajax到后台 */
     $(".log_out_ok").click(function() {
         $.ajax({
             url: "/employee/employeeLogout",
             success: function(result) {
                 console.log(result);
                 if (result.success) {
                     location.href = "/admin/login.html";
                 }
             }
         })
     })
 })