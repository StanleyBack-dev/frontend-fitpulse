"use client";

interface AdBlockProps {
  ad: { id: number; x: number; y: number; content: string };
}

export default function AdBlock({ ad }: AdBlockProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: ad.y,
        left: ad.x,
        width: 150,
        height: 50,
        backgroundColor: "#7200d9",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        fontWeight: "bold",
      }}
    >
      {ad.content}
    </div>
  );
}