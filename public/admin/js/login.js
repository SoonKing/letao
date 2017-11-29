  /* 查找bootstrap组件--表单验证 */
  $(function() {
      $('form').bootstrapValidator({
              // 图标
              feedbackIcons: {
                  valid: 'glyphicon glyphicon-ok',
                  invalid: 'glyphicon glyphicon-remove',
                  validating: 'glyphicon glyphicon-refresh'
              },
              // 要验证的字段
              fields: {
                  // 用户名 input 标签 的 name属性 
                  username: {
                      // 验证规则
                      validators: {
                          // 不能为空
                          notEmpty: {
                              message: '用户名不能为空'
                          },
                          // 提供给ajax回调使用
                          callback: {
                              message: "用户名不存在"
                          }
                      }
                  },
                  password: {
                      // 用户名的提示信息
                      // message: 'The username is not valid',
                      validators: {
                          // 不能为空
                          notEmpty: {
                              message: '密码不能为空'
                          },
                          // 长度 
                          stringLength: {
                              min: 6,
                              max: 18,
                              message: '密码长度为6-18'
                          },
                          // 提供给ajax回调使用
                          callback: {
                              message: "密码错误"
                          }
                      }
                  }
              }
          })
          // 注册点击的事件
          .on('success.form.bv', function(e) {
              // 点击提交的时候  

              // 阻止默认提交事件
              e.preventDefault();
              // Get the form instance
              var $form = $(e.target);
              // 提交到后台

              $.ajax({
                  url: "/employee/employeeLogin",
                  type: "post",
                  data: $form.serialize(),
                  success: function(result) {
                      console.log(result);
                      if (result.error && result.error == 1000) {
                          // 用户名不存在
                          // 手动调用验证提示 updateStatus("要更新的字段","验证状态","提示信息")
                          $form.data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
                      } else if (result.error && result.error == 1001) {
                          // 密码错误
                          $form.data("bootstrapValidator").updateStatus("password", "INVALID", "callback");
                      } else if (result.success) {
                          // 登录成功 
                          location.href = "/admin/index.html";
                      }
                  }
              })
          });

      // 开启进度条
      $(window).ajaxStart(function() {
          NProgress.start();
      });
      //  结束进度条
      $(window).ajaxStop(function() {
          NProgress.done();
      });
      console.log($("button[type='submit']")[0]);

  })