import Footer from "@/src/components/footer";
import Navbar from "@/src/components/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-screen-xl mx-auto p-4 space-y-4">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
