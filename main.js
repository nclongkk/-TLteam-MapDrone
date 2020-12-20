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

  

  var data = [];
  map.on('click', function (e) {
    const coor = ({
      Lon: e.coordinate[0] / 111319.4907,// (111319.4907) offset kinh độ( vì tọa độ bị sai lệch)
      Lat: e.coordinate[1] / 112808.9586// tương tự là offset vĩ độ
    })
    data.push(coor);// push checkpoint vừa mới click chuột vào mảng data
    console.log(coor);
    addPointGeom(data);// add các checkpoint đã add vào data vào map
  })

  //hàm thêm marker được chọn vào map
  function addPointGeom(data) {
    data.forEach(function (item) { //trong javascript sử dụng forEach thay cho vòng lặp for để duyệt toàn bộ các giá trị trong mảng data
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
    });
  }

}