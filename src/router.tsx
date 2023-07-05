import { createBrowserRouter, useParams } from "react-router-dom";
import { ExistingPromptView, NewPromptView } from "./prompt-view";
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
        path: "new",
        element: <NewPromptView />,
      },
      {
        path: "prompt/:id",
        Component: () => {
          const params = useParams<"id">();
          return <ExistingPromptView id={params.id as string} />;
        },
      },
    ],
  },
]);
