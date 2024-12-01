import Button from "@mui/material/Button";
import React from "react";
import ReactMarkdown from "react-markdown";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import { Post } from "../components/Post";
import { selectIsAuth, selectUserId } from "../redux/slices/auth"; // Додано selectUserId для отримання id користувача

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  // Отримуємо статус авторизації та id користувача
  const isAuth = useSelector(selectIsAuth);
  const currentUserId = useSelector(selectUserId); // Поточний ID користувача

  React.useEffect(() => {
    axios
      .get(`/posts/${id}`)
      .then((res) => {
        if (!res.data) {
          throw new Error("Стаття не знайдена");
        }
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn(err);
        alert("Помилка при отриманні статті");
        navigate("/"); // Перенаправлення на головну
      });
  }, [id, navigate]);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost />;
  }

  const isAuthor = currentUserId === data.user._id; // Перевірка, чи є поточний користувач автором статті
  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat("uk-UA", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ""}
        user={data.user}
        createdAt={formatDate(data.createdAt)}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>

      {/* Якщо користувач авторизований і є автором статті, додаємо кнопки для редагування і видалення */}
      {isAuth && isAuthor && (
        <div>
          <Button
            variant="contained"
            sx={{ marginRight: "10px" }}
            onClick={() => navigate(`/edit-post/${data._id}`)}
          >
            Редагувати статтю
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              if (window.confirm("Ви дійсно хочете видалити статтю?")) {
                axios
                  .delete(`/posts/${data._id}`)
                  .then(() => {
                    alert("Стаття видалена!");
                    navigate("/"); // Перенаправлення на головну після видалення
                  })
                  .catch((err) => {
                    console.error(err);
                    alert("Помилка при видаленні статті");
                  });
              }
            }}
          >
            Видалити статтю
          </Button>
        </div>
      )}

      <CommentsBlock
        items={[
          {
            user: {
              fullName: "Вася Пупкин",
              avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
            },
            text: "Васін коментар міг би бути отут",
          },
          {
            user: {
              fullName: "Іван Іванов",
              avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
            },
            text: "Коментар Івана теж міг би бути тут",
          },
        ]}
        isLoading={false}
      >
        <Index />
      </CommentsBlock>
    </>
  );
};
