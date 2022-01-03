function AddScene() {
    //从添加弹框中获取景点的详细信息
    var Name = document.getElementById('Name').value;
    var Longitude = parseFloat(document.getElementById('Longitude').value);
    var Latitude = parseFloat(document.getElementById('Latitude').value);
    var NameUrl = document.getElementById('NameUrl').value;
    var ImgUrl = document.getElementById('ImgUrl').value;
    var Introduction = document.getElementById('Introduction').value;
    //判断是否输入完整
    if (document.getElementById('Name').value == "" || document.getElementById('Longitude').value == "" || document.getElementById('Latitude').value == "") {
        alert("请确保填写完整！");
    }
    else {
        //判断是否有冲突，若没有，插入数据
        Check_Name(websqlTable, Name, Longitude, Latitude, NameUrl, Introduction, ImgUrl);
    }

}
