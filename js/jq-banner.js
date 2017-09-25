/**
 * 本插件仅适用于左右轮播及焦点轮播两种常用类型
 * create by ZengXiaoLong on 2017/8/13
 * usage: $("#banner").banner({
 *       type : "LRslide" or "fade",// 默认fade 可有可无
 *       seamless : true or false, // 默认false 可有可无
 *       picE : ".pic ul li",
 *       tabE : ".tab ul li",
 *       btnE : ".btn div",
 *       tabType : "mouseenter" or "click",// 默认click 可有可无
 *       time : 2000 // time 为真即可
 *   });
 * take care:布局应是这种布局
 *    <div id="banner">
 *          <div class="pic">
 *              <ul>
 *                  <li><a href=""><img src="img/1.webp" alt=""></a></li>
 *                  <li><a href=""><img src="img/2.jpg" alt=""></a></li>
 *                  <li><a href=""><img src="img/3.jpg" alt=""></a></li>
 *                  <li><a href=""><img src="img/4.jpg" alt=""></a></li>
 *                  <li><a href=""><img src="img/5.webp" alt=""></a></li>
 *              </ul>
 *          </div>
 *          <div class="tab">
 *              <ul>
 *                  <li></li>
 *                  <li></li>
 *                  <li></li>
 *                  <li></li>
 *                  <li></li>
 *              </ul>
 *          </div>
 *          <div class="btn">
 *              <div class="left"> < </div>
 *              <div class="right"> > </div>
 *          </div>
 *      </div>
 * */


$.fn.extend({
    banner : function (mJson) {

        var type = mJson.type || "fade",
            seamless = mJson.seamless || false,// 是否无缝轮播
            pic = mJson.picE,
            tab = mJson.tabE,
            btn = mJson.btnE,
            time = mJson.time,
            tabType = mJson.tabType || "click";

        var $pic = this.find(pic),
            $tab,
            $btn,
            length = $pic.length,
            index = 0;

        var $picUl,width,tabTime,
            timer1 = null,
            timer2 = null,
            clickTime = 0;

        //初始化
        this[0].onselectstart=function(){return false};
        if ( type === "fade" ){
            $pic.hide().eq(0).show();
        }else if ( type === "LRslide" ){ // 左右轮播
            $picUl = $pic.parent();
            width = $pic.width();
            if ( seamless ){//无缝轮播
                $picUl.prepend( $pic.last().clone(true,true) );
                $picUl.append( $pic.first().clone(true,true) );
                $picUl.width((length+10)*width).css("marginLeft",-width).parent().css("overflow" , "hidden");//样式初始化显示
                $pic = $picUl.children();
            }else{//不无缝
                $picUl.width((length+10)*width).parent().css("overflow" , "hidden");//样式初始化显示
            }
            $pic.css({
                width : width,
                position : "static",
                float : 'left'
            });
        }

        //关于tab
        if ( tab ){
            $tab = this.find(tab);
            tabTime = tabType==="click"?10:200;
            $tab.eq(0).addClass("on");
            $tab[tabType](function () {
                var x = $(this).index();
                if ( x !== index ){
                    clearTimeout(timer1);
                    timer1 = setTimeout(change,tabTime,x);
                }
            });
        }

        //关于btn
        if ( btn ){
            $btn = this.find(btn);
            $btn.click(function () {
                if ( new Date - clickTime > 510 ){
                    var x = index;
                    $(this).index()?x++:x--;
                    change(x);
                    clickTime = new Date;
                }
            });
        }

        //关于自动轮播
        if ( time ){
            this.hover(function () {
                clearInterval(timer2);
            },auto());
            function auto() {
                timer2 = setInterval(function () {
                    var x = index;
                    x ++;
                    change(x);
                },1000);
                return auto;//语法为：return 表达式; 语句结束函数执行，返回调用函数，而且把表达式的值作为函数的结果
            }
        }

        //变化函数
        function change(i) {
            var moveIndex = i+1;
            var ifFade = type === "fade";
            i %= length;
            if(i<0)i=length-1;
            if ( !seamless )moveIndex = i;
            ifFade && $pic.eq(index).stop().fadeOut();
            $tab.eq(index).removeClass("on");
            index = i;
            if ( ifFade ){
                $pic.eq(index).stop().fadeIn();
            }else{
                $picUl.stop().animate({
                    marginLeft : -(moveIndex)*width
                },500,function () {
                    if ( seamless ){
                        if ( index === 0 || index === length-1 ){
                            $(this).css("marginLeft" , -moveIndex*width);
                        }
                    }
                });
            }
            $tab.eq(index).addClass("on");
        }

    }
});







