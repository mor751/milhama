import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Command Core Sync",
  description: "Command Core Sync dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
