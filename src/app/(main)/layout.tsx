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
      <div
        className="relative min-h-screen overflow-x-hidden bg-[#f8f6f0] text-foreground"
        data-main-bg="true"
        style={{
          backgroundImage: `
            radial-gradient(900px 500px at 15% 10%, rgba(197, 163, 255, 0.18), transparent 60%),
            radial-gradient(800px 450px at 85% 15%, rgba(226, 174, 61, 0.14), transparent 55%),
            radial-gradient(900px 520px at 75% 85%, rgba(64, 18, 104, 0.10), transparent 60%),
            linear-gradient(180deg, rgba(248, 246, 240, 1) 0%, rgba(255, 255, 255, 0.95) 35%, rgba(248, 246, 240, 1) 100%)
          `,
          backgroundAttachment: "fixed",
        }}
      >
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
