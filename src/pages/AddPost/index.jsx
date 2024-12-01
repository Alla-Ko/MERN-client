import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import axios from "../../axios";
import { selectIsAuth } from "../../redux/slices/auth";
import styles from "./AddPost.module.scss";

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [image, setImage] = React.useState(null); // Зберігаємо файл зображення
  const [removeImage, setRemoveImage] = React.useState(false); // Перемикач для видалення зображення
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = (event) => {
    const file = event.target.files[0];
    setImage(file); // Зберігаємо файл зображення
    setRemoveImage(false); // Якщо завантажили нове зображення, скидаємо прапор видалення
  };

  const onClickRemoveImage = () => {
    setImage(null); // Видаляємо зображення
    setRemoveImage(true); // Встановлюємо прапор для видалення
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async () => {
    try {
      setLoading(true);

      // Формуємо FormData
      const formData = new FormData();
      formData.append("title", title);
      formData.append("text", text);
      formData.append("tags", tags);

      // Якщо є нове зображення, додаємо його в FormData
      if (image) {
        formData.append("image", image);
      }

      // Додаємо поле для видалення зображення, якщо потрібно
      if (removeImage) {
        formData.append("removeImage", "true");
      }

      // Виконуємо POST запит для створення/оновлення поста
      console.log(formData);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      const { data } = isEditing
        ? await axios.patch(`/posts/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axios.post("/posts", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      const _id = isEditing ? id : data._id;
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert(`Помилка при створенні/редагуванні статті!`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (id) {
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setImage(data.imageUrl); // Завантажуємо існуючий файл (якщо є)
          setTags(data.tags.join(","));
        })
        .catch((err) => {
          console.warn(err);
          alert("Помилка при отриманні статті!");
        });
    }
  }, [id]);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введіть текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );

  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Завантажити превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {image && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Видалити
          </Button>
          <img
            className={styles.image}
            src={image ? `http://localhost:4444${image}` : ""}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button
          onClick={onSubmit}
          size="large"
          variant="contained"
          disabled={isLoading}
        >
          {isEditing ? "Сохранить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
