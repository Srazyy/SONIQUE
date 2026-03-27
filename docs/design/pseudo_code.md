# SONIQUE — Pseudo Code: Audio Classification Process (Process 4.0)

This is a primitive process from the Level-1 DFD — **"Classify Sound (ML Inference)"**.
It accepts a converted WAV file and GPS coordinates, runs the YAMNet model, and returns the top-3 classification predictions.

---

## Pseudo Code

```
PROCESS ClassifySound (wavFilePath, latitude, longitude)

BEGIN
    // ── Step 1: Load the audio file ──
    audioData ← READ wavFilePath
    IF audioData IS EMPTY THEN
        RETURN Error("Audio file is empty or corrupted")
    END IF

    // ── Step 2: Pre-process audio for YAMNet ──
    waveform ← CONVERT audioData TO float32 array
    waveform ← RESAMPLE waveform TO 16000 Hz
    waveform ← NORMALIZE waveform TO range [-1.0, 1.0]

    // ── Step 3: Load the YAMNet model ──
    model ← LOAD YAMNet FROM TensorFlow Hub
    classNames ← LOAD YAMNet class map (521 sound classes)

    // ── Step 4: Run inference ──
    scores, embeddings, spectrogram ← model.PREDICT(waveform)

    // ── Step 5: Aggregate scores across all time frames ──
    meanScores ← CALCULATE MEAN of scores ACROSS time axis

    // ── Step 6: Get top-3 predictions ──
    topIndices ← GET indices of 3 HIGHEST values in meanScores
    predictions ← EMPTY LIST

    FOR EACH index IN topIndices DO
        label     ← classNames[index]
        confidence ← meanScores[index] × 100   // as percentage
        APPEND { label, confidence } TO predictions
    END FOR

    // ── Step 7: Build result record ──
    result ← {
        "sound_label"   : predictions[0].label,
        "confidence"    : predictions[0].confidence,
        "top_3"         : predictions,
        "latitude"      : latitude,
        "longitude"     : longitude,
        "timestamp"     : CURRENT_DATETIME()
    }

    // ── Step 8: Clean up temporary file ──
    DELETE wavFilePath

    RETURN result
END
```

---

## Key Characteristics

| Property            | Value                          |
|---------------------|-------------------------------|
| **Process ID**      | 4.0                           |
| **Type**            | Primitive Process              |
| **Input**           | WAV audio file, GPS coords    |
| **Output**          | Top-3 predictions with scores |
| **ML Model**        | YAMNet (TensorFlow Hub)       |
| **Sample Rate**     | 16 000 Hz                     |
| **Classes**         | 521 AudioSet sound classes    |
| **Avg. Latency**    | < 3 seconds                   |
