import React, { useState, useRef } from "react";
import StarBorder from "./StarBorder";
import { useToast } from "@/hooks/use-toast";

interface RecorderProps {
  onSoundClassified: (lat: number, lng: number, results: Array<{ label: string; confidence: number }>) => void;
}

const Recorder = ({ onSoundClassified }: RecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [detectedSound, setDetectedSound] = useState<Array<{ label: string; confidence: number }> | null>(null);
  const { toast } = useToast();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Get location
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const loc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setLocation(loc);

      // Get audio stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);

        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("lat", loc.lat.toString());
        formData.append("lng", loc.lng.toString());

        setIsUploading(true);
        
        // Update this URL to your backend endpoint
        fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Response from server:", data);
            setDetectedSound(data.results);
            onSoundClassified(data.lat, data.lng, data.results);
            toast({
              title: "Sound Classified!",
              description: `Detected: ${data.results[0]?.label}`,
            });
          })
          .catch((err) => {
            console.error("Upload failed", err);
            toast({
              title: "Upload Failed",
              description: "Could not connect to backend. Make sure your Flask server is running.",
              variant: "destructive",
            });
          })
          .finally(() => setIsUploading(false));
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);

      // Record for 5 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());
        }
      }, 5000);
    } catch (err) {
      console.error("Error accessing mic or location", err);
      toast({
        title: "Access Denied",
        description: "Please allow microphone and location access.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex w-full justify-center">
        <StarBorder
          onClick={startRecording}
          as="button"
          className="cursor-pointer"
          color="hsl(var(--primary))"
          speed="10s"
          disabled={isRecording || isUploading}
        >
          {isRecording
            ? "Recording... (5s)"
            : isUploading
            ? "Analyzing..."
            : "🎙️ Start Recording"}
        </StarBorder>
      </div>

      {audioURL && (
        <div className="space-y-3">
          <div className="flex justify-center">
            <p className="text-accent font-medium">Recording Complete</p>
          </div>
          <div className="flex justify-center">
            <audio
              className="w-full max-w-sm rounded-lg"
              controls
              src={audioURL}
            />
          </div>
        </div>
      )}

      {location && (
        <p className="text-sm text-muted-foreground text-center">
          📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
        </p>
      )}

      {detectedSound && (
        <div className="flex justify-center">
          <div className="bg-card border border-primary/20 rounded-xl p-6 max-w-md w-full">
            <p className="text-primary font-bold text-lg mb-3">🎵 Detected Sounds:</p>
            <ul className="space-y-2">
              {detectedSound.map((r, i) => (
                <li key={i} className="flex justify-between items-center">
                  <span className="text-foreground">{r.label}</span>
                  <span className="text-accent font-semibold">
                    {(r.confidence * 100).toFixed(1)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recorder;
