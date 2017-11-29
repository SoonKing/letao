$(function() {

    var QueryPage = {
        page: 1,
        pageSize: 5,
        totalPage: 1
    };
    querySecondCategoryPaging(setPagintion);
    // 获取二级分类数据
    // /category/querySecondCategoryPaging
    function querySecondCategoryPaging(callback) {
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            data: QueryPage,
            success: function(result) {
                QueryPage.totalPage = Math.ceil(result.total / QueryPage.pageSize);
                // 渲染数据
                var html = template("mainTbl", result);
                $(".cateTbl").html(html);
                callback && callback(result);
            }
        })

    }

    function setPagintion() {
        var options = {
            bootstrapMajorVersion: 3, // bootstrap的版本
            currentPage: QueryPage.page, //当前页数
            totalPages: QueryPage.totalPage, //总页数 注意不是总条数
            onPageClicked: function(e, oe, type, page) {
                //e 分页控件事件源 oe 被点击的对象 type 被点击的元素的类型 page 页面索引  
                QueryPage.page = page;
                querySecondCategoryPaging();
            }
        }
        $(".pagination").bootstrapPaginator(options);
    }
    queryTopCategoryPaging();
    //  获取一级分类数据
    function queryTopCategoryPaging(callback) {
        $.ajax({
            url: "/category/queryTopCategoryPaging",
            data: { page: 1, pageSize: 1000 },
            success: function(result) {
                // <option value="2">韩国菜馆</option>
                var rows = result.rows;
                var arrStr = [];
                for (var i = 0; i < rows.length; i++) {
                    var element = rows[i];
                    arrStr.push('<option value="' + element.id + '">' + element.categoryName + '</option>');
                }
                $(".categoryId").html(arrStr.join(''));
            }
        })

    }

    // 开启表单验证
    $('form').bootstrapValidator({
            // 图标
            feedbackIcons: {
                valid: 'glyphicon glyphicon-ok',
                invalid: 'glyphicon glyphicon-remove',
                validating: 'glyphicon glyphicon-refresh'
            },
            excluded: [], // 验证 type=hidden类型的输入
            // 要验证的字段
            fields: {
                // 二级分类名称  智能监控到name属性
                brandName: {
                    // 用户名的提示信息
                    // message: 'The username is not valid',
                    validators: {
                        // 不能为空
                        notEmpty: {
                            message: '二级分类名称不能为空'
                        }
                    }
                },
                // 图片的路径 dom 隐藏域
                brandLogo: {
                    validators: {
                        // 不能为空
                        notEmpty: {
                            message: '请上传图片!!!'
                        }
                    }
                }
            }
        })
        .on('success.form.bv', function(e) {
            // 点击提交的时候  

            // 阻止默认提交事件
            e.preventDefault();
            // Get the form instance
            var $form = $(e.target);
            // 提交到后台
            // 成功的逻辑 
            $.ajax({
                url: "/category/addSecondCategory",
                type: "post",
                data: $form.serialize(),
                success: function(result) {
                    // 关闭对话框
                    $('#myModalAdd').modal('hide');
                    // 渲染数据 
                    querySecondCategoryPaging(setPagintion);
                }
            });
        });

    $('.fileupload').fileupload({
        dataType: 'json',
        done: function(e, data) {
            // data.result
            //  console.log(data.result);
            var src = data.result.picAddr;
            $("form img").attr("src", src);
            $("input[name='brandLogo']").val(src);

            // 通过验证 手动通过
            $('form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID');
        }
    });

    $(".show_add_modal").click(function() {
        /* 
        重置表单
        1 重置下拉框  
          a 给第一个option 选中
          b 
        2 重置输入框brandName
        3 清空隐藏域
         */

        $("#categoryId").html($("#categoryId").html());
        $("input[name='brandName']").val('');
        $("input[type='hidden']").val('');
        $("#addForm img").attr("src", "./images/none.png");
        $('form').data('bootstrapValidator').resetForm();
    })
})