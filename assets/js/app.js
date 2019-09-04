if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, "find", {
        value: function (predicate) {
            var value;
            for (var i = 0; i < this.length; i++) {
                value = this[i];
                if (predicate.call(arguments[1], value, i, this)) {
                    return value;
                }
            }
            return undefined;
        }
    });
}

var url = window.location.protocol + '//' + window.location.host;
var token = (window.location.search.match(/token=([^&#]+)/) || [])[1];

var style = function (label) {
    return new ol.style.Style({
        image: new ol.style.Circle({
            fill: new ol.style.Fill({
                color: 'teal'
            }),
            stroke: new ol.style.Stroke({
                color: 'black',
                width: 2
            }),
            radius: 7
        }),
        text: new ol.style.Text({
            text: label,
            fill: new ol.style.Fill({
                color: 'black'
            }),
            stroke: new ol.style.Stroke({
                color: 'white',
                width: 2
            }),
            font: 'bold 12px sans-serif',
            offsetY: -16
        })
    });
};

//   var source = new ol.source.Vector();

var markers = {};

//   var map = new ol.Map({
//       layers: [
//           new ol.layer.Tile({
//               source: new ol.source.OSM()
//           }),
//           new ol.layer.Vector({
//               source: source
//           })
//       ],
//       target: 'map',
//       view: new ol.View({
//           center: ol.proj.fromLonLat([0, 0]),
//           zoom: 2
//       })
//   });

var ajax = function (method, url, callback) {
    // url = "http://gpsmovilpro.com:8082/api/server";
    var xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open(method, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    if (method == 'POST') {
        xhr.setRequestHeader('Content-type', 'application/json');
    }
    xhr.send()
};

ajax('GET', "http://gpsmovilpro.com:8082" + '/api/server', function (server) {
    ajax('GET', "http://gpsmovilpro.com:8082" + '/api/session?token=' + token, function (user) {
        ajax('GET', "http://gpsmovilpro.com:8082" + '/api/devices', function (devices) {

            // var socket = new WebSocket('ws' + url.substring(4) + '/api/socket');
            var socket = new WebSocket('ws' + "://gpsmovilpro.com:8082" + '/api/socket');

            socket.onclose = function (event) {
                console.log('socket closed');
            };

            socket.onmessage = function (event) {
                var data = JSON.parse(event.data);
                if (data.positions) {
                    data.positions.forEach(function (position, index) {

                        var marker = markers[position.deviceId];
                        if (!marker) {
                            var device = devices.find(function (device) { return device.id === position.deviceId });
                            marker = new google.maps.Marker({
                                position: { lat: position.latitude, lng: position.longitude },
                                map: map,
                                title: device.name
                            });
                            // marker.setStyle(style(device.name));
                            markers[position.deviceId] = marker;
                            // source.addFeature(marker);
                        } else {
                            var newLatLng = new google.maps.LatLng(position.latitude, position.longitude);
                            marker.setPosition(newLatLng);
                        }


                        // var device = devices.find(function (device) { return device.id === position.deviceId });
                        // marker.id = devices.find(function (device) { return device.id === position.deviceId });
                        // marker.name = device.name
                        // marker.obj = new google.maps.Marker({
                        //     position: { lat: position.latitude, lng: position.longitude },
                        //     map: map,
                        //     title: device.name
                        // });
                        // markers.push(marker);
                    });
                }
                // var data = JSON.parse(event.data);
                // if (data.positions) {
                //     for (i = 0; i < data.positions.length; i++) {
                //         var position = data.positions[i];
                //         var marker = markers[position.deviceId];
                //         var point = new ol.geom.Point(ol.proj.fromLonLat([position.longitude, position.latitude]));
                //         if (!marker) {
                //             var device = devices.find(function (device) { return device.id === position.deviceId });
                //             marker = new ol.Feature(point);
                //             marker.setStyle(style(device.name));
                //             markers[position.deviceId] = marker;
                //             source.addFeature(marker);
                //         } else {
                //             marker.setGeometry(point);
                //         }
                //     }
                // }
            };

        });
    });
});