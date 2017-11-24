;
$(function() {
    /* 刚开始先调用一次ajax请求渲染页面 */
    queryTopCate();

    function queryTopCate() {

        maskShow();
        $.ajax({
            url: "/category/queryTopCategory",
            success: function(result) {
                // <li><a href="#">1</a></li>
                /* 获取到的数据就是一个数组rows,包裹着对象 */
                var rows = result.rows;
                /* 定义一个数组,用来存储拼接的数据 */
                var strArr = [];
                /* 直接添加字符串也可以,但是会导致数据加载的速度变慢,造成空间的浪费 */
                // for (var i = 0; i < rows.length; i++) {
                //     $(".lt_menu>ul").append('<li><a href="#">' + rows[i].categoryName + '</a></li>');
                // }
                /* 数组的方式 --只是渲染一次,不会造成内存的浪费*/
                for (var i = 0; i < rows.length; i++) {
                    /* 在此处自定义一个 data-id  id的属性----第二次的数据渲染通过id找到对应的数据 */
                    strArr.push('<li data-id=' + rows[i].id + ' ><a href="#">' + rows[i].categoryName + '</a></li>');
                }
                // 把数组 变成字符串 [1,2,3,4] 1,2,3,4
                $(".lt_menu>ul").html(strArr.join(''));

                //一开始就调用二级目录的函数,渲染一次
                querySecondCategory(rows[0].id);

                /* 渲染完毕之后,将遮罩层关闭 */
                maskClose();
            }
        })
    }


    /* 二级目录的产品(通过id获取到数据--id通过第一次的自定义属性添加)---一样的封装为函数 */
    function querySecondCategory(id) {
        maskShow();
        $.ajax({

            url: "/category/querySecondCategory?id=" + id,
            success: function(result) {
                var rows = result.rows;

                // 判断要有数据再进去执行
                if (rows.length > 0) {
                    var strArr = [];
                    for (var i = 0; i < rows.length; i++) {
                        strArr.push('<li><a href="javascript:;"><img src="' + rows[i].brandLogo + '" alt=""><p>' + rows[i].brandName + '</p></a></li>');
                    }

                    $(".lt_content>ul").html(strArr.join(''));
                } else {
                    //没有数据就直接提示用户,没有数据了
                    $(".lt_content>ul").html('没有数据了');
                }

                maskClose();

            }
        })
    }
    //给li标签一个点击事件,将自己的id传递到后台,是二级目录的数据找到对应的id-------因为li标签是动态生成的,所以使用事件委托
    $(".lt_menu>ul").on("tap", "li", function() {

        var id = $(this).data("id");
        //点击的时候调用二级目录的渲染--并且传递id
        querySecondCategory(id);
    })




});