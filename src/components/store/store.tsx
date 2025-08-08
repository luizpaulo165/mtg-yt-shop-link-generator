import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const storesMTG = [
  { nome: "Barão Geek House", path: "https://www.baraogeekhouse.com.br/" },
  { nome: "Playground", path: "https://www.playgroundgames.com.br/" },
];

export default function Store() {
  const [storeUrl, setStoreUrl] = useState("");
  const [cardList, setCardList] = useState("");
  const [submittedCards, setSubmittedCards] = useState([] as any[]);
  const [copied, setCopied] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [creating, setCreating] = useState(false);

  const handleSetStoreRouter = ({
    storeUrl,
    cardName,
  }: {
    storeUrl: string;
    cardName: string;
  }) => {
    return `${storeUrl}?view=ecom%2Fitens&page=1&id=27364&comdesconto=&busca=${cardName}&txt_filtro_multiestoque=&txt_order=1&txt_limit=120&txt_estoque=1&`;
  };

  const handleSubmit = () => {
    setCreating(true);
    const lines = cardList
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^\d+\s*/, ""));

    try {
      const mappingLines = lines.map((cur: any) => {
        return {
          name: cur,
          store: storeUrl,
          path: handleSetStoreRouter({
            storeUrl,
            cardName: cur,
          }),
        };
      });

      setSubmittedCards([...mappingLines]);
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setCreating(false);
    }, 500);
  };

  const handleCopy = () => {
    if (submittedCards.length > 0) {
      // Find the store name based on the selected storeUrl
      const store = storesMTG.find((s) => s.path === storeUrl);
      const storeTitle = store ? `${store.nome} ` : "Lista de cards";
      navigator.clipboard.writeText(
        [
          storeTitle,
          ...submittedCards.map((card) => `🔗 ${card.name} - ${card.path}`),
        ].join("\n"),
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-column gap-6 w-full max-w-[720px]">
        {/* Formulário */}
        <Card className=" shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Adicionar Cards da Loja
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div style={{ zIndex: 100 }}>
              <label className="text-sm font-medium">Escolha a loja</label>
              {/* <Input
                type="url"
                placeholder="https://minhaloja.com"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="mt-1"
              /> */}
              <Select value={storeUrl} onValueChange={setStoreUrl}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Selecione uma loja" />
                </SelectTrigger>
                <SelectContent style={{ backgroundColor: "#fff" }}>
                  <SelectGroup>
                    <SelectLabel>Lojas</SelectLabel>
                    {storesMTG.map((store) => (
                      <SelectItem
                        key={store.nome}
                        value={store.path}
                        onClick={() => setStoreUrl(store.path)}
                      >
                        {store.nome}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Lista de Cards</label>
              <Textarea
                placeholder="Insira um card por linha..."
                value={cardList}
                onChange={(e) => setCardList(e.target.value)}
                className="mt-1 min-h-[150px]"
              />
            </div>

            <Button
              className="bg-zinc-950 text-white font-bold py-2 px-4 rounded w-full cursor-pointer"
              onClick={handleSubmit}
              disabled={!storeUrl || !cardList || creating}
            >
              {creating ? `Gerando...` : "Gerar Lista de Cards"}
            </Button>
          </CardContent>
        </Card>

        {/* Lista gerada */}
        {submittedCards.length > 0 && !creating && (
          <div className="w-full" ref={listRef as any}>
            <Card className="shadow-lg bg-white">
              <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-10 bg-white ">
                <CardTitle className="text-2xl font-bold">Lista</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
                >
                  <Copy size={16} />
                  {copied ? "Copiado!" : "Copiar"}
                </Button>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1">
                  {submittedCards.map((card, index) => (
                    <li key={index} className="text-sm break-all">
                      <b>🔗 {card.name}</b> -{" "}
                      <a
                        href={card.path}
                        style={{ color: "#06b6d4" }}
                        target="_blank"
                      >
                        {card.path}
                      </a>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      {isVisible && (
        <Button
          onClick={scrollToTop}
          size="icon"
          className="fixed bottom-6 right-6 rounded-full shadow-lg hover:scale-105 transition-transform bg-black text-white"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
