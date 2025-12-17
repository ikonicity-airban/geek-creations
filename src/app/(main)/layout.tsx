import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/lib/theme-context";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen" style={{ backgroundColor: "#f8f6f0" }}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}


