import json, sys, os, subprocess, hashlib, soundfile as sf
from kokoro_onnx import Kokoro
from speak import spoken
src, out, voice = sys.argv[1], sys.argv[2], sys.argv[3]
k = Kokoro("kokoro-v1.0.onnx", "voices-v1.0.bin")
os.makedirs(out, exist_ok=True)
man = {}
for qid, text in json.load(open(src)).items():
    if os.path.exists(os.path.join(out, qid + '.m4a')) and not os.path.exists(os.path.join(out, qid + '.wav')):
        man[qid] = hashlib.sha1(text.encode()).hexdigest()[:10]; continue
    a, sr = k.create(spoken(text), voice=voice, speed=0.95, lang="en-us")
    wav = os.path.join(out, qid + '.wav'); sf.write(wav, a, sr)
    subprocess.run(['afconvert', '-f', 'm4af', '-d', 'aac', '-b', '40000', '-c', '1', wav, os.path.join(out, qid + '.m4a')], check=True)
    os.remove(wav); man[qid] = hashlib.sha1(text.encode()).hexdigest()[:10]
    print(qid, round(len(a) / sr, 1), flush=True)
json.dump(man, open(os.path.join(out, 'manifest.json'), 'w'))
