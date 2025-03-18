import { withUt } from "uploadthing/tw";
import type { Config } from "tailwindcss";

const config: Config = withUt({
  content: ["./src/**/*.{ts,tsx,mdx}"], // Adjust paths if needed
  theme: {
    extend: {},
  },
  plugins: [],
});

export default config;
