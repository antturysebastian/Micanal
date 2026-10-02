import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const font = Bricolage_Grotesque({ subsets: ["latin"] });

export const metadata = { title: "Manufili Reacciona", description: "Reacciones en vivo aquí para que no me baneen :c" };

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={font.className}>{children}</body>
    </html>
  );
}
