import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Xclusive Glow — Luxury Beauty & Fashion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const iconBuffer = await readFile(
    join(process.cwd(), "public/logo/xclusive-glow-icon.png")
  );
  const iconSrc = `data:image/png;base64,${iconBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#fbf7f1",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={iconSrc} width={220} height={118} alt="" />
        <div
          style={{
            marginTop: 28,
            fontSize: 64,
            fontFamily: "serif",
            letterSpacing: 4,
            color: "#2a1c18",
          }}
        >
          XCLUSIVE GLOW
        </div>
        <div
          style={{
            marginTop: 14,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#7a655a",
          }}
        >
          Beauty &middot; Fashion &middot; Lifestyle
        </div>
      </div>
    ),
    { ...size }
  );
}
