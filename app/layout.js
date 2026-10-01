import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata = { title: "Mi canal en vivo", description: "Transmisiones en vivo" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={font.className}>{children}</body>
    </html>
  );
}
