"use client";

import React from "react";
import dynamic from "next/dynamic";
import styles from "./home.module.css";

const MapPage = dynamic(() => import("../../components/Map/index"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <main className={styles.container}>
      <section className={styles.mapSection}>
        <MapPage />
      </section>
    </main>
  );
}