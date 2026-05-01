import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";

export default function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-full flex flex-col grain bg-[color:var(--background)] text-[color:var(--foreground)] flex-1">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
