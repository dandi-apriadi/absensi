import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import DashIcon from "../../icons/DashIcon";
import { setMicroPage } from "../../../store/slices/authSlice";
import { useDispatch } from "react-redux";

export function SidebarLinks(props) {
  const location = useLocation();
  const dispatch = useDispatch();
  const { routes } = props;

  // Fungsi untuk memeriksa apakah rute aktif berdasarkan path
  const activeRoute = (routeName) => {
    const currentPath = location.pathname.split("?")[0];
    if (routeName.includes(":")) {
      const routeBase = routeName.split("/:")[0];
      return currentPath.startsWith(routeBase);
    }
    return currentPath === routeName || currentPath.startsWith(routeName + "/");
  };

  // Menangani rute dengan makro = true
  useEffect(() => {
    const activeMacroRoute = routes.find(
      (route) => route.makro && activeRoute(`${route.layout}/${route.path}`)
    );

    if (activeMacroRoute) {
      dispatch(setMicroPage(activeMacroRoute.name)); // Set makro page jika rute makro aktif
    } else {
      dispatch(setMicroPage("unset")); // Set unset jika tidak ada rute makro yang aktif
    }
  }, [routes, location.pathname, dispatch]);

  const createLinks = (routes) => {
    // Clean route organization
    const mainRoutes = routes.filter(route =>
      route.layout !== "auth" && !route.parentPath && !route.secondary
    );

    const subRoutesByParent = {};
    routes
      .filter(route => route.parentPath && route.secondary)
      .forEach(subRoute => {
        if (!subRoutesByParent[subRoute.parentPath]) {
          subRoutesByParent[subRoute.parentPath] = [];
        }
        subRoutesByParent[subRoute.parentPath].push(subRoute);
      });

    const isAnySubRouteActive = (parentPath) => {
      const subRoutes = subRoutesByParent[parentPath] || [];
      return subRoutes.some(subRoute =>
        activeRoute(`${subRoute.layout}/${subRoute.path}`)
      );
    };

    return mainRoutes.flatMap((mainRoute, mainIndex) => {
      const mainPath = `${mainRoute.layout}/${mainRoute.path}`;
      const isMainActive = activeRoute(mainPath);
      const hasActiveSubRoute = isAnySubRouteActive(mainRoute.path);
      const shouldShowSubRoutes = isMainActive || hasActiveSubRoute;
      const hasSubRoutes = subRoutesByParent[mainRoute.path]?.length > 0;

      const elements = [
        // Clean main route design
        <Link key={`main-${mainIndex}`} to={mainPath}>
          <div className={`
            group relative mb-2 mx-2 rounded-lg transition-all duration-200
            ${isMainActive
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg'
              : hasActiveSubRoute
                ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700'
                : 'hover:bg-gray-50 dark:hover:bg-slate-800/50 hover:shadow-sm'
            }
          `}>
            <div className="flex items-center p-3">
              {/* Clean icon container */}
              <div className={`
                flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-200
                ${isMainActive
                  ? 'bg-white/20 text-white'
                  : hasActiveSubRoute
                    ? 'bg-indigo-100 dark:bg-indigo-800/30 text-indigo-700 dark:text-indigo-300'
                    : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                }
              `}>
                <div className="text-lg">
                  {mainRoute.icon ? mainRoute.icon : <DashIcon />}
                </div>
              </div>

              {/* Clean text content */}
              <div className="ml-3 flex-1">
                <p className={`
                  font-medium text-sm transition-colors duration-200
                  ${isMainActive
                    ? 'text-white font-semibold'
                    : hasActiveSubRoute
                      ? 'text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'
                  }
                `}>
                  {mainRoute.name}
                </p>
                {hasSubRoutes && (
                  <p className={`text-xs mt-0.5 ${isMainActive
                    ? 'text-white/70'
                    : hasActiveSubRoute
                      ? 'text-indigo-600/80 dark:text-indigo-400/80'
                      : 'text-gray-500 dark:text-gray-400'
                    }`}>
                    {subRoutesByParent[mainRoute.path].length} items
                  </p>
                )}
              </div>

              {/* Clean expand indicator */}
              {hasSubRoutes && (
                <div className={`
                  w-6 h-6 rounded-md flex items-center justify-center transition-transform duration-200
                  ${shouldShowSubRoutes ? 'rotate-90' : 'rotate-0'}
                  ${isMainActive
                    ? 'text-white/80'
                    : hasActiveSubRoute
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }
                `}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>

            {/* Clean active indicator */}
            {isMainActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-md"></div>
            )}
          </div>
        </Link>
      ];

      // Clean sub-menu design
      if (shouldShowSubRoutes && hasSubRoutes) {
        const subElements = subRoutesByParent[mainRoute.path].map((subRoute, subIndex) => {
          const subPath = `${subRoute.layout}/${subRoute.path}`;
          const isSubActive = activeRoute(subPath);

          return (
            <Link key={`sub-${mainIndex}-${subIndex}`} to={subPath}>
              <div className={`
                group relative mb-1 ml-6 mr-2 rounded-lg transition-all duration-200
                ${isSubActive
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-500 shadow-md'
                  : 'hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10 hover:shadow-sm'
                }
              `}>
                <div className="flex items-center py-2 px-3">
                  {/* Connection line */}
                  <div className={`
                    absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-px
                    ${isSubActive ? 'bg-indigo-300' : 'bg-gray-300 dark:bg-slate-600'}
                  `}></div>

                  {/* Simple dot icon without container */}
                  <div className={`
                    w-1.5 h-1.5 rounded-full transition-colors duration-200 flex-shrink-0
                    ${isSubActive
                      ? 'bg-white'
                      : 'bg-gray-400 dark:bg-gray-500 group-hover:bg-indigo-600'
                    }
                  `}></div>

                  {/* Clean sub-item text */}
                  <div className="ml-3 flex-1">
                    <p className={`
                      text-sm font-medium transition-colors duration-200
                      ${isSubActive
                        ? 'text-white'
                        : 'text-gray-600 dark:text-gray-300 group-hover:text-indigo-700 dark:group-hover:text-indigo-300'
                      }
                    `}>
                      {subRoute.name}
                    </p>
                  </div>

                  {/* Simple active indicator */}
                  <div className={`
                    w-1.5 h-1.5 rounded-full transition-all duration-200 flex-shrink-0
                    ${isSubActive ? 'bg-white' : 'bg-transparent'}
                  `}></div>
                </div>
              </div>
            </Link>
          );
        });

        elements.push(...subElements);
      }

      return elements;
    });
  };
  return <div className="space-y-0.5">{createLinks(routes)}</div>;
}

export default SidebarLinks;