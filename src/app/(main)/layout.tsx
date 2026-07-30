"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SearchDialog } from "@/components/search";
import { AnnouncementBanner } from "@/components/announcement-banner";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <div className="relative min-h-screen max-w-full overflow-x-hidden bg-background text-foreground">
      {/* Light mode gradient background */}
      <div className="fixed inset-0 -z-10 dark:hidden overflow-hidden pointer-events-none">
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
        className="hidden dark:block fixed inset-0 -z-10 overflow-hidden pointer-events-none"
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

      {!isAuthPage && <AnnouncementBanner />}
      {!isAuthPage && <Navbar />}
      {!isAuthPage && <SearchDialog />}

      <div
        id="main-content"
        className={isAuthPage ? "" : "transition-transform duration-300 ease-out pt-16 md:pt-20"}
      >
        <main>{children}</main>
        {!isAuthPage && <Footer />}
      </div>
    </div>
  );
}
