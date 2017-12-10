import React from 'react';
var challenge = require('./challenge.json');
var challenge_data = {}; // Contains the data after parsing json

//Sorting challenge according to 'now'
var sorted_challenge = challenge.sort(function(a, b){
	var keyA = a.now,
			keyB = b.now;
	if(keyA < keyB) return -1;
	if(keyA > keyB) return 1;
	return 0;
});

// Json Parsing
for(var i=0;i<sorted_challenge.length;i++){
	var aircraft_list = sorted_challenge[i].aircraft // Get data by "aircraft"
	for(var j=0;j<aircraft_list.length;j++){ //for getting all the items in each list
		var block = aircraft_list[j]
		var squawk = block.squawk; // gets the value of squawk
		if(squawk!=undefined){ //Check if Lat and Lgn is present
			var lat = block.lat;
			var lon = block.lon;
			if(lat && lon != undefined){
				if(challenge_data[squawk]!= undefined){ // If squawk already exists
					challenge_data[squawk].push(''+lat+','+lon);
				}
				else {	// If new squawk comes
					challenge_data[squawk] = [''+lat+','+lon];
				}
			}
		}
	}
}

class App extends React.Component {
		constructor(props){
			super(props);
			this.state = { };
		}
		// It sets the directions according to data
    setDirection(origin,destination,map){
    	var _self = this; 
    	var _val = this.state; 
    	var directionsService = new google.maps.DirectionsService;
    	if(origin && destination){
    		var directionsRenderer = new google.maps.DirectionsRenderer({
					map: map,
					preserveViewport: true,
					suppressMarkers: true
					
    		});
    		directionsService.route({
	        origin: origin,
	        destination: destination,
	        travelMode: google.maps.TravelMode.DRIVING
	      },function(response, status) {
					if(status == google.maps.DirectionsStatus.ZERO_RESULTS){
						console.log('Wrong Data')
					}
		      else if (status == google.maps.DirectionsStatus.OK) {
		          // display the route
		          directionsRenderer.setDirections(response); // Updating the directions
		          _val.drivingRoute = new Array();
		          _val.drivingRoute = response.routes[0].overview_path.slice(0);
		          _self.startDrive(origin,_val.drivingRoute);
		      } 
		      else{
		        window.alert('Directions request failed due to ' + status);
		      }
	    	});
    	}
    }
		// start the route simulation   
		startDrive(origin,route) {
			var _self = this;
			var _val = this.state;
			var marker = new google.maps.Marker(
		  {
		    position: origin,
				map: this.map,
				icon: 'https://raw.githubusercontent.com/xxihawkxx/mappy/master/markers/car.png'
			});
		  var length = route.length;
      var i=0;
    	var driveTimer = setInterval(function () {
        marker.setPosition(route[i]);
        i++;
        if(i==length){
        	clearInterval(driveTimer);
        }
			},25);
		}
  	render() {
	    return(
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

			for(var i =0; i<c_len;i++){
				(function(i, _this){
					window.setTimeout(function(){
						var coordinates = challenge_data[Object.keys(challenge_data)[i]];
						var start = coordinates[0];
						var end = coordinates[coordinates.length-1]
						for(var k =1;k<coordinates.length-2;k++){
							waypoints.push({
								location: coordinates[k],
								stopover: false
							});
						}
						// Add waypoints 
						_this.setDirection(start,end,_val.map)
					},i * 1000);
				}(i, this));
				}
	  }

	  createMap() {
	    let mapOptions = {
				zoom: 8,
				center:  {lat:27.564289, lng:77.293102}				
	    }
	    return new google.maps.Map(this.refs.renderMap, mapOptions)
	  }
};

export default App;