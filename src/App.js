import logo from "./logo.svg";
import "./App.css";
import { Box } from "@mui/material";
import Routes from "./routes";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1 }}>
        <Routes />
      </Box>

   {/*   <Footer/> */}
    </Box>
  );
}

export default App;
