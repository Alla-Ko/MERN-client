import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  fetchAuth,
  fetchRegister,
  selectIsAuth,
  selectUserId,
  updateUser,
  uploadAvatar,
} from "../../redux/slices/auth";

export const Registration = () => {
  const isAuth = useSelector(selectIsAuth);
  
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null); // Зберігаємо файл аватарки
  const [errorMessage, setErrorMessage] = useState(""); // Для відображення помилок

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      fullname: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (values) => {
    try {
      // Крок 1: Реєстрація користувача
      const registerResponse = await dispatch(fetchRegister(values));

      if (!registerResponse.payload) {
        setErrorMessage("Не вдалося зареєструватися!"); // Виводимо помилку, якщо не вдалося зареєструватися
        return;
      }

      if ("token" in registerResponse.payload) {
        // Зберігаємо токен
        window.localStorage.setItem("token", registerResponse.payload.token);

        // Крок 2: Логін користувача після реєстрації
        const loginResponse = await dispatch(
          fetchAuth({ email: values.email, password: values.password })
        );

        if (!loginResponse.payload || !("token" in loginResponse.payload)) {
          setErrorMessage("Не вдалося виконати автоматичний вхід!"); // Виводимо помилку для автоматичного входу
          return;
        }
        window.localStorage.setItem("token", loginResponse.payload.token);

        // Крок 3: Завантаження аватарки (якщо файл обраний)





				
        if (avatarFile) {
          const formData = new FormData();
          formData.append("image", avatarFile);

          const uploadResponse = await dispatch(uploadAvatar(formData));

          if (uploadResponse.payload && uploadResponse.payload.url) {
            // Оновлення користувача аватаркою
            await dispatch(
              updateUser({
                userId: loginResponse.payload._id, // Використовуємо currentUserId тут
                updates: { avatarUrl: uploadResponse.payload.url },
              })
            );
          } else {
            setErrorMessage("Помилка завантаження аватарки!"); // Виводимо помилку завантаження аватарки
          }
        }
      } else {
        setErrorMessage("Сталася невідома помилка при реєстрації!"); // Загальна помилка
      }
    } catch (error) {
      setErrorMessage("Сталася помилка, спробуйте пізніше!"); // Обробка помилок на всіх етапах
    }
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setAvatarFile(file); // Зберігаємо файл аватарки у стані
    }
  };

  if (isAuth) {
    return <Navigate to="/" />; // Перенаправлення на головну сторінку після успішного логіну
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mt: 8,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Створення аккаунта
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextField
            fullWidth
            label="Повне ім'я"
            variant="outlined"
            margin="normal"
            {...register("fullname", { required: "Вкажіть повне ім'я" })}
            error={!!errors.fullname}
            helperText={errors.fullname?.message}
          />

          <TextField
            fullWidth
            label="E-Mail"
            variant="outlined"
            margin="normal"
            {...register("email", { required: "Вкажіть пошту" })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          <TextField
            fullWidth
            label="Пароль"
            type="password"
            variant="outlined"
            margin="normal"
            {...register("password", { required: "Вкажіть пароль" })}
            error={!!errors.password}
            helperText={errors.password?.message}
          />

          {/* Поле для вибору аватарки */}
          <input
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ marginTop: 20 }}
          />

          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 3, mb: 2 }}
            disabled={!isValid}
          >
            Зареєструватися
          </Button>
        </form>

        {/* Виведення помилок */}
        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Typography>
        )}
      </Box>
    </Container>
  );
};
