import ReactDOM from "react-dom/client";
import App from "./App";
import { GuestProvider } from "@/lib/GuestContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <GuestProvider>
    <App />
  </GuestProvider>
);
