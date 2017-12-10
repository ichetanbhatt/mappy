<p align="center">
<img src="https://raw.githubusercontent.com/xxihawkxx/mappy/master/markers/car-top.png" width="100"/>
<h1 align="center">Mappy</h1>
</p>

## About:
A React based webapp which uses 'Google Maps Api' to render the movement of different inputs on google map.

## Installation
* ```git clone https://github.com/xxihawkxx/mappy.git```
* ``` npm install ```
* ``` npm start ```

## How it works?
* Json is parsed and converted to usable format. ```challenge_data```
* ```setDirection(origin,destination,map)``` is called as soon as the HTML mounts which takes input from ```challege_data```. An API call is then made to ```DirectionsService``` which returns directions for given querry.
* ```startDrive(origin,route)``` is then called which renders animation by updating marker on the provided direction array(```route```) incremently at short intervals.

## Problem Faced:
* ```OVER_QUERY_LIMIT```: json was huge and it was throwing this error as too many queries were being made. So to fix this, a delay function have been added.
* ```ZERO_RESULTS```: some json enteries were not valid so a security check has been edded to log 'Wrong Data' everytime they occurs.
* ```setPosition: not a LatLng or LatLngLiteral: not an Object``` still presists as LatLng are not provided in numeric form.
* As zoom orientation was getting changed on every new animation addition on map. It is disabled using ```{ preserveViewport: true }``` 