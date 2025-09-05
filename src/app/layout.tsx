import "./globals.css";
import Navbar from "./component/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col md:flex-row">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
