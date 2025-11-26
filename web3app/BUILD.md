# APK Build Talimatları

## Android Studio ile Build

1. Android Studio'yu açın
2. `File > Open` ile projeyi açın
3. `Build > Build Bundle(s) / APK(s) > Build APK(s)` seçin
4. Build tamamlandığında APK dosyası `app/build/outputs/apk/debug/app-debug.apk` konumunda olacak

## Command Line ile Build

### Debug APK
```bash
./gradlew assembleDebug
```

### Release APK
```bash
./gradlew assembleRelease
```

Release APK için keystore gerekir. Keystore oluşturmak için:
```bash
keytool -genkey -v -keystore cyberex-web3.keystore -alias cyberex -keyalg RSA -keysize 2048 -validity 10000
```

Sonra `app/build.gradle.kts` dosyasına signing config ekleyin.

## APK Konumu

- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release.apk`

## Yayınlama

APK'yı `cyberex.com.tr/web3app` adresine yükleyebilirsiniz.


