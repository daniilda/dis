import { routeTree } from "@/routeTree.gen";
import { ParseRoute } from "@tanstack/react-router";

export type Route = ParseRoute<typeof routeTree>["fullPath"];
