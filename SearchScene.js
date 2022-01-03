function SearchScene() {
    var Name = document.getElementById('searchbox').value;
    var Position;
    websqlGetAData(websqlTable, Name);
}