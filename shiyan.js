var overviewMapControl = new ol.control.OverviewMap({
    className: 'ol-overviewmap ol-custom-overviewmap', //鹰眼控件样式（see in overviewmap-custom.html to see the custom CSS used）
    //鹰眼中加载同坐标系下不同数据源的图层
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM({
                'url': 'http://{a-c}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png'
            })
        })
    ],
    collapseLabel: '\u00BB', //鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
    label: '\u00AB', //鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
    collapsed: false //初始为展开显示方式
});
