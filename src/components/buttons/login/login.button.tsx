"use client";
import React from "react";
import { FcGoogle } from "react-icons/fc";
import styles from "./login.module.css";
import { googleLogin } from "../../../services/auth/login/loginAuth.service";

export default function LoginButton() {
  return (
    <button className={styles.googleBtn} onClick={googleLogin}>
      <FcGoogle size={24} style={{ marginRight: 8 }} />
      Entrar com Google
    </button>
  );
}