##GeoWatcher JavaScript module

This JavaScript module uses JavaScript's geolocation object to report the current longitude and latitude as reported by the mobile device.


### Public methods

**startGeoWatch**

Start capturing the geo location.

**stopGeoWatch**

Stop capturing the geo location. 


### Configuration options

The available configuration options are:

**showGeoWatchCaptureToConsole**

If true, show captured locations to the console.

**captureSecondsInterval**
 
Number of seconds to wait between reporting the captured location.

This module uses the geolocation object's [`watchPosition`](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition#Specifications) method. The documentation says this method is called each time the position of the device changes. I'm not sure what the API designers consider a position change, but this routine is mighty busy on my non-moving desktop PC! `captureSecondsInterval` doesn't control how often the `watchPosition` method is called (it's called by the device); it controls how often the most recently captured location is reported to the function specified by the `captureCallback` function.  

**captureCallback** 

A callback function that will be called each time the location is captured. This function is passed this position object:
 
	{
    	"latitude": n,
        "longitude": m
	}

In most uses of this module, you'd return the values captured to the server with Ajax in this callback. The geo locations values returned are truncated to four decimal places.
  
**emulateMovement**

If true, movement is emulated for desktop-bound testing purposes. The increment value is currently controlled by the movementFactor value. Its default is .0145&mdash;which is about one mile. 

**latitudeElementId and longitudeElementId (optional)**

These provide optional element ids for two hidden fields to which the captured coordinates are recorded. These hidden elements would only be of value if you wanted to read the coordinates after having submitted a form to the server. Generally the intent here is that you'd return the values to the server with Ajax from the `captureCallback` function.     

**Example usage:**

    var options = {
        "showGeoWatcherCaptureToConsole": false,
        "captureSecondsInterval": 6,
        "captureCallback": getLocationCaptured,
        "emulateMovement": true,
        "latitudeElementId": "latitude",
        "longitudeElementId": "longitude"
    };

    asnaHelper.getGeoLocationManager.startGeoWatch(options);

    function getLocationCaptured(position) {
        // This function is called every captureSecondsInterval with the
        // most recently captured location.
        console.log("latitude: " + position.latitude);
        console.log("longitude: " + position.longitude);

		// Use Ajax here to pass the captured values back to the server. 
    }