import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import routes from "../../routes/routes-auth.js";
import Navbar from "components/navbarhome";
import { useEffect, useState } from "react";

const FULL_WIDTH_PAGES = ['Homepage'];

export default function Auth() {
  const [page, setPage] = useState("");
  const location = useLocation();

  // High-quality facial recognition themed image from Unsplash
  const authImg = "https://images.unsplash.com/photo-1525770041010-2a1233dd8152?q=80&w=1974&auto=format&fit=crop";

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentRoute = routes.find(
      (route) => route.layout === "/auth" && route.path === currentPath
    );

    if (currentRoute) {
      setPage(currentRoute.name);
      document.title = currentRoute.name + " - Sistem Absensi";
    }
  }, [location.pathname]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      } else {
        return null;
      }
    });
  };

  document.documentElement.dir = "ltr";
  return (
    <div>
      <div className="relative float-right h-full min-h-screen w-full bg-white">
        {/* Subtle background pattern for Sign In page */}
        {page === "Sign In" && (
          <div className="absolute inset-0 bg-white">
            {/* Subtle gradient background */}
            <div className="absolute inset-0 opacity-5"
              style={{
                background: "radial-gradient(circle at top right, #079669 0%, transparent 70%), radial-gradient(circle at bottom left, #0369a1 0%, transparent 70%)",
                opacity: 0.08
              }}
            ></div>
          </div>
        )}

        <main className="mx-auto min-h-screen relative z-10">
          <Navbar />
          <div className={`relative flex ${FULL_WIDTH_PAGES.includes(page) ? "w-full h-screen" : ""}`}>
            <div className={`
              ${FULL_WIDTH_PAGES.includes(page)
                ? "w-full h-full p-0 m-0 max-w-none"
                : page === "Sign In"
                  ? "mx-auto flex min-h-full w-full flex-col justify-start pt-8 md:px-8 lg:max-w-full lg:pt-0 xl:min-h-[100vh]"
                  : "mx-auto flex min-h-full w-full flex-col justify-start pt-12 md:max-w-[75%] lg:max-w-[1013px] lg:px-8 lg:pt-0 xl:min-h-[100vh] xl:max-w-[1383px] xl:px-0 xl:pl-[70px]"
              }
            `}>
              <div className={`mb-auto flex flex-col ${page === "Sign In" ? "px-4 md:px-8 lg:px-12 xl:px-16" : "pl-5 pr-5 md:pr-0 md:pl-12 lg:max-w-[48%] lg:pl-0 xl:max-w-full"}`}>
                <Routes>
                  {getRoutes(routes)}
                  <Route
                    path="/"
                    element={<Navigate to="/auth/sign-in" replace />}
                  />
                </Routes>
              </div>
            </div>
            {page === "Sign In" && (
              <div className="absolute right-0 hidden h-full min-h-screen md:block lg:w-[49vw] 2xl:w-[44vw]">
                <div className="absolute inset-0 overflow-hidden shadow-xl">
                  {/* Smooth gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-600/95 via-teal-600/95 to-blue-700/95 rounded-bl-[120px]" />

                  {/* Background image with better blending */}
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-soft-light rounded-bl-[120px]"
                    style={{ backgroundImage: `url(${authImg})` }}
                  />

                  {/* Soft wavy overlay instead of boxes */}
                  <div
                    className="absolute inset-0 opacity-20 rounded-bl-[120px]"
                    style={{
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Cdefs%3E%3ClinearGradient id='a' gradientUnits='userSpaceOnUse' x1='0' x2='0' y1='0' y2='100%25' gradientTransform='rotate(240)'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='1' stop-color='%234FE'/%3E%3C/linearGradient%3E%3Cpattern patternUnits='userSpaceOnUse' id='b' width='540' height='450' x='0' y='0' viewBox='0 0 1080 900'%3E%3Cg fill-opacity='0.1'%3E%3Cpolygon fill='%23444' points='90 150 0 300 180 300'/%3E%3Cpolygon points='90 150 180 0 0 0'/%3E%3Cpolygon fill='%23AAA' points='270 150 360 0 180 0'/%3E%3Cpolygon fill='%23DDD' points='450 150 360 300 540 300'/%3E%3Cpolygon fill='%23999' points='450 150 540 0 360 0'/%3E%3Cpolygon points='630 150 540 300 720 300'/%3E%3Cpolygon fill='%23DDD' points='630 150 720 0 540 0'/%3E%3Cpolygon fill='%23444' points='810 150 720 300 900 300'/%3E%3Cpolygon fill='%23FFF' points='810 150 900 0 720 0'/%3E%3Cpolygon fill='%23DDD' points='990 150 900 300 1080 300'/%3E%3Cpolygon fill='%23444' points='990 150 1080 0 900 0'/%3E%3Cpolygon fill='%23DDD' points='90 450 0 600 180 600'/%3E%3Cpolygon points='90 450 180 300 0 300'/%3E%3Cpolygon fill='%23666' points='270 450 180 600 360 600'/%3E%3Cpolygon fill='%23AAA' points='270 450 360 300 180 300'/%3E%3Cpolygon fill='%23DDD' points='450 450 360 600 540 600'/%3E%3Cpolygon fill='%23999' points='450 450 540 300 360 300'/%3E%3Cpolygon fill='%23999' points='630 450 540 600 720 600'/%3E%3Cpolygon fill='%23FFF' points='630 450 720 300 540 300'/%3E%3Cpolygon points='810 450 720 600 900 600'/%3E%3Cpolygon fill='%23DDD' points='810 450 900 300 720 300'/%3E%3Cpolygon fill='%23AAA' points='990 450 900 600 1080 600'/%3E%3Cpolygon fill='%23444' points='990 450 1080 300 900 300'/%3E%3Cpolygon fill='%23222' points='90 750 0 900 180 900'/%3E%3Cpolygon points='270 750 180 900 360 900'/%3E%3Cpolygon fill='%23DDD' points='270 750 360 600 180 600'/%3E%3Cpolygon points='450 750 540 600 360 600'/%3E%3Cpolygon points='630 750 540 900 720 900'/%3E%3Cpolygon fill='%23444' points='630 750 720 600 540 600'/%3E%3Cpolygon fill='%23AAA' points='810 750 720 900 900 900'/%3E%3Cpolygon fill='%23666' points='810 750 900 600 720 600'/%3E%3Cpolygon fill='%23999' points='990 750 900 900 1080 900'/%3E%3Cpolygon fill='%23999' points='180 0 90 150 270 150'/%3E%3Cpolygon fill='%23444' points='360 0 270 150 450 150'/%3E%3Cpolygon fill='%23FFF' points='540 0 450 150 630 150'/%3E%3Cpolygon points='900 0 810 150 990 150'/%3E%3Cpolygon fill='%23222' points='0 300 -90 450 90 450'/%3E%3Cpolygon fill='%23FFF' points='0 300 90 150 -90 150'/%3E%3Cpolygon fill='%23FFF' points='180 300 90 450 270 450'/%3E%3Cpolygon fill='%23666' points='180 300 270 150 90 150'/%3E%3Cpolygon fill='%23222' points='360 300 270 450 450 450'/%3E%3Cpolygon fill='%23FFF' points='360 300 450 150 270 150'/%3E%3Cpolygon fill='%23444' points='540 300 450 450 630 450'/%3E%3Cpolygon fill='%23222' points='540 300 630 150 450 150'/%3E%3Cpolygon fill='%23AAA' points='720 300 630 450 810 450'/%3E%3Cpolygon fill='%23666' points='720 300 810 150 630 150'/%3E%3Cpolygon fill='%23FFF' points='900 300 810 450 990 450'/%3E%3Cpolygon fill='%23999' points='900 300 990 150 810 150'/%3E%3Cpolygon points='0 600 -90 750 90 750'/%3E%3Cpolygon fill='%23666' points='0 600 90 450 -90 450'/%3E%3Cpolygon fill='%23AAA' points='180 600 90 750 270 750'/%3E%3Cpolygon fill='%23444' points='180 600 270 450 90 450'/%3E%3Cpolygon fill='%23444' points='360 600 270 750 450 750'/%3E%3Cpolygon fill='%23999' points='360 600 450 450 270 450'/%3E%3Cpolygon fill='%23666' points='540 600 630 450 450 450'/%3E%3Cpolygon fill='%23222' points='720 600 630 750 810 750'/%3E%3Cpolygon fill='%23FFF' points='900 600 810 750 990 750'/%3E%3Cpolygon fill='%23222' points='900 600 990 450 810 450'/%3E%3Cpolygon fill='%23DDD' points='0 900 90 750 -90 750'/%3E%3Cpolygon fill='%23444' points='180 900 270 750 90 750'/%3E%3Cpolygon fill='%23FFF' points='360 900 450 750 270 750'/%3E%3Cpolygon fill='%23AAA' points='540 900 630 750 450 750'/%3E%3Cpolygon fill='%23FFF' points='720 900 810 750 630 750'/%3E%3Cpolygon fill='%23222' points='900 900 990 750 810 750'/%3E%3Cpolygon fill='%23222' points='1080 300 990 450 1170 450'/%3E%3Cpolygon fill='%23FFF' points='1080 300 1170 150 990 150'/%3E%3Cpolygon points='1080 600 990 750 1170 750'/%3E%3Cpolygon fill='%23666' points='1080 600 1170 450 990 450'/%3E%3Cpolygon fill='%23DDD' points='1080 900 1170 750 990 750'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect x='0' y='0' fill='url(%23a)' width='100%25' height='100%25'/%3E%3Crect x='0' y='0' fill='url(%23b)' width='100%25' height='100%25'/%3E%3C/svg%3E\")",
                      backgroundSize: "cover"
                    }}
                  />

                  {/* Soft radial gradient overlay */}
                  <div className="absolute inset-0 rounded-bl-[120px]"
                    style={{
                      background: "radial-gradient(circle at center, transparent 30%, rgba(0,0,0,0.2) 100%)"
                    }}
                  />

                  {/* Content section with smoother elements */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center px-12 text-white">
                    {/* Circular icon instead of square */}
                    <div className="w-20 h-20 mb-8 bg-white/15 backdrop-blur-md rounded-full p-4 shadow-lg border border-white/20 flex items-center justify-center">
                      <svg className="w-12 h-12" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>

                    <h2 className="text-4xl font-bold mb-4 tracking-tight">FACE<span className="text-white/80 font-light">ATTEND</span></h2>
                    <p className="text-lg text-center max-w-md opacity-90 mb-10 leading-relaxed font-light">
                      Sistem Absensi Pintu Cerdas dengan Pengenalan Wajah
                    </p>

                    {/* Rounded stats display */}
                    <div className="flex gap-8 mt-2">
                      <div className="text-center px-5 py-3 bg-white/10 backdrop-blur-sm rounded-full">
                        <p className="text-2xl font-bold">99%</p>
                        <p className="text-sm opacity-80">Akurasi</p>
                      </div>
                      <div className="text-center px-5 py-3 bg-white/10 backdrop-blur-sm rounded-full">
                        <p className="text-2xl font-bold">&lt;1s</p>
                        <p className="text-sm opacity-80">Kecepatan</p>
                      </div>
                      <div className="text-center px-5 py-3 bg-white/10 backdrop-blur-sm rounded-full">
                        <p className="text-2xl font-bold">Realtime</p>
                        <p className="text-sm opacity-80">Monitoring</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
