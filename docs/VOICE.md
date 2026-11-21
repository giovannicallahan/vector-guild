# Mira's recorded voice (MathCosmos 2.4)

Mira's briefing on each learn mission is a recorded clip, `game/voice/<pack>/<id>.m4a` (AAC, mono, about 40 kbit/s).
The game plays the clip when `game/voice/index.js` lists the mission, and falls back to the device's own speech
(the best installed English female voice) when a clip is missing or will not play. Practice missions use the device voice.

## How the clips are made
- Voice model: Kokoro v1.0 (open source, Apache 2.0), voice `af_heart`, speed 0.95, run locally with the
  `kokoro-onnx` Python package. Nothing is sent to an outside service.
- `node tools/voice-lines.js <pack> lines.json` writes the exact text the game speaks.
- `tools/voice/speak.py` turns symbols into words (− to "minus", Aᵀ to "A transpose", ‖x‖ to "the length of x").
- `tools/voice/render.py lines.json game/voice/<pack> af_heart` records every line (it skips clips that exist) and
  writes `manifest.json`, a short hash of each line's text.
- `node tools/voice-lines.js --index` rewrites `game/voice/index.js`; then `node tools/build-sw.js`.

## Check
`node tools/voice-lines.js --check` fails when a clip is missing or when a briefing's text has changed since it was
recorded (delete that clip and record again).
