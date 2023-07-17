import { createBrowserRouter } from "react-router-dom";
import { DevelopView } from "./develop/develop-view";
import { HomeView } from "./home-view";
import { AppShell } from "./app-shell";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        path: "/",
        element: <HomeView />,
      },
      {
        path: "me",
        element: <DevelopView mode="me" />,
      },
      {
        path: "new",
        element: <DevelopView mode="prompt" />,
      },
      {
        path: "prompt/:id",
        element: <DevelopView mode="prompt" />,
      },
    ],
  },
]);
