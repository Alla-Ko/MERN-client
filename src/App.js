import Container from "@mui/material/Container";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { Header } from "./components";
import {
  AddPost,
  FilteredPosts,
  FullPost,
  Home,
  Login,
  Registration,
} from "./pages";
import { fetchAuthMe, selectIsAuth } from "./redux/slices/auth";

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<FullPost />} />
          <Route path="/edit-post/:id" element={<AddPost />} />
          <Route path="/add-post" element={<AddPost />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/tags/:tag" element={<FilteredPosts />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
