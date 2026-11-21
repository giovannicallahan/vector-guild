#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
: "${ANDROID_PLATFORM_JAR:?Set ANDROID_PLATFORM_JAR to the SDK platform android.jar}"
: "${ANDROID_BUILD_TOOLS:?Set ANDROID_BUILD_TOOLS to the SDK build-tools directory}"
: "${SIGNING_KEYSTORE:?Set SIGNING_KEYSTORE to a keystore for signing}"
: "${SIGNING_PASSWORD:?Set SIGNING_PASSWORD to the keystore password}"
: "${SIGNING_ALIAS:?Set SIGNING_ALIAS to the key alias}"
build=build-direct
rm -rf "$build"
mkdir -p "$build/assets/game" "$build/classes" "$build/dex"
cp -R game/. "$build/assets/game/"
"$ANDROID_BUILD_TOOLS/aapt" package -f -M app/src/main/AndroidManifest.xml -S app/src/main/res -A "$build/assets" -I "$ANDROID_PLATFORM_JAR" -F "$build/unsigned.apk"
java com.sun.tools.javac.Main -source 8 -target 8 -classpath "$ANDROID_PLATFORM_JAR" -d "$build/classes" app/src/main/java/com/vectorguild/app/MainActivity.java
"$ANDROID_BUILD_TOOLS/d8" --min-api 23 --lib "$ANDROID_PLATFORM_JAR" --output "$build/dex" $(find "$build/classes" -name '*.class')
(cd "$build/dex" && zip -q ../unsigned.apk classes.dex)
"$ANDROID_BUILD_TOOLS/zipalign" -f 4 "$build/unsigned.apk" "$build/aligned.apk"
"$ANDROID_BUILD_TOOLS/apksigner" sign --ks "$SIGNING_KEYSTORE" --ks-key-alias "$SIGNING_ALIAS" --ks-pass env:SIGNING_PASSWORD --key-pass env:SIGNING_PASSWORD --out "$build/Vector-Guild.apk" "$build/aligned.apk"
"$ANDROID_BUILD_TOOLS/apksigner" verify --verbose "$build/Vector-Guild.apk"
