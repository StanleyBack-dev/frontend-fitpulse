import React from "react";
import styles from "./terrain.module.css";

export default function TerrainLayer() {
  return (
    <div className={styles.terrain}>
      <div className={styles.zone} style={{ top: "15%", left: "20%" }} />
      <div className={styles.zone} style={{ top: "60%", left: "65%" }} />
      <div className={styles.zone} style={{ top: "40%", left: "45%" }} />
    </div>
  );
}