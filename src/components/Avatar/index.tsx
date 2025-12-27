"use client";

interface AvatarProps {
  participant: { id: number; name: string; x: number; y: number };
}

export default function Avatar({ participant }: AvatarProps) {
  return (
    <div
      style={{
        position: "absolute",
        top: participant.y,
        left: participant.x,
        width: 40,
        height: 40,
        borderRadius: "50%",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#000",
        fontWeight: "bold",
      }}
    >
      {participant.name[0]}
    </div>
  );
}