export default () => ({
  expo: {
    name: "MiAppExpo",
    slug: "miapp-expo",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    scheme: "miapp",
    platforms: ["android", "ios", "web"],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.faubla.miappexpo",  // <-- Aquí agregas esto
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true,
      permissions: ["CAMERA", "READ_MEDIA_IMAGES"]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      API_BASE_URL: "https://0c02b3631832.ngrok-free.app/api",
      eas: {
        projectId: "17fb85d8-bc92-4997-88b1-45a8d8ead9e7"
      }
    },
    owner: "faubla",
    eas: {
      projectId: "17fb85d8-bc92-4997-88b1-45a8d8ead9e7"
    }
  }
});
