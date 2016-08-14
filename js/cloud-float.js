/**
 * Created by congcong on 16/7/6.
 */
Vue.directive('cloud-float', {
    update: function (value) {
        var speed = value.speed || 100;
        var left = value.left || 0;
        var offset = 1;     //每次移动1个px
        var maxWidth = document.body.clientWidth;
        var ele = this.el;
        var eleWidth = ele.clientWidth;     //操作DOM
        var css = {};
        this.intervalId =  setInterval(function(){
            left += offset;  //一次增加一个px
            if(left > maxWidth){
                left = -eleWidth;
            }
            css = {
                left: left + 'px'
            };
            CssBuilder.cssSmartObject(ele,css,'px');
        },speed);
    },
    unbind: function(){
        clearInterval(this.intervalId);
    }
});