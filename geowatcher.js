    var asnaHelper = asnaHelper || {};

    asnaHelper.getGeoLocationManager = function() {
        var counter = 0;
        var captureSecondsInterval = 1000 * 10; // 10 second default capture interval.
        var watcher;
        var currentPosition = {
            "latitude": 0,
            "longitude": 0
        };

        var captureCallback;

        var emulateMovement = false;
        var movementFactor = .0145; // for emulated movement.
        var emulatedCurrentPosition = {
            "latitude": 0,
            "longitude": 0
        };

        function captureGeoLocation(options) {
            if (navigator.geolocation) {

                var timeoutVal = 10 * 1000 * 1000;
                // Use watchPosition instead of getCurrentPostion to poll for
                // constant location update.
                watcher = navigator.geolocation.watchPosition(
                    recordCurrentPosition,
                    displayError,
                    { enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 250 }
                );

                window.setTimeout( function () {
                    window.navigator.geolocation.clearWatch(watcher);
                },
                    5000 // Stop watchPosition after 5 seconds.
                );
            }
        };

        function recordCurrentPosition(position) {
            counter++;
            currentPosition.latitude = Number.parseFloat(position.coords.latitude.toFixed(4));
            currentPosition.longitude = Number.parseFloat(position.coords.longitude.toFixed(4));

            if (emulateMovement) {
                if (emulatedCurrentPosition.latitude == 0 && emulatedCurrentPosition.longitude == 0) {
                    emulatedCurrentPosition.latitude = currentPosition.latitude;
                    emulatedCurrentPosition.longitude = currentPosition.longitude;
                }
                emulatedCurrentPosition.latitude += movementFactor;
                emulatedCurrentPosition.longitude += movementFactor;
                emulatedCurrentPosition.latitude = Number.parseFloat(emulatedCurrentPosition.latitude.toFixed(4));
                emulatedCurrentPosition.longitude = Number.parseFloat(emulatedCurrentPosition.longitude.toFixed(4));
            }

            if (captureCallback && currentPosition.latitude !== 0) {
                if (!emulateMovement) {
                    captureCallback(currentPosition, counter);
                }
                else {
                    captureCallback(emulatedCurrentPosition, counter);
                }
            }
        }

        function displayError(error) {
            var errors = {
                1: 'Permission denied',
                2: 'Position unavailable',
                3: 'Request timeout'
            };
            console.log("Error: " + errors[error.code]);
        }

        function startGeoLocationCapture(options) {
            if (options) {
                showGeoWatcherCaptureToConsole = options.showGeoWatcherCaptureToConsole;
                captureSecondsInterval = options.captureSecondsInterval * 1000;
                latitudeElementId = options.latitudeElementId;
                longitudeElementId = options.longitudeElementId;
                captureCallback = options.captureCallback;
                emulateMovement = options.emulateMovement;
            }

            if (navigator.geolocation) {
                // A prime-the-pump capture, then captures recur every captureSecondsInterval.
                captureGeoLocation();
                setInterval(function () {
                    captureGeoLocation();
                }, captureSecondsInterval);
            }
            else {
                console.log("Geolocation is not supported by this browser");
            }
        }

        function calculateDistance(lat1, lon1, lat2, lon2, unit) {
            var radlat1 = Math.PI * lat1/180
            var radlat2 = Math.PI * lat2/180
            var theta = lon1-lon2
            var radtheta = Math.PI * theta/180
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist)
            dist = dist * 180/Math.PI
            dist = dist * 60 * 1.1515
            if (unit=="K") { dist = dist * 1.609344 }
            if (unit=="N") { dist = dist * 0.8684 }
            return dist
        }
        
        return {
            "startGeoLocationCapture": startGeoLocationCapture,
            "calculateDistance": calculateDistance
        }
    }();