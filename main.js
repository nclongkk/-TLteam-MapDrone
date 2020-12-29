window.onload = init;

function init() {
  var center = ol.proj.transform([108.15219145246553, 16.076152616052678], 'EPSG:4326', 'EPSG:3857'); //khởi tạo vị trí ban đầu của map
  var view = new ol.View({
    center: center,
    zoom: 16
  });

  //thêm các layler cho map (gồm 1 layer hiểm thị map và 1 layer hiển thị các marker)
  var OSMBaseLayer = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  straitSource = new ol.source.Vector({ wrapX: true });
  var straitsLayer = new ol.layer.Vector({
    source: straitSource
  });

  map = new ol.Map({
    layers: [OSMBaseLayer, straitsLayer],
    target: 'map',
    view: view,
    controls: [new ol.control.FullScreen(), new ol.control.Zoom()]
  });

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  function deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  var distance = 0;
  var data = [];
  map.on('click', function (e) {
    const coor = ({
      Lon: e.coordinate[0] / 111319.4907,// (111319.4907) offset kinh độ( vì tọa độ bị sai lệch)
      Lat: e.coordinate[1] / 112808.9586// tương tự là offset vĩ độ
    })
    data.push(coor);// push checkpoint vừa mới click chuột vào mảng data
    console.log(coor);
    insertMiddlePoint(data[data.length-2],data[data.length-1],0.0002)
    addPointGeom(coor);// add các checkpoint đã add vào data vào map
    //tính khoảng cách 2 điểm
    distance = distance + getDistanceFromLatLonInKm(data[data.length-1].Lat,data[data.length-1].Lon,data[data.length-2].Lat,data[data.length-2].Lon)
    distance = roundToTwo(distance)// làm tròn khoảng cách lên 2 chữ số
    $("#distance").text("Distance: "  + distance + "km"); //jquery display HTML
  })
  function insertMiddlePoint(coor1,coor2,k){
    let distance = Math.sqrt(Math.pow((coor2.Lon-coor1.Lon),2) +Math.pow((coor2.Lat-coor1.Lat),2))
    let n = Math.floor(distance/k)
    for (i = 1; i <= n; i++) {
      insertelement(coor1,coor2,i*k)
    }
    
  }
  function insertelement(coor1,coor2,k){

    let x2 = coor2.Lon - coor1.Lon;
    let y2 = coor2.Lat - coor1.Lat;
    let delta = (1 + Math.pow((y2/x2),2))*(k*k)
    let xi = ( Math.sign(x2)*Math.sqrt(delta))/ (1+ Math.pow((y2/x2),2))
    let yi = (xi*y2/x2)
    var coorInsert = ({
      Lon : xi + coor1.Lon,
      Lat : yi + coor1.Lat
    })
    addPointGeom(coorInsert)
  }



  //hàm làm tròn đến 2 chữ số thập phân
  function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
  }
  
  //hàm thêm marker được chọn vào map
  function addPointGeom(item) {
      var longitude = item.Lon,
        latitude = item.Lat,
        iconFeature = new ol.Feature({
          geometry: new ol.geom.Point(ol.proj.transform([longitude, latitude], 'EPSG:4326',
            'EPSG:3857')),
        }),
        iconStyle = new ol.style.Style({
          image: new ol.style.Circle({
            radius: 4,
            stroke: new ol.style.Stroke({
              color: 'blue'
            }),
            fill: new ol.style.Fill({
              color: [57, 228, 193, 0.84]
            }),
          })
        });
      iconFeature.setStyle(iconStyle);
      straitSource.addFeature(iconFeature);
  }

}