function Fly(destination) {
    var duration = 1500; //持续时间（毫秒）
    var start = +new Date();
    //移动效果
    var pan = ol.animation.pan({
        duration: duration, //设置持续时间
        source: /** @type {ol.Coordinate} */(view.getCenter()),
        start: start
    });
    //反弹效果
    var bounce = ol.animation.bounce({
        duration: duration, //设置持续时间
        resolution: 4 * view.getResolution(),  //4倍分辨率
        start: start
    });
    map.beforeRender(pan, bounce); //地图渲染前设置动画效果(pan+bounce)
    view.setCenter(destination); //定位
}

//反弹值
function bounce(t) {
    var s = 7.5625, p = 2.75, l;
    if (t < (1 / p)) {
        l = s * t * t;
    } else {
        if (t < (2 / p)) {
            t -= (1.5 / p);
            l = s * t * t + 0.75;
        } else {
            if (t < (2.5 / p)) {
                t -= (2.25 / p);
                l = s * t * t + 0.9375;
            } else {
                t -= (2.625 / p);
                l = s * t * t + 0.984375;
            }
        }
    }
    return l;
}

//弹性值
function elastic(t) {
    return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}