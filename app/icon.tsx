import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
          color: "#fff",
          fontSize: 24,
          fontFamily: "Helvetica, Arial, sans-serif",
          fontWeight: 500,
          letterSpacing: "-0.04em",
        }}
      >
        N
      </div>
    ),
    size
  );
}
