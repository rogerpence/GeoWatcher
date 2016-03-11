    var asnaHelper = asnaHelper || {};

    asnaHelper.getGeoLocationManager = function() {
        var counter = 0;
        var showGeoWatcherCaptureToConsole = true;
        var captureSecondsInterval = 1000 * 10; // 10 second default capture interval.
        var watcher;
        var currentPosition = {
            "latitude": 0,
            "longitude": 0
        };
        var latitudeElementId;
        var longitudeElementId;
        var captureCallback;
        var emulateMovement = false;
        var movementFactor = .0145;
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

            if (showGeoWatcherCaptureToConsole) {
                console.log("Counter: " + (++counter));
                if (!emulateMovement) {
                    console.log("Latitude: " + currentPosition.latitude);
                    console.log("Longitude: " + currentPosition.longitude);
                }
                else {
                    console.log("EmulatedLatitude: " + emulatedCurrentPosition.latitude);
                    console.log("EmulatedLongitude: " + emulatedCurrentPosition.longitude);
                }
            }

            if (captureCallback && currentPosition.latitude !== 0) {
                if (!emulateMovement) {
                    refreshHiddenElements(currentPosition);
                    captureCallback(currentPosition);
                }
                else {
                    refreshHiddenElements(emulatedCurrentPosition);
                    captureCallback(emulatedCurrentPosition);
                }
            }
        }

        function refreshHiddenElements(position) {
            if (!!document.getElementById(latitudeElementId) && !!document.getElementById(longitudeElementId)) {
                document.getElementById(latitudeElementId).value = position.latitude;
                document.getElementById(longitudeElementId).value = position.longitude;
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

        return {
            "startGeoLocationCapture": startGeoLocationCapture
        }
    }();