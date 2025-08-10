import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage } from "../ui/avatar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <div className="w-full bg-background/90 border-b border-border p-4 text-center font-bold text-2xl">
        <header className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <img
              src={`/jeff-${theme === "dark" ? "light" : "dark"}.png`}
              alt="JEFF3ND"
              className="inline-block  h-8"
            />
          </div>
          <h1 className="text-[16px]">Compra por lista</h1>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Claro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Escuro
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  Sistema
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
      </div>
      <main className="bg-background">{children}</main>
      <div className="w-full p-4 text-center font-bold text-2xl">
        <footer className="w-full p-4 text-center font-normal">
          <span className="text-[14px] ">Ferramentra desenvolvida por</span>
          <div className="*:data-[slot=avatar]:ring-background flex gap-2 flex items-center justify-center mt-2">
            <div className="flex items-center flex-col ">
              <Avatar>
                <AvatarImage src="/jeff-avatar.jpg" />
              </Avatar>
              <span className="text-sm">Jeff3nd</span>
            </div>
            <div className="flex items-center justify-start flex-col ">
              <Avatar>
                <AvatarImage src="/papaulo-avatar.jpg" />
              </Avatar>
              <span className="text-sm">Papaulo</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
