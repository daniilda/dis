import { Moon, Sun } from "lucide-react";
import { useTheme } from "../theme-provider";
import { Button } from "./button";

export const ChangeTheme = () => {
  const theme = useTheme();
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => theme.setTheme(theme.theme === "dark" ? "light" : "dark")}
    >
      {theme.theme === "dark" ? <Moon /> : <Sun />}
    </Button>
  );
};
