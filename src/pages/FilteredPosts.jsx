import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { CommentsBlock } from "../components/CommentsBlock";
import { Post } from "../components/Post";
import { TagsBlock } from "../components/TagsBlock";
import { fetchPostsByTag, fetchTags } from "../redux/slices/posts";

export const FilteredPosts = () => {
  const dispatch = useDispatch();
  const { tag } = useParams(); // Отримуємо назву хештега з URL
  const { posts, tags } = useSelector((state) => state.posts);
  const isPostsLoading = posts.status === "loading";
  const isTagsLoading = tags.status === "loading";

  // Викликаємо fetchPostsByTag тільки при зміні tag
  useEffect(() => {
    dispatch(fetchPostsByTag(tag)); // Завантажуємо пости для вказаного хештега
    dispatch(fetchTags()); // Завантажуємо всі теги
  }, [tag, dispatch]); // Додано dispatch як залежність

  return (
    <>
      <Tabs
        style={{ marginBottom: 15 }}
        value={0}
        aria-label="basic tabs example"
      >
        <Tab label="Новые" />
        <Tab label="Популярные" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid item xs={8}>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              <Post
                key={obj._id}
                id={obj._id}
                title={obj.title}
                imageUrl={
                  obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ""
                }
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
              />
            )
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
          <CommentsBlock
            items={[
              {
                user: {
                  fullName: "Вася Пупкин",
                  avatarUrl: "https://mui.com/static/images/avatar/1.jpg",
                },
                text: "Это тестовый комментарий",
              },
              {
                user: {
                  fullName: "Иван Иванов",
                  avatarUrl: "https://mui.com/static/images/avatar/2.jpg",
                },
                text: "When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top",
              },
            ]}
            isLoading={false}
          />
        </Grid>
      </Grid>
    </>
  );
};
