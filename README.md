##GeoWatcher JavaScript module

This JavaScript module uses JavaScript's geolocation object to report the current longitude and latitude as reported by the mobile device.


### Public methods

**startGeoLocationCapture**

Start capturing the geo location.


### Configuration options

The available configuration options are:

**showGeoWatchCaptureToConsole**

If true, show captured locations to the console.

**captureSecondsInterval**
 
Number of seconds to wait between reporting the captured location.

This module uses the geolocation object's [`watchPosition`](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/watchPosition#Specifications) method. The documentation says this method is called each time the position of the device changes, I think that's true for Chrome but FireFox seems to call this in a very short loop continually. So, each time `watchPostion` is called this module stops it after five seconds; but the `setInterval` in `startGeoLocatonCapture` calls it every `captureSecondsInterval.` 

**captureCallback** 

A callback function that will be called every `captureSecondsInterval.` This function is passed this position object:
 
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
        var data = {
            Latitude: position.latitude.toFixed(4),
            Longitude: position.longitude.toFixed(4)
        }

        var jsonString = JSON.stringify(data);
      
        var jqxhr = $.ajax(
            {
                url: 'action/add',
                data: jsonString,
                type: 'POST',
                contentType: 'application/json',
                dataType: 'json'
            }
        )
        .done(function (retdata) {
            console.log("success:" + retdata);
        })
        .fail(function (retdata) {
            console.log("error:" + retdata);
        })
        .always(function () {
            //alert("finished");
        });
    }