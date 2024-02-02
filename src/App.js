import { CssBaseline, ThemeProvider } from "@mui/material";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { baseTheme } from "./theme";

function App() {
  const storedData = localStorage.getItem("user");

  return (
    <ThemeProvider theme={baseTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          {storedData ? (
            <Route path="/" element={<Navigate to="/home" />} />
          ) : (
            <Route path="/" element={<Login />} />
          )}
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
