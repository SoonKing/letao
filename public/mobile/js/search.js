$(function() {
    loadHistory();

    /* 先从本地读取localstorage   key LT_his   value  []
    2.获取
    */
    function loadHistory() {
        var ls = localStorage;
        //有数据就获取数据 转为对象格式  没有就获取空数组
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];

        /* 判断有没有数据 */
        if (arr.length < 1) {
            /* 每一次判断完毕之后都清空 */
            $(".history_list").html('');
            return;
        }

        //加载数组
        var strArr = [];
        for (var index = 0; index < arr.length; index++) {
            strArr.push('<div class="hl_item mui-clearfix"> <span class="item_font">' +
                arr[index] + '</span> <span class="item_close mui-icon mui-icon-closeempty"></span> </div>')
        }

        //渲染列表数据
        $(".history_list").html(strArr.join(''));
    }



    /* 
    点击搜索按钮
    1.获取val
    2.判断是否为空
    3.存到localstorage中
    4.获取存到localstorage中的数组
    5.数组.push(val)  去掉重复的内容
    6.把数组转换为json存到localstorage
    */
    $('.searchBtn').on("tap", function() {
        var val = $(".searchTxt").val();
        /* 去掉可能存在的空格 */
        if (!$.trim(val)) {
            return false;
        }

        var ls = localStorage;

        // 有数据就获取数据 无 就获取空数组 !! 
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];

        //去掉重复
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                //删除掉就得数据,添加新的在数组的开头
                arr.splice(i, 1);
            }
        }
        //添加到数组的开头
        arr.unshift(val);
        ls.setItem("LT_his", JSON.stringify(arr));


        loadHistory();

    })


    //清空按钮的操作
    $(".clearBtn").on("tap", function() {

            localStorage.setItem("LT_his", JSON.stringify([]));
            $(".searchTxt").html("");
            loadHistory();
        })
        /* 事件委托的方式删除每一个 */
    $("body").on("tap", ".item_close", function() {

        //获取父元素的索引
        var index = $(this).parent().index();

        var ls = localStorage;
        var arr = (ls.getItem("LT_his") && JSON.parse(ls.getItem("LT_his"))) || [];
        // 删除数组中的元素
        arr.splice(index, 1);

        //存值
        ls.setItem("LT_his", JSON.stringify(arr));

        //重新渲染
        loadHistory();

    })


});