import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { X, Camera, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BarcodeScanner({ isOpen, onClose, onScan }) {
    const videoRef = useRef(null);
    const codeReaderRef = useRef(null);
    const [devices, setDevices] = useState([]);
    const [selectedDeviceId, setSelectedDeviceId] = useState("");
    const [isScanning, setIsScanning] = useState(false);
    const [error, setError] = useState("");
    const [lastScanned, setLastScanned] = useState("");

    // Initialize code reader
    useEffect(() => {
        if (!isOpen) return;

        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        // Get available video input devices using static method
        const getDevices = async () => {
            try {
                // Request camera permission first
                await navigator.mediaDevices.getUserMedia({ video: true })
                    .then(stream => {
                        // Stop the stream immediately, we just needed permission
                        stream.getTracks().forEach(track => track.stop());
                    });

                // Now enumerate devices
                const videoInputDevices = await BrowserMultiFormatReader.listVideoInputDevices();

                if (videoInputDevices.length > 0) {
                    setDevices(videoInputDevices);
                    setSelectedDeviceId(videoInputDevices[0].deviceId);
                } else {
                    setError("No camera devices found");
                }
            } catch (err) {
                console.error("Error listing devices:", err);
                setError("Failed to access camera. Please grant camera permission.");
            }
        };

        getDevices();

        return () => {
            stopScanning();
        };
    }, [isOpen]);

    // Start scanning when device is selected
    useEffect(() => {
        if (selectedDeviceId && isOpen && !isScanning) {
            startScanning();
        }
    }, [selectedDeviceId, isOpen]);

    const startScanning = async () => {
        if (!codeReaderRef.current || !videoRef.current || !selectedDeviceId) return;

        try {
            setIsScanning(true);
            setError("");

            await codeReaderRef.current.decodeFromVideoDevice(
                selectedDeviceId,
                videoRef.current,
                (result, err) => {
                    if (result) {
                        const scannedText = result.getText();
                        // Prevent duplicate scans
                        if (scannedText !== lastScanned) {
                            setLastScanned(scannedText);
                            onScan(scannedText);
                            // Allow scanning again after a short delay
                            setTimeout(() => setLastScanned(""), 2000);
                        }
                    }
                    if (err && err.name !== "NotFoundException") {
                        console.error("Scanning error:", err);
                    }
                }
            );
        } catch (err) {
            console.error("Error starting scanner:", err);
            setError(`Failed to start scanner: ${err.message}`);
            setIsScanning(false);
        }
    };

    const stopScanning = () => {
        if (codeReaderRef.current) {
            codeReaderRef.current.reset();
            setIsScanning(false);
        }
    };

    const handleDeviceChange = (e) => {
        stopScanning();
        setSelectedDeviceId(e.target.value);
    };

    const handleClose = () => {
        stopScanning();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-auto shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 flex items-center justify-between rounded-t-xl">
                    <div className="flex items-center gap-3">
                        <Camera className="w-6 h-6 text-white" />
                        <h2 className="text-xl font-bold text-white">Barcode Scanner</h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Camera Selection */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Camera Source
                        </label>
                        <select
                            value={selectedDeviceId}
                            onChange={handleDeviceChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
                            disabled={devices.length === 0}
                        >
                            {devices.map((device) => (
                                <option key={device.deviceId} value={device.deviceId}>
                                    {device.label || `Camera ${devices.indexOf(device) + 1}`}
                                </option>
                            ))}
                        </select>
                        <p className="mt-2 text-xs text-gray-500">
                            Select your integrated camera, USB camera, or DroidCam. Make sure the camera is connected and permitted.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <p className="text-sm font-semibold text-red-800">Error</p>
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Video Preview */}
                    <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            autoPlay
                            playsInline
                            muted
                        />
                        {!isScanning && !error && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                <div className="text-center text-white">
                                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">Initializing camera...</p>
                                </div>
                            </div>
                        )}
                        {isScanning && (
                            <div className="absolute top-4 left-4 right-4">
                                <div className="bg-green-500/90 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center">
                                    📷 Scanning... Point camera at barcode
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">Instructions</h3>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Hold the barcode steady in front of the camera</li>
                            <li>Ensure good lighting for best results</li>
                            <li>The item will be automatically added to cart when detected</li>
                            <li>Switch camera sources if needed using the dropdown above</li>
                        </ul>
                    </div>

                    {/* Close Button */}
                    <div className="mt-6 flex justify-end">
                        <Button
                            onClick={handleClose}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6"
                        >
                            Close Scanner
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
