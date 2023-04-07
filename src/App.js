import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";
import PostDetailsPage from "./pages/PostDetailPage";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage></HomePage>}></Route>
          <Route path="sign-up" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="sign-in" element={<SignInPage></SignInPage>}></Route>
          <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
          <Route
            path="/:slug"
            element={<PostDetailsPage></PostDetailsPage>}
          ></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
