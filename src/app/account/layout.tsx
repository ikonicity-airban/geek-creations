export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-10 text-center">
          <span className="inline-block px-4 py-2 rounded-full font-semibold text-sm mb-4 bg-secondary/20 text-accent">
            ACCOUNT
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}
