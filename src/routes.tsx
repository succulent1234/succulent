import { createBrowserRouter } from "react-router";
import { AppShell, Community, Compose, Detail, Home, Login, Matching, MinorBoard, MyPage, Onboarding, Signup, Start, Verify, VerifyDone } from "./screens";

export const router = createBrowserRouter([
  { path: "/", Component: Start },
  { path: "/login", Component: Login },
  { path: "/signup", Component: Signup },
  { path: "/verify", Component: Verify },
  { path: "/verify-done", Component: VerifyDone },
  { path: "/onboarding", Component: Onboarding },
  { Component: AppShell, children: [
    { path: "/home", Component: Home },
    { path: "/community", Component: Community },
    { path: "/community/:id", Component: Detail },
    { path: "/write", Component: Compose },
    { path: "/match", Component: Matching },
    { path: "/minor", Component: MinorBoard },
    { path: "/my", Component: MyPage },
  ]},
  { path: "*", Component: Start },
]);
