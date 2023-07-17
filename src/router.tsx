import { createBrowserRouter } from "react-router-dom";
import { PromptViewContainer } from "./prompt-view";
import { HomeView } from "./home-view";
import { AppShell } from "./app-shell";
import { MyDocList } from "./my-doc-list";

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
        path: "/my",
        element: <MyDocList />,
      },
      {
        path: "new",
        element: <PromptViewContainer />,
      },
      {
        path: "prompt/:id",
        element: <PromptViewContainer />,
      },
    ],
  },
]);
