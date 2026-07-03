import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/lib/theme-context";
import { SearchDialog } from "@/components/search";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
        {/* Light mode gradient background */}
        <div className="fixed inset-0 -z-10 dark:hidden">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(900px 500px at 15% 10%, rgba(197, 163, 255, 0.18), transparent 60%),
                radial-gradient(800px 450px at 85% 15%, rgba(226, 174, 61, 0.14), transparent 55%),
                radial-gradient(900px 520px at 75% 85%, rgba(64, 18, 104, 0.10), transparent 60%)
              `,
              backgroundColor: "#f8f6f0",
            }}
          />
        </div>

        {/* Dark mode gradient background */}
        <div
          className="hidden dark:block fixed inset-0 -z-10"
          data-main-bg="true"
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                radial-gradient(900px 500px at 15% 10%, rgba(197, 163, 255, 0.12), transparent 60%),
                radial-gradient(800px 450px at 85% 15%, rgba(226, 174, 61, 0.08), transparent 55%),
                radial-gradient(900px 520px at 75% 85%, rgba(64, 18, 104, 0.15), transparent 60%)
              `,
              backgroundColor: "#010110",
            }}
          />
        </div>

        <Navbar />
        <SearchDialog />

        <div
          id="main-content"
          className="transition-transform duration-300 ease-out"
        >
          <main className="pt-4 sm:pt-10 md:pt-20">{children}</main>
          <Footer />
        </div>
      </div>
    </ThemeProvider>
  );
}
