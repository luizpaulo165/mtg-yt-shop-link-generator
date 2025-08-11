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

const partners = [
  {
    name: "Playground",
    image_dark: "/play-light.png",
    image_light: "/play-dark.png",
    storeLink: "https://www.playgroundgames.com.br/",
  },
  {
    name: "Barão Geek House",
    image_dark: "barao-light.png",
    image_light: "barao-dark.png",
    storeLink: "https://www.baraogeekhouse.com.br/",
  },
  {
    name: "Dragon Skin",
    image_dark: "dragon-light.png",
    image_light: "dragon-dark.png",
    storeLink: "https://dragonskin.com.br/",
  },
  {
    name: "Pilha",
    image_dark: "pilha-light.png",
    image_light: "pilha-dark.png",
    storeLink: "https://www.pilhacardgames.com/",
  },
  {
    name: "TCG Box",
    image_dark: "tcg-light.png",
    image_light: "tcg-dark.png",
    storeLink: "https://tcginbox.com.br/",
  },
  {
    name: "Glórin",
    image_dark: "glorin-light.png",
    image_light: "grlorin-dark.png",
    storeLink: "https://www.glorin.com.br/",
  },
  {
    name: "LigaMagic",
    image_dark: "liga-light.png",
    image_light: "liga-dark.png",
    storeLink: "https://www.ligamagic.com.br/?adLink=3ND",
  },
];

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
      <main className="bg-background min-h-5">{children}</main>
      <div className="w-full  text-center font-bold text-2xl mt-20">
        <div className="mb-20">
          <span className="text-[14px] ">Nossos parceiros</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.storeLink}
                target="_blank"
                className="w-24 sm:w-auto"
              >
                <img
                  src={`/partners/${
                    theme === "dark" ? partner.image_light : partner.image_dark
                  }`}
                  alt={partner.name}
                  className="inline-block w-32 object-contain"
                />
              </a>
            ))}
          </div>
        </div>
        <footer className="w-full p-8 text-center font-normal bg-secondary">
          <div className="w-full max-w-5xl mx-auto flex items-center justify-end">
            <span className="text-[10px] ">Ferramentra desenvolvida por</span>
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 pl-2">
              <div className="flex items-center flex-col ">
                <a href="https://www.instagram.com/jeff3nd/" target="_blank">
                  <Avatar>
                    <AvatarImage src="/jeff-avatar.jpg" />
                  </Avatar>
                </a>
              </div>
              <div className="flex items-center justify-start flex-col ">
                <a href="https://bsky.app/profile/papaulo.bsky.social" target="_blank">
                  <Avatar>
                    <AvatarImage src="/papaulo-avatar.jpg" />
                  </Avatar>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
