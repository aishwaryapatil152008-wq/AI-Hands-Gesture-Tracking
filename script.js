const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const status = document.getElementById("status");

// Create MediaPipe Hands
const hands = new Hands({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
    }
});

// Configure hand tracking
hands.setOptions({
    maxNumHands: 2,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

// Receive MediaPipe results
hands.onResults((results) => {

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks.length > 0) {

        status.innerText =
            "Hands detected: " +
            results.multiHandLandmarks.length;

        for (const landmarks of results.multiHandLandmarks) {

            // Draw connections
            drawConnectors(
                ctx,
                landmarks,
                HAND_CONNECTIONS,
                {
                    color: "#00FF00",
                    lineWidth: 4
                }
            );

            // Draw points
            drawLandmarks(
                ctx,
                landmarks,
                {
                    color: "#00FFFF",
                    lineWidth: 2,
                    radius: 5
                }
            );
        }

    } else {

        status.innerText = "Show your hand to the camera";
    }
});

// Start webcam
const camera = new Camera(video, {

    onFrame: async () => {
        await hands.send({
            image: video
        });
    },

    width: 1280,
    height: 720

});

camera.start();