import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Navbar from "components/navbar";
import Sidebar from "components/sidebar";
import Footer from "components/footer/Footer";
import routes from "../../routes/routes-lecturer.js";
import { getMe } from "store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Lecturer(props) {
  const { ...rest } = props;
  const location = useLocation();
  const [open, setOpen] = React.useState(true);
  const [currentRoute, setCurrentRoute] = React.useState("Main Dashboard");
  const { isError } = useSelector((state => state.auth));
  const [page, setPage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Only fetch user data if we don't have it yet
    if (!user) {
      dispatch(getMe()).catch((error) => {
        console.error("Failed to fetch user data:", error);
        // If user data fetch fails, redirect to login
        navigate("/auth/sign-in");
      });
    }
  }, [dispatch, user, navigate]);

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentRoute = routes.find(
      (route) => route.layout === "/lecturer" && route.path === currentPath
    );
    if (currentRoute) {
      setPage(currentRoute.name);
      document.title = currentRoute.name;
    }
  }, [location.pathname]);

  useEffect(() => {
    if (isError) {
      navigate("/auth/sign-in");
    }
  }, [isError, navigate]);

  useEffect(() => {
    const handleResize = () => {
      window.innerWidth < 1200 ? setOpen(false) : setOpen(true);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getActiveRoute(routes);
  }, [location.pathname]);

  const getActiveRoute = (routes) => {
    let activeRoute = "Main Dashboard";
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(
          routes[i].layout + "/" + routes[i].path
        ) !== -1
      ) {
        setCurrentRoute(routes[i].name);
        return routes[i].name; // Return route name immediately
      }
    }
    return activeRoute;
  };

  const getActiveNavbar = (routes) => {
    let activeNavbar = false;
    for (let i = 0; i < routes.length; i++) {
      if (
        window.location.href.indexOf(routes[i].layout + "/" + routes[i].path) !== -1
      ) {
        return routes[i].secondary || false;
      }
    }
    return activeNavbar;
  };

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/lecturer") {
        return (
          <Route path={`/${prop.path}`} element={prop.component} key={key} />
        );
      }
      return null;
    });
  };

  document.documentElement.dir = "ltr";

  return (
    <div className="flex h-full w-full">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="h-full w-full bg-lightPrimary dark:!bg-navy-900">
        <main
          className={`mx-3 h-full flex-none transition-all md:pr-2 xl:ml-[313px]`}
        >
          <div className="h-full">
            <Navbar
              onOpenSidenav={() => setOpen(true)}
              logoText="DandStore"
              brandText={currentRoute}
              secondary={getActiveNavbar(routes)}
              {...rest}
            />
            <div className="pt-5 mx-auto mb-auto h-full min-h-[84vh] p-2 md:pr-2">
              <Routes>
                {getRoutes(routes)}
                <Route
                  path="/"
                  element={<Navigate to="/lecturer/default" replace />}
                />
              </Routes>
            </div>
            <div className="p-3">
              <Footer />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
