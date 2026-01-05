import Image from "next/image";
import { User, Bell } from "lucide-react";
import styles from "./header.module.css";

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
}

export default function Header({ userName = "Atleta", userAvatar }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={40}
              height={40}
              className={styles.avatarImage}
            />
          ) : (
            <User size={20} />
          )}
        </div>
        <div>
          <p className={styles.greeting}>Olá, {userName}</p>
          <h2 className={styles.statusText}>Foco no objetivo! 🎯</h2>
        </div>
      </div>

      <button className={styles.iconBtn}>
        <Bell size={24} />
      </button>
    </header>
  );
}