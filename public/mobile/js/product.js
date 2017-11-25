/* 下拉刷新的函数 */
mui.init({
    pullRefresh: {
        container: "#refreshContainer", //下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
        down: {
            height: 50, //可选,默认50.触发下拉刷新拖动距离,
            auto: true, //可选,默认false.首次加载自动下拉刷新一次
            contentdown: "下拉可以刷新", //可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover: "释放立即刷新", //可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh: "正在刷新...", //可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；  
            callback: function() {
                setTimeout(function() {
                    queryProductDetail(
                        function() {
                            //结束下拉刷新---最后传递参数
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
                            /* 輪播圖動起來 */
                            mui('.mui-slider').slider({
                                interval: 1000 //自动轮播周期，若为0则不自动播放，默认为0；
                            });
                            mui(".mui-numbox").numbox();
                        }
                    );
                }, 1000);
            }
        }
    }
});





/* 封装ajax的函数--查詢到需要的數據 */
function queryProductDetail(callback) {
    var id = getUrlParam("productId");
    $.ajax({
        url: "/product/queryProductDetail?id=" + id,
        success: function(result) {
            // console.log(result);
            /* split表示以什麼的方式分割字符串為數組 */
            var first = result.size.split("-")[0];
            var last = result.size.split("-")[1];
            var arr = [];
            for (var i = first; i <= last; i++) {
                arr.push(i);
            }

            result.sizeArr = arr;
            var html = template("mainTpl", result);

            $(".lt_view ul").html(html);
            callback && callback(result);
        }
    })
}




/* 使用事件委託的方式綁定事件---動態生成的標籤 */
$(".lt_view ul").on("tap", ".p_size", function() {
    $(this).addClass("active").siblings().removeClass("active");
})



//添加到購物車---点击事件
$(".add_cart").on("tap", function() {
    //首先判斷是否有尺寸,和數量

    var size = $(".p_size.active").html();
    var num = $(".mui-numbox-input").val();


    if (!size) {
        mui.toast("請選擇尺碼");
        return false;
    }
    if (num < 1) {
        mui.toast("請選擇數量");
        return false;
    }




    ///還有邏輯
    //添加到购物车----登陆后的购物车,需要登陆

    var option = {
        url: "/cart/addCart",
        type: "post",
        data: {
            productId: getUrlParam("productId"),
            num: num,
            size: size
        },

        success: function(result) {
            mui.confirm("是否要跳转到购物车页面", "添加成功", ["确认", "取消"], function(e) {
                // console.log(data);
                // console.log(e);
                if (e.index == 0) {
                    alert("跳转");

                } else if (e.index == 1) {

                }
            });
        }
    };
    LtAjax(option);

})