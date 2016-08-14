/**
 * Created by johnny on 16/1/19.
 */


var am = new SmartJS.EasyAnimationManager({single: true});
var skipResize = false;

var init = {};
//init.type='TXGAME'
init.type = 'SDK';
var share = new SmartJS.Share.WechatShare(init);


angular.module("smart", []).controller('smart_ctrl', ['$scope', '$http', function ($scope, $http) {

    $scope.currentMenu=0;


    var SinglePage=new SmartJS.Dom('.menu_btn');
    SinglePage.smartTransition({property: "all", duration: '400ms', delay: '1ms', func: "easeInOut"});

    $scope.goMenu=function(menu){
        console.log(menu);
        $scope.currentMenu=menu;
    };
    $scope.showPopUp=function(id){
        var content=$(id);

        //console.log(content.html());
        $.dialog({//closeIcon: true,
            closeIcon: true,
            title: false, content: content.html(), columnClass: 'pop_up',
            backgroundDismiss:true
            //confirm: function () {
            //    console.log(data);
            //},
            //cancelButton: '取消', confirmButton:'确定'
        });
    };

    $scope.goMenu(0);

}]);


$(document).ready(function () {
   // SmartJS.Device.removeSafariDefaultMove('#stage');
    SmartJS.FastClick('body');
    //动画效果结束
    //function onResize() {
    //    if (skipResize) {
    //        return;
    //    }
    //
    //    var page = $('.page');
    //
    //    page.css(SmartJS.Css.transformOriginObject(0, 0, '%'));
    //    var nsize = new SmartJS.Size(0, 0, 750, 1334).fillInRec(new SmartJS.Dom(window).size());
    //    page.css(SmartJS.Css.transformObject(nsize));
    //
    //
    //    var in_page = $('.in_page');
    //    in_page.css({width: '750px', height: '1334px'});
    //    in_page.css(SmartJS.Css.transformOriginObject(0, 0, '%'));
    //    nsize = new SmartJS.Size(0, 0, 750, 1334).fixInRec(new SmartJS.Dom(window).size());
    //    in_page.css(SmartJS.Css.transformObject(nsize));
    //
    //
    //}
    //
    //
    //onResize();
    //$(window).resize(onResize);
});