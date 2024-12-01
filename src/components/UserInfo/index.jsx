import React from "react";
import styles from "./UserInfo.module.scss";

export const UserInfo = ({ avatarUrl, fullname, additionalText }) => {
  // Перевірка, чи avatarUrl починається з /upload
  const avatarSrc =
    avatarUrl && avatarUrl.startsWith("/uploads")
      ? `http://localhost:4444${avatarUrl}` // Додаємо базовий URL перед шляхом до аватарки
      : avatarUrl || "/noavatar.png"; // Якщо avatarUrl відсутнє, використовуємо default аватарку

  return (
    <div className={styles.root}>
      <img
        className={styles.avatar}
        src={avatarSrc} // Використовуємо avatarSrc
        alt={fullname}
      />
      <div className={styles.userDetails}>
        <span className={styles.userName}>{fullname}</span>
        <span className={styles.additional}>{additionalText}</span>
      </div>
    </div>
  );
};
