import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

// One generated share image for every page: /og?title=Merge%20PDF
export async function GET(req: NextRequest) {
  const title = (req.nextUrl.searchParams.get("title") || "Free Online PDF Tools").slice(0, 80);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #0066cc 0%, #003d7a 100%)",
          color: "white",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "white",
              color: "#0066cc",
              fontSize: 48,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            T
          </div>
          <div style={{ fontSize: 44, fontWeight: 800 }}>ToolsTree</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 34, opacity: 0.85 }}>Free. Private. Works in your browser.</div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
