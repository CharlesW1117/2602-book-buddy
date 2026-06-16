import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
  base: "/2602-book-buddy/", // 👈 must match your repo name exactly
});
