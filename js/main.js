//页面加载完后执行
window.onload = function () {
    //初始化Swiper
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'vertical',
        loop: true,

        // 如果需要分页器
        pagination: '.swiper-pagination',

        // 如果需要前进后退按钮
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',

        // 如果需要滚动条
        scrollbar: '.swiper-scrollbar',
    });

}


var ccModule = angular.module('ccModule', []);
ccModule.controller('ccCtrl', ['$scope', function ($scope) {
    $scope.musicon = true;  //默认音乐开启

}]);


ccModule.directive('cloudFloat', ['$interval', '$document', function ($interval, $document) {
    return {
        restrict: 'AE',
        link: function (scope, element, attrs) {
            var maxWidth = $("body").width();
            var eleWidth = element.width();
            var left = 0;
            //var left = attrs.left;
            var offset = parseFloat(attrs.offset);
            var speed = attrs.speed;
            console.log("maxWidth = " + maxWidth);
            $interval(function () {
                console.log("left = " + left);
                left += offset;
                if (left > maxWidth) {
                    left = -eleWidth;
                }
                element.css({
                    left: left + "px"
                });
            }, speed);
        }
    };
}]);

ccModule.directive('cloudFloat1', ['$interval', '$parse', function ($interval, $parse) {
    return {
        restrict: 'AE',
        scope: {
            offset: '=',
            speed: '='
        },
        link: function (scope, element, attrs) {
            var parseFn = $parse(attrs.cloudFloat1);    //$parse解析，将字符串解析成JS表达式
            var result = parseFn();
            var maxWidth = $("body").width();
            var eleWidth = element.width();
            var offset = result.offset || 1;
            var speed = result.speed || 10;
            var left = result.left || 0;

            console.log("obj = " + result);
            console.log("offset = " + offset);
            console.log("speed = " + speed);

            $interval(function () {
                left += offset;
                if (left > maxWidth) {
                    left = -eleWidth;
                }
                element.css({
                    left: left + "px"
                });
            }, speed);
        }
    };
}]);