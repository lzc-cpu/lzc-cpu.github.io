// 滑块控件，拖动滑块实现地图缩放
var slider = new ol.control.ZoomSlider();
// 将用于将地图定位到指定范围的ZoomToExtent控件加入到地图的默认控件中
var zoomToExtent = new ol.control.ZoomToExtent({
    extent: [
        13100000, 4290000,
        13200000, 5210000
    ]
});