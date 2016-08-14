/**
 * Created by congcong on 16/7/15.
 */

    ////全局变量gv,必须是对象或数组类型(引用类型),这样才能被vue实例中的data钩子所引用
    //var gv = {
    //    currentPage: 1     //默认显示首页 即第1页
    //};

Vue.directive('trans', {
    update: function (val) {
        var className = this.el.className;
        var str = className.match(/\b([0-9A-Za-z-]+)-transition\b/g);
        var transName = RegExp.$1;
        var cssObj = val;
        var ext = cssObj.ext || '%';     //默认单位是px
        delete cssObj.ext;
        _.each(cssObj, function (v, k) {
            CssBuilder.createCssObject('.' + transName + '-' + k, v, ext);
        });
    }
});

Vue.directive('anim', {
    update: function (val) {
        var name = '';
        var time = '';
        var timeFn = '';
        var loop = '';
        var ext = 'px';     //默认单位是px
        var frames = {};    //obj, required!
        //取得frames对象
        if (val.frames instanceof Array) {  // val.frames is [Object Array]
            console.log('frame is array = ' + val.frames);
            var length = val.frames.length;
            var lastArg = val.frames[length - 1];
            var key = '';
            if (typeof lastArg === 'string') {
                ext = lastArg;
                val.frames.splice(length - 1, 1);
                length -= 1;
            }
            for (var i = 0; i < length; i++) {
                key = (i / (length - 1) * 100).toFixed(1) + '%';
                frames[key] = val.frames[i];
            }
            frames['ext'] = ext;
        } else {     // val.frames is [Object Object]
            frames = val.frames;
        }
        //取得animation的css字符串
        if (val.animation != undefined) {
            var str = val.animation;
            var strArray = str.split(' ');
            name = strArray[0];
            time = strArray[1] || '1s';
            timeFn = strArray[2] || 'linear';
            loop = strArray[3] || 'infinite';
        } else {
            name = val.name;    // string, can be null or undefined
            time = val.time || '1s';
            timeFn = val.timeFn || 'linear';
            loop = val.loop || 'infinite';
        }
        console.log('frames = ' + JSON.stringify(frames));

        var anim = CssBuilder.Animations.create(name, frames);
        this.el.style.animation = anim.name + ' ' + time + ' ' + timeFn + ' ' + loop;
    }
});

Vue.directive('clip-loop', {
    update: function (val) {
        var id = val.id || 'interval';
        var speed = val.speed || 300;   //默认播放速度300ms
        var count = val.count || 1;
        var index = val.index || 1;
        var play = true;
        if (val.play === false) {
            play = false;
        }
        var el = this.el;
        var vm = this.vm;   //指令上下文的vue实例对象
        var idName = 'clipLoopId_' + id;
        this.idName = idName;   //为了unbind函数也能用


        if (play === true) {
            //初次创建
            if (vm[idName] === undefined) {
                vm[idName] = {intervalId: 0, i: 0, els: []};   //初始化cliploop对象
                vm[idName]['els'][index] = el;     //添加元素
                vm[idName]['intervalid'] = setInterval(function () {       //开启interval任务,setInterval是window对象的方法
                    vm[idName]['i']++;
                    if (vm[idName]['i'] > count) {
                        vm[idName]['i'] = 1;  //clip index [1,count]
                    }
                    if (vm[idName]['i'] == 1) {
                        vm[idName]['els'][count].style.display = 'none';
                        vm[idName]['els'][1].style.display = 'block';
                    } else {
                        vm[idName]['els'][vm[idName]['i'] - 1].style.display = 'none';
                        vm[idName]['els'][vm[idName]['i']].style.display = 'block';
                    }
                }, speed);

            }
            //不是初次创建
            vm[idName]['els'][index] = el;       //添加元素
        }

        if (play === false) {
            if (vm[idName] !== undefined) {       //如果创建了 则删除
                clearInterval(vm[idName]['intervalid']);
                delete vm[idName];
            }
        }
    },
    unbind: function () {
        var idName = this.idName;
        var vm = this.vm;
        if (vm[idName] !== undefined) {
            clearInterval(vm[idName]['intervalid']);
            delete vm[idName];
        }
    }

});


    Vue.directive('resize-fill', {
        update: function (val) {
            var el = this.el;
            var width, height, containerWidth, containerHeight;
            setTimeout(function () {
                if (val) {
                    if (val.width) {
                        width = val.width;
                        CssBuilder.css(el,{width:width+'px'});
                    } else {
                        width = el.clientWidth;
                    }
                    if (val.height) {
                        height = val.height;
                        CssBuilder.css(el,{height:height+'px'});
                    } else {
                        height = el.clientHeight;
                    }
                    ratio = width / height;
                    containerWidth = val.containerWidth || window.innerWidth;
                    containerHeight = val.containerHeight || window.innerHeight;
                    resizeFill(el, width, height, containerWidth, containerHeight);
                } else {
                    width = el.clientWidth;
                    height = el.clientHeight;
                    containerWidth = window.innerWidth;
                    containerHeight = window.innerHeight;
                    resizeFill(el, width, height, containerWidth, containerHeight);
                    window.addEventListener('resize', function () {
                        containerWidth = window.innerWidth;
                        containerHeight = window.innerHeight;
                        resizeFill(el, width, height, containerWidth, containerHeight);
                    });
                }
            }, 100);
            function resizeFill(el, elWidth, elHeight, containerWidth, containHeight) {
                var elRatio = elWidth / elHeight;
                var containerRatio = containerWidth / containHeight;
                var newWidth, newHeight;
                if (elRatio > containerRatio) {
                    newWidth = containerWidth;
                    newHeight = newWidth / elRatio;
                } else {
                    newHeight = containerHeight;
                    newWidth = newHeight * elRatio;
                }
                var newScale = newWidth / elWidth;            //scaleX,scaleY
                var newX = (containerWidth - newWidth ) / 2;     //translateX
                var newY = (containHeight - newHeight ) / 2;   //translateY
                var cssSmartObj = {'transform-origin': '0 0', x: newX, y: newY, scale: newScale};
                CssBuilder.cssSmartObject(el, cssSmartObj, 'px');
            }

        }
    });


    new Vue({
        el: "body",
        components: {
            swiper: VueSwiper,
            //vclip: VClip
        },
        data: {},
        methods: {
            onSlideChangeStart: function (currentPage) {

            }

        },
        ready: function () {

        }

    });




