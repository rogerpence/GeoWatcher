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

        function startGeoWatch(options) {
            if (options) {
                showGeoWatcherCaptureToConsole = options.showGeoWatcherCaptureToConsole;
                captureSecondsInterval = options.captureSecondsInterval * 1000;
                latitudeElementId = options.latitudeElementId;
                longitudeElementId = options.longitudeElementId;
                captureCallback = options.captureCallback;
                emulateMovement = options.emulateMovement;
            }

            if (navigator.geolocation) {
                setInterval(function() {
                    // watchPosition calls are indeterminate. Let watchPosition
                    // load the HTML DOM elements as it may, but every n seconds
                    // (ten, in this case) report geo coordinates. This proves
                    // those values are there are for either Ajax or an ASP.NET
                    // postback.

                    var targetElementsExist = !!document.getElementById(latitudeElementId) &&
                                              !!document.getElementById(longitudeElementId);
                    if (targetElementsExist) {
                        document.getElementById(latitudeElementId).value = currentPosition.latitude;
                        document.getElementById(longitudeElementId).value = currentPosition.longitude;
                    }

                    if (captureCallback && currentPosition.latitude !== 0) {
                        if (!emulateMovement) {
                            captureCallback(currentPosition);
                        }
                        else {
                            captureCallback(emulatedCurrentPosition);
                        }
                    }
                }, captureSecondsInterval);

                var timeoutVal = 10 * 1000 * 1000;
                // Use watchPosition instead of getCurrentPostion to poll for
                // constant location update.
                watcher = navigator.geolocation.watchPosition(
                    recordCurrentPosition,
                    displayError,
                    {enableHighAccuracy: true, timeout: timeoutVal, maximumAge: 0}
                );

            }
            else {
                console.log("Geolocation is not supported by this browser");
            }
        }

        function stopGeoWatch() {
            navigator.geolocation.clearWatch(watcher);
        }

        function recordCurrentPosition(position) {
            currentPosition.latitude = Number.parseFloat(position.coords.latitude.toFixed(4));
            currentPosition.longitude = Number.parseFloat(position.coords.longitude.toFixed(4));
            // currentPosition.latitude = Number.parseFloat(currentPosition.latitude.toFixed(4));
            // currentPosition.longitude = Number.parseFloat(currentPosition.longitude.toFixed(4));

            if (emulateMovement) {
                if (emulatedCurrentPosition.latitude==0 && emulatedCurrentPosition.longitude==0) {
                    emulatedCurrentPosition.latitude = currentPosition.latitude;
                    emulatedCurrentPosition.longitude = currentPosition.longitude;
                }
                emulatedCurrentPosition.latitude += movementFactor;
                emulatedCurrentPosition.longitude += movementFactor;
                emulatedCurrentPosition.latitude = Number.parseFloat(emulatedCurrentPosition.latitude.toFixed(4));
                emulatedCurrentPosition.longitude = Number.parseFloat(emulatedCurrentPosition.longitude.toFixed(4));
            }

            if (showGeoWatcherCaptureToConsole) {
                console.log("Counter: "  + (++counter));
                if (!emulateMovement) {
                    console.log("Latitude: " + currentPosition.latitude);
                    console.log("Longitude: " + currentPosition.longitude);
                }
                else {
                    console.log("EmulatedLatitude: " + emulatedCurrentPosition.latitude);
                    console.log("EmulatedLongitude: " + emulatedCurrentPosition.longitude);
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

        return {
            "startGeoWatch": startGeoWatch,
            "stopGeoWatch": stopGeoWatch
        }
    }();

    var options = {
        "showGeoWatcherCaptureToConsole": false,
        "captureSecondsInterval": 6,
        "captureCallback": getLocationCaptured,
        "emulateMovement": true
        // "latitudeElementId": "latitudexx",
        // "longitudeElementId": "longitudexx",
    };

    asnaHelper.getGeoLocationManager.startGeoWatch(options);

    function getLocationCaptured(position) {
        // This function is called every captureSecondsInterval with the
        // most recently captured location.
        console.log('--------------------');
        console.log("latitude: " + position.latitude);
        console.log("longitude: " + position.longitude);
    }