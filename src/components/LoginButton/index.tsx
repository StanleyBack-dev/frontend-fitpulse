"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import styles from "../../app/page.module.css";

export default function LoginButton() {
  const handleLogin = () => {
    const redirectUri = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/callback`;
    
    const scope = encodeURIComponent("openid profile email"); 
    
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const responseType = "code";

    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&access_type=offline&prompt=consent`;

    window.location.href = url;
  };

  return (
    <button className={styles.googleBtn} >
      <FcGoogle size={24} style={{ marginRight: 8 }} />
      Entrar com Google
    </button>
  );
}