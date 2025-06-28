import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
     route("Login","./routes/auth/login.tsx"),
     route("Register","./routes/auth/register.tsx"),
] satisfies RouteConfig;

