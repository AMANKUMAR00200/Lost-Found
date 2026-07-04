import { useEffect, useRef, useState } from "react";

function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [cameraOpen, setCameraOpen] = useState(false);

  // Open Camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
        },
      });

      setStream(mediaStream);
      setCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("Camera access denied or not supported.");
      console.log(err);
    }
  };

  // Capture Photo
  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const file = new File([blob], "capture.jpg", {
        type: "image/jpeg",
      });

      onCapture(file);

      closeCamera();
    }, "image/jpeg");
  };

  // Close Camera
  const closeCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());

    setCameraOpen(false);
  };

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  return (
    <>
      {!cameraOpen ? (
        <button
          type="button"
          onClick={openCamera}
          className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl p-3"
        >
          📸 Open Camera
        </button>
      ) : (
        <div className="space-y-4">

          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full rounded-xl"
          />

          <canvas
            ref={canvasRef}
            hidden
          />

          <div className="flex gap-3">

            <button
              type="button"
              onClick={capturePhoto}
              className="flex-1 bg-blue-600 text-white rounded-xl p-3"
            >
              📷 Capture
            </button>

            <button
              type="button"
              onClick={closeCamera}
              className="flex-1 bg-red-600 text-white rounded-xl p-3"
            >
              ✖ Close
            </button>

          </div>

        </div>
      )}
    </>
  );
}

export default CameraCapture;