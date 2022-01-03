//创建并初始化数据库
websqlOpenDB();//创建数据库
websqlCreatTable(websqlTable);//创建表
websqlInsterDataToTable(websqlTable, "黄鹤楼公园", 114.3, 30.5, "http://www.cnhhl.com", "p黄鹤楼（Yellow Crane Tower）位于湖北武汉长江南岸的武昌蛇山之巅，濒临万里长江，是“江南三大名楼”之一，自古享有“天下江山第一楼”和“天下绝景”之称。", "image/huanghelou.jpg");
websqlInsterDataToTable(websqlTable, "木兰文化生态旅游区", 114.37, 30.87, "http://www.whmlwlt.com/", "黄陂木兰文化生态旅游区为华中地区最大的城市生态旅游景区群，被誉为中部最美的生态文化休闲之都，被联合国计划开发署列为《中国二十一世纪议程》优先项目。", "image/mulan.png");
websqlInsterDataToTable(websqlTable, "东湖景区", 114.41, 30.58, "http://www.whdonghu.gov.cn/zjdh_6322/", "东湖位于武汉市之东。一九八二年被国务院列为首批国家重点风景名胜区。整个风景区面积八十八平方公里，规划建设范围七十三平方公里，约占市区面积的四分之一。", "image/donghu.jpg");
websqlInsterDataToTable(websqlTable, "中国地质大学（武汉）", 114.6133, 30.4591, "https://www.cug.edu.cn/", "中国地质大学，简称地大，位于武汉市，是中华人民共和国教育部直属的全国重点大学，是国家“世界一流学科建设高校”，国家“211工程”、“985工程优势学科创新平台”建设高校，是国家批准设立研究生院的大学。", "image/cug.jpg");
websqlInsterDataToTable(websqlTable, "武汉大学", 114.36, 30.53, "https://www.whu.edu.cn/", "武汉大学（Wuhan University）简称“武大”，是中华人民共和国教育部直属的综合性全国重点大学.武汉大学溯源于1893年清末湖广总督张之洞奏请清政府创办的自强学堂，后历经方言学堂、武昌高等师范学校、国立武昌师范大学、国立武昌大学、国立第二中山大学等时期，1928年定名国立武汉大学，是近代中国第一批国立大学。", "image/whan.jpg");
websqlInsterDataToTable(websqlTable, "欢乐谷", 114.399429, 30.59723, "http://wh.happyvalley.cn/", "武汉欢乐谷，华中地区的大型文化主题公园.武汉欢乐谷拥有亚洲首座双龙木质过山车、国内最大的人工造浪沙滩、最大室内家庭数字娱乐中心、武汉最大的专业剧场等50多项游乐设施。", "image/happy.jpg");
websqlInsterDataToTable(websqlTable, "湖北省博物馆", 114.371879, 30.567828, "http://www.hbww.org/home/Index.aspx#", "湖北省博物馆现有馆藏文物26万余件(套)，以青铜器、漆木器、简牍最有特色，其中国家一级文物945件(套)、国宝级文物16件(套)。越王勾践剑、曾侯乙编钟、郧县人头骨化石、元青花四爱图梅瓶为该馆四大镇馆之宝。", "image/hubeilab.jpg");
websqlInsterDataToTable(websqlTable, "武汉长江大桥", 114.2832, 30.5519, "http://www.360doc.com/content/19/1005/22/30384148_865044604.shtml", "武汉长江大桥（Wuhan Yangtze River Bridge），是中国湖北省武汉市境内连接汉阳区与武昌区的过江通道，位于长江水道之上，是中华人民共和国成立后修建的第一座公铁两用的长江大桥，也是武汉市重要的历史标志性建筑之一，素有“万里长江第一桥”美誉。", "image/daqiao.png");
websqlInsterDataToTable(websqlTable, "归元禅寺", 114.265693, 30.551579, "http://www.guiyuanchansi.com.cn/", "归元禅寺位于湖北省武汉市汉阳区归元寺路，由白光法师于清顺治十五年（公元1658年）兴建。占地153亩，有殿舍200余间，各类佛教经典7000余卷。 [1]  归元禅寺属于佛教禅宗五家七宗之一的曹洞宗，故称归元禅寺。", "image/guiyuansi.jpg");
114.265693, 30.551579

//加载地图
var view = new ol.View({
    center: ol.proj.fromLonLat([114.42, 30.54]),
    zoom: 11,
    minZoom: 2,
    maxZoom: 17,
    //rotation: Math.PI / 6, // 旋转，注意r小写
})
var map = new ol.Map({
    target: "map",//与对应的地图容器绑定
    layers: [
        new ol.layer.Tile({
            source: new ol.source.OSM({
                wrapX: true, // 默认为true，地图水平复制，填满整个div
            }),
            preload: Infinity, // 地图预加载，增加用户体验
        }),
    ],
    //加载瓦片时开启动画效果
    loadTilesWhileAnimating: true,
    //地图视图设置
    view: view
});


//加载图标
var createLabelStyle = function (feature) {
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            anchor: [0.5, 60],
            anchorOrigin: 'top-right',
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            offsetOrigin: 'top-right',
            opacity: 0.75,  //透明度
            src: 'image/icon.png' //图标的url
        })),
        text: new ol.style.Text({
            textAlign: 'center', //位置
            textBaseline: 'middle', //基准线
            font: 'normal 14px 微软雅黑',  //文字样式
            text: feature.get('name'),  //文本内容
            fill: new ol.style.Fill({ color: '#aa3300' }), //文本填充样式（即文字颜色）
            stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
        })
    });
}

var createLabelStyle_2 = function (feature) {
    return new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */({
            anchor: [0.5, 60],
            anchorOrigin: 'top-right',
            anchorXUnits: 'fraction',
            anchorYUnits: 'pixels',
            offsetOrigin: 'top-right',
            opacity: 0.75,  //透明度
            src: 'image/blueIcon.png' //图标的url
        })),
        text: new ol.style.Text({
            textAlign: 'center', //位置
            textBaseline: 'middle', //基准线
            font: 'normal 14px 微软雅黑',  //文字样式
            text: feature.get('name'),  //文本内容
            fill: new ol.style.Fill({ color: '#aa3300' }), //文本填充样式（即文字颜色）
            stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 })
        })
    });
}


//标注全部读取
websqlGetAllData(websqlTable);
