import React from 'react';
var challenge = require('./challenge.json');
var challenge_data = {}; // Contains the data after parsing json

//Sorting challenge according to 'now'
var sorted_challenge = challenge.sort(function (a, b) {
	var keyA = a.now,
		keyB = b.now;
	if (keyA < keyB) return -1;
	if (keyA > keyB) return 1;
	return 0;
});

// Json Parsing
for (var i = 0; i < sorted_challenge.length; i++) {
	var aircraft_list = sorted_challenge[i].aircraft // Get data by "aircraft"
	for (var j = 0; j < aircraft_list.length; j++) { //for getting all the items in each list
		var block = aircraft_list[j]
		var squawk = block.squawk; // gets the value of squawk
		if (squawk != undefined) { //Check if Lat and Lgn is present
			var lat = block.lat;
			var lon = block.lon;
			if (lat && lon != undefined) {
				if (challenge_data[squawk] != undefined) { // If squawk already exists
					challenge_data[squawk].push('' + lat + ',' + lon);
				}
				else {	// If new squawk comes
					challenge_data[squawk] = ['' + lat + ',' + lon];
				}
			}
		}
	}
}

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	// It sets the directions according to data
	setDirection(origin, destination, map) {
		var _self = this;
		var _val = this.state;
		var directionsService = new google.maps.DirectionsService;
		if (origin && destination) {
			var directionsRenderer = new google.maps.DirectionsRenderer({
				map: map,
				preserveViewport: true,
				suppressMarkers: true

			});
			directionsService.route({
				origin: origin,
				destination: destination,
				travelMode: google.maps.TravelMode.DRIVING
			}, function (response, status) {
				if (status == google.maps.DirectionsStatus.ZERO_RESULTS) {
					console.log('Wrong Data')
				}
				else if (status == google.maps.DirectionsStatus.OK) {
					// display the route
					directionsRenderer.setDirections(response); // Updating the directions
					_val.drivingRoute = new Array();
					_val.drivingRoute = response.routes[0].overview_path.slice(0);
					_self.startDrive(origin, _val.drivingRoute);
				}
				else {
					window.alert('Directions request failed due to ' + status);
				}
			});
		}
	}

	// start the route simulation   
	startDrive(origin, route) {
		var _self = this;
		var _val = this.state;
		var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
		var icon = {
			path: car,
			scale: .7,
			strokeColor: 'white',
			strokeWeight: .10,
			fillOpacity: 1,
			fillColor: '#404040',
			offset: '5%',
			// rotation: parseInt(heading[i]),
			anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
		};
		// var icon = 'https://raw.githubusercontent.com/xxihawkxx/mappy/master/markers/car.png'
		var marker = new google.maps.Marker(
			{
				position: origin,
				map: this.map,
				icon: icon
			});
		var length = route.length;
		var i = 0;
		var driveTimer = setInterval(function () {
			// marker.setPosition(route[i]);
			// var heading = google.maps.geometry.spherical.computeHeading(route[0], route[1]);
			// icon.roation = heading;
			// marker.setIcon(icon);

			if (i != length) {
				marker.setPosition(route[i]);
				var heading = google.maps.geometry.spherical.computeHeading(route[i], route[i + 1]);

				// Formula for calculating Bearing
				
				// φ1,λ1 is the start point, φ2,λ2 the end point (Δλ is the difference in longitude)
				// var y = Math.sin(λ2 - λ1) * Math.cos(φ2);
				// var x = Math.cos(φ1) * Math.sin(φ2) -
				// 	Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
				// var brng = Math.atan2(y, x).toDegrees(); // final Answer
				
				icon.rotation = heading;
				console.log(heading);
				marker.setIcon(icon);
			}
			i++;
			if (i == length) {
				clearInterval(driveTimer);
			}
		}, 100);
	}
	render() {
		return (
			<div className="Map">
				<div className='renderMap' ref="renderMap">
				</div>
			</div>
		)
	}

	componentDidMount() {
		this.map = this.createMap(); //Creating an instance of Map to be used everywhere
		this.state.map = this.map;
		var _val = this.state;
		var c_len = Object.keys(challenge_data).length;
		var waypoints = [];

		for (var i = 0; i < c_len; i++) { // c_len
			(function (i, _this) {
				window.setTimeout(function () {
					var coordinates = challenge_data[Object.keys(challenge_data)[i]];
					var start = coordinates[0];
					var end = coordinates[coordinates.length - 1]
					for (var k = 1; k < coordinates.length - 2; k++) {
						waypoints.push({
							location: coordinates[k],
							stopover: false
						});
					}
					// Add waypoints 
					_this.setDirection(start, end, _val.map)
				}, i * 1000);
			}(i, this));
		}
	}

	createMap() {
		let mapOptions = {
			zoom: 8,
			center: { lat: 27.564289, lng: 77.293102 }
		}
		return new google.maps.Map(this.refs.renderMap, mapOptions)
	}
};

export default App;