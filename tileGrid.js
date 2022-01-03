var osmSource = new ol.source.OSM();
var GridTile = new ol.layer.Tile({
    source: new ol.source.TileDebug({
        projection: 'EPSG:3857', //地图投影坐标系
        tileGrid: osmSource.getTileGrid()  //获取瓦片图层数据对象（osmSource）的网格信息
    })
})