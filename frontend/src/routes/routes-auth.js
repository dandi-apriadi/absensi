import React from "react";
import SignIn from "views/auth/SignIn";
import Homepage from "views/auth/Homepage";
// Icon Imports
import {
    MdLock,
} from "react-icons/md";

const routes = [
    {
        name: "Sign In",
        layout: "/auth",
        path: "sign-in",
        icon: <MdLock className="h-6 w-6" />,
        component: <SignIn />,
    },
    {
        name: "Homepage",
        layout: "/auth",
        path: "homepage",
        icon: <MdLock className="h-6 w-6" />,
        component: <Homepage />,
    },
];

export default routes;