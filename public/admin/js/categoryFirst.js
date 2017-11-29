$(function() {

    // 全局查询参数
    var QueryPage = {
        page: 1,
        pageSize: 5,
        totalPage: 1
    }

    queryTopCategoryPaging(setPagintion);
    // 获取一级分类数据
    // /category/queryTopCategoryPaging
    function queryTopCategoryPaging(callback) {
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            data: QueryPage,
            success: function(result) {
                // 计算总页数
                QueryPage.totalPage = Math.ceil(result.total / QueryPage.pageSize);
                console.log(QueryPage);

                // 数据渲染
                var html = template("mainTbl", result);
                $(".cateTbl").html(html);
                callback && callback(result);
            }
        })

    }

    /* 
    分页:
    1 数据的总条数有关
    2 和页容量有关系 
    总条数 :  100
    页容量 : 5
    总页数:100/5=20   101/5= 21
    总页数:Math.ceil(总条数/页容量)
     */

    // 设置分页
    function setPagintion() {
        var options = {
            bootstrapMajorVersion: 3, // bootstrap的版本
            currentPage: QueryPage.page, //当前页数
            totalPages: QueryPage.totalPage, //总页数 注意不是总条数
            onPageClicked: function(e, oe, type, page) {
                //e 分页控件事件源 oe 被点击的对象 type 被点击的元素的类型 page 页面索引  

                QueryPage.page = page;
                queryTopCategoryPaging();
            }
        }
        $(".pagination").bootstrapPaginator(options);
    }


    $(".add_ok").click(function() {
        var categoryName = $.trim($(".categoryName").val());

        //非空验证
        if (!categoryName) {
            // 提示信息 
            // has-error 
            $(".categoryName").parent().addClass("has-error");
            return false;
        }

        // 发送请求
        addTopCategory(categoryName, function(result) {
            // 1 关闭对话框
            // 2 重新渲染数据
            $('#myModalAdd').modal('hide');
            queryTopCategoryPaging(setPagintion);

        });
    })

    function addTopCategory(categoryName, callback) {
        $.ajax({
            url: "/category/addTopCategory",
            type: "post",
            data: { categoryName: categoryName },
            success: function(result) {
                console.log("成功v");
                callback && callback(result);
            }
        })

    }

    // 添加分类 显示对话框
    $(".show_add_modal").click(function() {
        //  表单重置
        $(".categoryName").val("");
        $(".categoryName").parent().removeClass("has-error");

    })
})