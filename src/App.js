import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";
import SignInPage from "./pages/SignInPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <div>
      <AuthProvider>
        <Routes>
          <Route path="sign-up" element={<SignUpPage></SignUpPage>}></Route>
          <Route path="sign-in" element={<SignInPage></SignInPage>}></Route>
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
