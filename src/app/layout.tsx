import "./globals.css";
import Navbar from "./component/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col md:flex-row min-h-screen overflow-x-hidden">
        <nav className="hidden md:flex fixed left-0 top-0 h-screen w-20 z-40 flex-col items-center
                        bg-[rgb(45,61,223)] text-white shadow-md">
          <Navbar />
        </nav>

        {/* Mobile bottom bar (fixed bottom) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 z-50 
                        bg-[rgb(45,61,223)] text-white shadow-md flex items-center justify-around">
          <Navbar />
        </nav>
        <main className="flex-1 h-[100svh] md:ml-20 pb-16 md:pb-0 ">
          {children}
        </main>
      </body>
    </html>
  );
}
