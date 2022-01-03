/**
*数据库操作辅助类,定义对象、数据操作方法都在这里定义
*/
var dbname = 'WebSql';/*数据库名*/
var version = '1.0'; /*数据库版本*/
var dbdesc = '武汉市旅游景点'; /*数据库描述*/
var dbsize = 2 * 1024 * 1024; /*数据库大小*/
var dataBase = null; /*暂存数据库对象*/
/*数据库中的表单名*/
var websqlTable = "websqlTable";

/**
 * 打开数据库
 * @returns  dataBase:打开成功   null:打开失败
 */
function websqlOpenDB() {
    /*数据库有就打开 没有就创建*/
    dataBase = window.openDatabase(dbname, version, dbdesc, dbsize, function () { });
    return dataBase;
}
/**
 * 新建数据库里面的表单
 * @param tableName:表单名
 */
function websqlCreatTable(tableName) {
    //  chinaAreaOpenDB();
    var creatTableSQL = 'CREATE TABLE IF  NOT EXISTS ' + tableName + ' (rowid INTEGER PRIMARY KEY AUTOINCREMENT, Name text,Longitude double,Latitude double,NameUrl text,Introduction text,ImgUrl text)';
    dataBase.transaction(function (ctx, result) {
        ctx.executeSql(creatTableSQL, [], function (ctx, result) {
        });
    });
}
/**
 * 往表单里面插入数据
 * @param Name:景点名称
 * @param Longitude：景点经度
 * @param Latitude:景点纬度
 * @param NameUrl:景点链接
 * @param Introduction:景点介绍
 * @param  ImgUrl:景点图片
 */
function websqlInsterDataToTable(tableName, Name, Longitude, Latitude, NameUrl, Introduction, ImgUrl) {
    var insterTableSQL = 'INSERT INTO ' + tableName + ' (Name, Longitude, Latitude,NameUrl,Introduction,ImgUrl) VALUES (?,?,?,?,?,?)';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(insterTableSQL, [Name, Longitude, Latitude, NameUrl, Introduction, ImgUrl], function (ctx, result) {
        });
    });
}

function websqlInster_DataToTable(tableName, Name, Longitude, Latitude, NameUrl, Introduction, ImgUrl) {
    var insterTableSQL = 'INSERT INTO ' + tableName + ' (Name, Longitude, Latitude,NameUrl,Introduction,ImgUrl) VALUES (?,?,?,?,?,?)';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(insterTableSQL, [Name, Longitude, Latitude, NameUrl, Introduction, ImgUrl], function (ctx, result) {
        });
    });
    Position = ol.proj.fromLonLat([Longitude, Latitude]);
    //实例化Vector要素，通过矢量图层添加到地图容器中
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(Position),
        name: Name,  //名称属性
    });
    iconFeature.setStyle(createLabelStyle(iconFeature));
    //添加源
    vectorSource.addFeature(iconFeature);
    alert("添加成功！");
}


//矢量标注的数据源
var vectorSource = new ol.source.Vector;
//矢量标注图层
var vectorLayer = new ol.layer.Vector({
    source: vectorSource,
});
/**
 * 获取数据库一个表单里面的所有数据
 * @param tableName:表单名
 * 返回数据集合
 */
function websqlGetAllData(tableName) {
    var Position;//地名
    var P_Longitude;//经度
    var P_Latitude;//纬度
    var selectALLSQL = 'SELECT * FROM ' + tableName;
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectALLSQL, [], function (ctx, result) {
            var len = result.rows.length;
            for (var i = 0; i < len; i++) {
                //获取经纬度
                P_Longitude = result.rows.item(i).Longitude;
                P_Latitude = result.rows.item(i).Latitude;
                Position = ol.proj.fromLonLat([P_Longitude, P_Latitude]);
                console.log(result.rows.item(i).Name);
                //实例化Vector要素，通过矢量图层添加到地图容器中
                var iconFeature = new ol.Feature({
                    geometry: new ol.geom.Point(Position),
                    name: result.rows.item(i).Name,  //名称属性
                });
                iconFeature.setStyle(createLabelStyle(iconFeature));
                //添加源
                vectorSource.addFeature(iconFeature);
            }
        });
    });
    map.addLayer(vectorLayer);
}


var selectedByAttriFeature;

/**
 * 获取数据库一个表单里面的部分数据
 * @param tableName:表单名
 * @param name:姓名
 */
//查询景点
function websqlGetAData(tableName, name) {
    var P_Longitude;//经度
    var P_Latitude;//纬度
    var Position;//坐标
    //根据输入的景点名称查询景点的位置
    var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE Name = ?'
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectSQL, [name], function (ctx, result) {
            var len = result.rows.length;
            for (var i = 0; i < len; i++) {
                //获取位置
                P_Longitude = result.rows.item(i).Longitude;
                P_Latitude = result.rows.item(i).Latitude;
                Position = ol.proj.fromLonLat([P_Longitude, P_Latitude]);
                //飞行定位至该位置
                Fly(Position);
            }
            if (len == 0) {
                alert("查询失败!");
            }
        });
    });
    //在标注图层清除上一次查找结果
    var features = vectorLayer.getSource().getFeatures();
    if (selectedByAttriFeature != null) {
        selectedByAttriFeature.setStyle(createLabelStyle(selectedByAttriFeature));
        selectedByAttriFeature = null;
    }
    //改变查询景点的标注，显示结果
    for (var i = 0, ii = features.length; i < ii; i++) {
        if (features[i].get('name') === name) {
            selectedByAttriFeature = features[i];
            break;
        }
    }
    //改变样式
    selectedByAttriFeature.setStyle(createLabelStyle_2(selectedByAttriFeature));
}


/**
 * 获取数据库一个表单里面的部分数据
 * @param tableName:表单名
 * @param jingdu：景点经度
 * @param weidu:景点纬度
 * 
 */
function websqlGetPopup(tableName, feature) {
    //查询
    var P_Name;//地名
    var P_NameUrl;//景区链接
    var P_Introduction;//景区简介
    var P_ImgUrl;//景区图片
    var Position;//地名
    var P_Longitude;//经度
    var P_Latitude;//纬度
    //获取点击要素对应的景区名称
    var name = feature.get('name');
    //从数据库中选取景区
    var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE Name = ?';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectSQL, [name], function (ctx, result) {
            var len = result.rows.length;
            for (var i = 0; i < len; i++) {
                P_Name = result.rows.item(i).Name;
                P_NameUrl = result.rows.item(i).NameUrl;
                P_Introduction = result.rows.item(i).Introduction;
                P_ImgUrl = result.rows.item(i).ImgUrl;
                P_Longitude = result.rows.item(i).Longitude;
                P_Latitude = result.rows.item(i).Latitude;
                Position = ol.proj.fromLonLat([P_Longitude, P_Latitude]);
            }
            //为popup添加内容
            var featuerInfo = {
                geo: Position,
                att: {
                    title: P_Name, //标注信息的标题内容
                    titleURL: P_NameUrl, //标注详细信息链接
                    text: P_Introduction, //标注内容简介
                    imgURL: P_ImgUrl //标注的图片
                }
            }
            content.innerHTML = ''; //清空popup的内容容器
            addFeatrueInfo(featuerInfo); //在popup中加载当前要素的具体信息
        });
    });
}

//检查输入的景点名称是否重复
function Check_Name(tableName, name, Longitude, Latitude, NameUrl, Introduction, ImgUrl) {
    var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE Name = ?';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectSQL, [name], function (ctx, result) {
            var len = result.rows.length;
            if (len > 0) {
                alert("景区名称已存在！");
            }
            if (len == 0) {
                //景点名称不重复，调用插入函数
                websqlInster_DataToTable(websqlTable, name, Longitude, Latitude, NameUrl, Introduction, ImgUrl);
            }
        });
    });
}
//检查输入的景点名称是否重复
function Check_Name_correct(tableName, name) {
    var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE Name = ?';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectSQL, [name], function (ctx, result) {
            var len = result.rows.length;
            if (len > 0) {
                if (name != Correct_name) {
                    alert("景区名称已存在！");
                }
                if (name == Correct_name) {
                    MyUpdate_update(websqlTable);
                }
            }
            if (len == 0) {
                MyUpdate_update(websqlTable);
            }
        });
    });
}

/**
 * 删除表单里的全部数据
 * @param tableName:表单名
 */
function websqlDeleteAllDataFromTable(tableName) {
    var deleteTableSQL = 'DELETE FROM ' + tableName;
    localStorage.removeItem(tableName);
    dataBase.transaction(function (ctx, result) {
        ctx.executeSql(deleteTableSQL, [], function (ctx, result) {
            alert("删除表成功 " + tableName);
        }, function (tx, error) {
            alert('删除表失败:' + tableName + error.message);
        });
    });
}
/**
 * 根据name删除数据
 * @param tableName:表单名
 * @param jingdu：景点经度
 * @param weidu:景点纬度
 */
//删除景点
function websqlDeleteADataFromTable(tableName, feature) {
    //移除标注点
    vectorLayer.getSource().removeFeature(feature);
    //获取标注点对应景区名称
    var name = feature.get('name');
    //从数据库中删除该景区
    var deleteDataSQL = 'DELETE FROM ' + tableName + ' WHERE Name = ?';
    localStorage.removeItem(tableName);
    dataBase.transaction(function (ctx, result) {
        ctx.executeSql(deleteDataSQL, [name], function (ctx, result) {
            alert("删除成功 " + name);
        }, function (tx, error) {
            alert('删除失败:' + tableName + name + error.message);
        });
    });
}

var Correct_feature;
var Correct_name;
//从数据库中查找地图中点击的景区信息，传入修改弹框中
function MyUpdate_select(tableName, feature) {
    //获取要素对应的景点名称
    Correct_feature = feature;
    Correct_name = feature.get('name');
    //根据名称查询
    var selectSQL = 'SELECT * FROM ' + tableName + ' WHERE Name = ?'
    dataBase.transaction(function (ctx) {
        ctx.executeSql(selectSQL, [Correct_name], function (ctx, result) {
            var len = result.rows.length;
            for (var i = 0; i < len; i++) {
                //查找结果返回修改弹框
                document.getElementById('CName').value = result.rows.item(i).Name;
                document.getElementById('CNameUrl').value = result.rows.item(i).NameUrl;
                document.getElementById('CIntroduction').value = result.rows.item(i).Introduction;
                document.getElementById('CImgUrl').value = result.rows.item(i).ImgUrl;
                document.getElementById('CLongitude').value = result.rows.item(i).Longitude;
                document.getElementById('CLatitude').value = result.rows.item(i).Latitude;
            }
        });
    });
}

function MyUpdate_update(tableName) {
    //删除，删除修改前的景区
    var deleteDataSQL = 'DELETE FROM ' + tableName + ' WHERE Name = ?';
    localStorage.removeItem(tableName);
    dataBase.transaction(function (ctx, result) {
        ctx.executeSql(deleteDataSQL, [Correct_name], function (ctx, result) {
        });
    });
    //移除修改前的标注点
    vectorLayer.getSource().removeFeature(Correct_feature);
    //添加修改后的景区
    var Name = document.getElementById('CName').value;
    var Longitude = parseFloat(document.getElementById('CLongitude').value);
    var Latitude = parseFloat(document.getElementById('CLatitude').value);
    var NameUrl = document.getElementById('CNameUrl').value;
    var ImgUrl = document.getElementById('CImgUrl').value;
    var Introduction = document.getElementById('CIntroduction').value;
    var insterTableSQL = 'INSERT INTO ' + tableName + ' (Name, Longitude, Latitude,NameUrl,Introduction,ImgUrl) VALUES (?,?,?,?,?,?)';
    dataBase.transaction(function (ctx) {
        ctx.executeSql(insterTableSQL, [Name, Longitude, Latitude, NameUrl, Introduction, ImgUrl], function (ctx, result) {
            alert("修改成功！");
        });
    });
    //新建标注点
    var Position = ol.proj.fromLonLat([Longitude, Latitude]);
    //实例化Vector要素，通过矢量图层添加到地图容器中
    var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(Position),
        name: Name,  //名称属性
    });
    iconFeature.setStyle(createLabelStyle(iconFeature));
    //添加源
    vectorSource.addFeature(iconFeature);
}


/**
 * 根据name修改数据
 * @param tableName:表单名
 * @param name:姓名
 * @param age:年龄
 * 
 */
function websqlUpdateAData(tableName, name, age) {
    var updateDataSQL = 'UPDATE ' + tableName + ' SET AGE = ? WHERE NAME = ?';
    dataBase.transaction(function (ctx, result) {
        ctx.executeSql(updateDataSQL, [age, name], function (ctx, result) {
            alert("更新成功 " + tableName + name);
        }, function (tx, error) {
            alert('更新失败:' + tableName + name + error.message);
        });
    });
}
