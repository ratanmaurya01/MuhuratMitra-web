
export default function manifest() {
  return {
    id: "/",
    name: "MuhuratMitra",
    short_name: "MuhuratMitra",
    description: "आपका दैनिक पंचांग और शुभ मुहूर्त साथी।",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#E8590C",
    lang: "hi",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
