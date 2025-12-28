"use client";
import React, { useState, useEffect } from 'react';
import styles from './sponsorTicker.module.css';

const sponsors = [
    { name: "AWS Cloud", logo: "https://placehold.co/120x40/232f3e/ffffff?text=AWS" },
    { name: "Vercel", logo: "https://placehold.co/120x40/000000/ffffff?text=▲+Vercel" },
    { name: "NVIDIA AI", logo: "https://placehold.co/120x40/76b900/ffffff?text=NVIDIA" },
];

export default function SponsorTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Gira os patrocinadores a cada 4 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sponsors.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const currentSponsor = sponsors[currentIndex];

    return (
        <div className={styles.tickerContainer}>
            <span className={styles.label}>Patrocínio:</span>
            <div className={styles.logoWrapper}>
               {/* Usando key para forçar a animação de fade a cada troca */}
               <img 
                 key={currentSponsor.name}
                 src={currentSponsor.logo} 
                 alt={currentSponsor.name} 
                 className={styles.logo} 
               />
            </div>
        </div>
    );
}