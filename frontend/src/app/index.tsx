import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import "./globals.css";
import { configure } from "mobx";
import "@fontsource-variable/inter";
import { registerSW } from "virtual:pwa-register";
import { applyZodRussianLanguage } from "@/utils/locale/zod-russian";

registerSW({
  immediate: true,
  // onRegisteredSW: async (_, r) =>
  //   r?.active &&
  //   r.addEventListener("updatefound", () =>
  //     toast.loading("Доступна новая версия", {
  //       description: "Страница будет перезагружена для применения обновлений",
  //       duration: Infinity,
  //     }),
  //   ),
});

applyZodRussianLanguage();

configure({
  enforceActions: "never",
});

// Import the generated route tree
import { routeTree } from "../routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <>
      <RouterProvider router={router} />
    </>,
  );
}
