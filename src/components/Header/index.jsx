import Button from "@mui/material/Button";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import Container from "@mui/material/Container";
import { logout, selectIsAuth } from "../../redux/slices/auth";
import styles from "./Header.module.scss";

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  const onClickLogout = () => {
    if (window.confirm("Вы действительно хотите выйти?")) {
      dispatch(logout());
      window.localStorage.removeItem("token");
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <Link className={styles.logo} to="/">
            <div>Kokhaniuk Homework MERN</div>
          </Link>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/add-post">
                  <Button variant="contained">Написати статтю</Button>
                </Link>
                <Button
                  onClick={onClickLogout}
                  variant="contained"
                  color="error"
                >
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Увійти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Створити аккаунт</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};
