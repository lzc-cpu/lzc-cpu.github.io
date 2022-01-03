//实现popup的html元素
var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');


//在地图容器中创建一个Overlay
var popup = new ol.Overlay(/** @type {olx.OverlayOptions} */({
    element: container,
    autoPan: true,
    positioning: 'bottom-center',
    stopEvent: false,
    autoPanAnimation: {
        duration: 250
    }
}));
map.addOverlay(popup);

//添加关闭按钮的单击事件（隐藏popup）
closer.onclick = function () {
    popup.setPosition(undefined);  //未定义popup位置
    closer.blur(); //失去焦点
    return false;
};

//动态创建popup的具体内容
function addFeatrueInfo(info) {
    //新增a元素
    var elementA = document.createElement('a');
    elementA.className = "markerInfo";
    elementA.href = info.att.titleURL;
    elementA.target = "_blank";
    //elementA.innerText = info.att.title;
    setInnerText(elementA, info.att.title);
    content.appendChild(elementA); // 新建的div元素添加a子节点
    //新增div元素
    var elementDiv = document.createElement('div');
    elementDiv.className = "markerText";
    //elementDiv.innerText = info.att.text;
    setInnerText(elementDiv, info.att.text);
    content.appendChild(elementDiv); // 为content添加div子节点
    //新增img元素
    var elementImg = document.createElement('img');
    elementImg.className = "markerImg";
    elementImg.src = info.att.imgURL;
    content.appendChild(elementImg); // 为content添加img子节点          
}

//动态设置元素文本内容（兼容）
function setInnerText(element, text) {
    if (typeof element.textContent == "string") {
        element.textContent = text;
    } else {
        element.innerText = text;
    }
}
var wuhan = ol.proj.fromLonLat([114.31, 30.52]);
var name;
//为map添加点击事件监听
map.on('click', function (evt) {
    var coordinate = evt.coordinate;
    //popup标注
    if (check == 0) {
        //判断当前单击处是否有要素，捕获到要素时弹出popup
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) { return feature; });
        if (feature) {
            //获取经纬度
            websqlGetPopup(websqlTable, feature);
            if (popup.getPosition() == undefined) {
                popup.setPosition(coordinate); //设置popup的位置
            }
        }
    }
    //删除景点
    if (check == 1) {
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) { return feature; });
        if (feature) {
            //删除
            websqlDeleteADataFromTable(websqlTable, feature);
        }
    }
    //修改景点
    if (check == 2) {
        //弹出修改弹窗
        CorrectWindow();
        //获取点击的注记要素
        var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) { return feature; });
        if (feature) {
            //获取该景点的全部信息
            MyUpdate_select(websqlTable, feature);
        }
    }
    //添加景点
    if (check == 3) {
        //获得点击点坐标，经纬度
        var zuobiao4326 = ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
        var jingdu = zuobiao4326[0];
        var weidu = zuobiao4326[1];
        //清理添加景区弹框的输入框
        document.getElementById('Name').value = "";
        document.getElementById('NameUrl').value = "#";
        document.getElementById('ImgUrl').value = "#";
        document.getElementById('Introduction').value = "";
        document.getElementById('Longitude').value = jingdu;
        document.getElementById('Latitude').value = weidu;
        //弹框
        AddWindow();
    }
});

function SubmitCorrect() {
    //获得
    var Name = document.getElementById('CName').value;
    if (document.getElementById('CName').value == "" || document.getElementById('CLongitude').value == "" || document.getElementById('CLatitude').value == "") {
        alert("请确保填写完整！");
    }
    else {
        Check_Name_correct(websqlTable, Name);
    }
}

//为map添加鼠标移动事件监听，当指向标注时改变鼠标光标状态
map.on('pointermove', function (e) {
    var pixel = map.getEventPixel(e.originalEvent);
    var hit = map.hasFeatureAtPixel(pixel);
    map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});
