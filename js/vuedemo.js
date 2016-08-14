/**
 * Created by congcong on 16/6/27.
 */
window.onload = function () {

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

    Vue.directive('auto-scale', {
        update: function (val) {
            var el = this.el;
            console.log('el = ' + el);
            var width = 640;   //iphone 6
            var height = 1136;
            var ratio = width / height;
            var newWidth, newHeight, newX, newY, newScale;
            window.onresize = function () {
                var winWidth = window.innerWidth;
                var winHeight = window.innerHeight;
                var winRatio = winWidth / winHeight;
                if (ratio > winRatio) {
                    newWidth = winWidth;
                    newHeight = newWidth / ratio;
                } else {
                    newHeight = winHeight;
                    newWidth = newHeight * ratio;
                }

                newX = (winWidth - newWidth ) / 2;     //translateX
                newY = (winHeight - newHeight ) / 2;   //translateY
                newScale = newWidth / width;            //scaleX,scaleY
                var cssSmartObj = {x: newX, y: newY, scale: newScale};
                console.log('css =  ' + JSON.stringify(cssSmartObj));
                CssBuilder.cssSmartObject(el,cssSmartObj , 'px');
            }
        }
    });

    new Vue({
        el: "body",
        data: {
            currentPage: 1,             //默认显示第1页
            musicison: true,    //vue实例内用的变量
            quizEnd: false,     //当前测验quiz结束的标志
            testScore: 0,       //测验分数
            quizGet: false,      //当前quiz get的奖品
            clip: 1,
            mySwiper: {},
            popup1: {show: false, shaking: false},
            popup2: {show: false, shaking: false},
            music: {}
        },
        methods: {
            nextPage: function () {
                this.quizEnd = false;       //下一页之前先给quiz的记录标志清零
                this.quizGet = false;
                this.mySwiper.slideNext(true, 0, 0);
            },
            quizGetFn: function () {
                this.quizEnd = true;
                this.testScore++;       //回答正确,分数加1
                this.quizGet = true;       //get显示奖品
            },
            scoreInstruction: function () {
                var score = this.testScore;
                if (score > 8) {
                    return 'img/11_copy_05_9_10.png';
                }
                if ((score < 9) && (score > 5)) {
                    return 'img/11_copy_04_6_8.png';
                }
                if (score < 6) {
                    return 'img/11_copy_03_1_5.png'
                }
                return '';
            }


        },
        ready: function () {
            var vm = this;
            vm.mySwiper = new Swiper('.swiper-container', {
                direction: 'vertical',
                mousewheelControl: false,
                onlyExternal: true,
                onSlideChangeStart: function (swiper) {
                    vm.currentPage = vm.mySwiper.activeIndex + 1;     //更新当前页, 注意index比page少1
                    vm.quizEnd = false;            //下一页之前先给quiz的记录标志清零
                    vm.quizGet = false;
                    console.log("onSlideChangeStart,currentPage =   " + vm.currentPage);
                }
            });
            //vm.mySwiper.slideTo(10);

        }

    });


};