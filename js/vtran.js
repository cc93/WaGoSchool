/**
 * vtrans.js v0.0.1
 * Created by congcong on 16/7/8.
 */
if(typeof _ === 'undefined'){
    throw new Error('vtrans requires underscore');
}
if(typeof CssBuilder === 'undefined'){
    throw new Error('vtrans requires CssBuilder');
}
if(typeof Vue === 'undefined'){
    throw new Error('vtrans requires Vue.js');
}
(function(){
    Vue.component('vtrans', {
        template: '<div :class="iClass" :id="iId" v-if="show" :transition="iId" > ' +
        '<slot>html内容替换到这里</slot> ' +
        '</div>',
        props: {
            class: {
                type: String,
                default: ''
            },
            id: {
                type: String,
                default: ''
            },
            show: {
                type: Boolean,
                default: true
            },
            trans: {
                type: String,
                default: ''
            }

        },
        data: function () {
            return {
                iClass: 'vtrans' + ' ' + this.class,
                iId: this.id || ( "vtrans-" + Math.floor(Math.random() * 1000000) ),   //去掉小数,因为样式表的选择器名称不能有小数
                transEnd: false  //过渡结束的标志
            }
        },
        computed: {},
        methods: {
            stringToObj: function (str) {
                eval("var obj = " + str);
                return obj;
            }

        },
        ready: function () {
            //如果指定了trans效果,则添加相应的css
            if(this.trans != ''){
                var me = this;
                var cssObj = this.stringToObj(this.trans);
                var id = this.iId;
                var ext = 'px';     //单位
                _.each(cssObj, function (v, k) {
                    CssBuilder.createCssObject('.' + id + '-' + k, v, ext);
                });
                Vue.transition(id, {
                    beforeEnter: function (el) {
                        me.transEnd = false;
                        console.log('beforeEnter, el= ' + el);
                    },
                    afterEnter: function (el) {
                        me.transEnd = true;
                    },
                    beforeLeave: function (el) {
                        me.transEnd = false;
                    },
                    afterLeave: function (el) {
                        me.transEnd = true;
                        console.log('afterLeave, el = ' + el);
                    }
                });
            }
        }
    });

})();
