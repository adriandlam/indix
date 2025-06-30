import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-screen-xl mx-auto p-4 space-y-4 border-x border-dashed h-screen">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
