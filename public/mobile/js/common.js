var MASK = mui.createMask(); //callback为用户点击蒙版时自动执行的回调；

function maskShow() {
    MASK.show();
    $(".lt_loading").show();

}

function maskClose() {
    MASK.close();
    $(".lt_loading").hide();
}