;
$(function() {
    /* 设置全局参数的查询对象 */
    var queryObj = {
        proName: "",
        brandId: "",
        price: "",
        num: "",
        page: 1,
        pageSize: 4
    };
    /* 设置上面的参数为--之前传递来的数据 */
    queryObj.proName = getURLParams("key");

    //设置总条数
    var Count = 1;

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

                        /* 在这个时候发送ajax请求 */
                        queryObj.page = 1;

                        queryProduct(function(result) {
                            // console.log(result);
                            Count = result.count;
                            var html = template("prolistTpl", result);
                            $(".lt_product_list").html(html);
                            //结束下拉刷新---最后传递参数
                            mui('#refreshContainer').pullRefresh().endPulldownToRefresh(false);
                            //重置上拉控件的用户提示
                            mui('#refreshContainer').pullRefresh().refresh(true);
                        });

                    }, 1000);
                }
            },
            up: {
                height: 50, //可选.默认50.触发上拉加载拖动距离
                auto: true, //可选,默认false.自动上拉加载一次
                contentrefresh: "正在加载...", //可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore: '没有更多数据了', //可选，请求完毕若没有更多数据时显示的提醒内容；

                //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；  
                callback: function() {

                    /* 上啦加载下一页,并且判断页数和每页的数据 */
                    /* 上拉的时候,要判断有多少页,每一页显示多少 */
                    var totalPage = Math.ceil(Count / queryObj.pageSize);
                    setTimeout(function() {

                        // 判断页数
                        if (queryObj.page < totalPage) {
                            //继续请求数据
                            queryObj.page++;
                            queryProduct(function(result) {

                                var html = template("prolistTpl", result);
                                /* 此时是将获取到的数据追加到模板中 */
                                $(".lt_product_list").append(html);
                                //有数据传入的时候下拉的时候传入false  

                                mui('#refreshContainer').pullRefresh().endPullupToRefresh(false);
                            })
                        } else {
                            //没有数据继续 传入,则传入true  提示用户数据已经加载完毕
                            mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                        }

                    }, 1000);
                }
            }
        }
    });

    /* 封装发送请求的函数-获取数据(将回调函数当成参数传递进去--可以根据自己的需求更改) */
    function queryProduct(callback) {
        $.ajax({
            url: "/product/queryProduct",
            data: queryObj,
            success: function(result) {
                callback && callback(result);
            }
        });
    }

    //封装 获取url上的参数的 函数
    function getURLParams(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }

    //给搜索按钮注册事件----点击搜索的时候,触发页面的搜索显示和刷新
    $(".searchBtn").on("tap", function() {
        var val = $(".searchTxt").val();

        if (!$.trim(val)) {
            // 用户提示 请输入关键字
            mui.toast("请输入关键字");
        } else {
            queryObj.proName = val;
            // queryProduct();
            //  console.log( mui('#refreshContainer').pullRefresh().pullLoading);

            // 手动触发下拉 
            mui("#refreshContainer").pullRefresh().pulldownLoading();
        }
    })



    /* 点击a标签排序 */
    $('.lt_sort_bar>a').on("tap", function() {
        //
        $(this).addClass("active").siblings().removeClass("active");

        /* 设置箭头的方向
        <span class="mui-icon mui-icon-arrowdown"></span> 

        mui组件中的方法
        */
        $(this).find(".mui-icon").toggleClass("mui-icon-arrowdown mui-icon-arrowup");
        /* 设置sort的值来控制箭头的方向 */

        var sort = -1;
        if ($(this).find(".mui-icon").hasClass("mui-icon-arrowup")) {
            //如果存在arrowup属性则是升序,反之就是降序
            sort = 1;
        } else {
            sort = 2;
        }
        //此处将sort传递到价格和数量中去

        if ($(this).data("sortname") == "price") {
            queryObj.price = sort;
            queryObj.num = "";
        }

        if ($(this).data("sortname") == "num") {
            queryObj.num = sort;
            queryObj.price = "";
        }

        /* 再次下拉刷新 */
        mui("#refreshContainer").pullRefresh().pulldownLoading();


    })

});