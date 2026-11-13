import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const frame = requestAnimationFrame(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo(0, 0);
        }
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export function Layout() {
  return (
    <>
      <ScrollManager />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
