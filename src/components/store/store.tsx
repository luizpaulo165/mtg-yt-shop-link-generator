import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp, Copy, FileText, Link } from "lucide-react";
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
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { normalizeData } from "@/services/normalize-data";
import { Input } from "../ui/input";
import urlCodeText from "@/services/url-code";

const storesMTG = [
  { nome: "Barão Geek House", path: "https://www.baraogeekhouse.com.br/" },
  { nome: "Playground", path: "https://www.playgroundgames.com.br/" },
];

export default function Store() {
  const [storeUrl, setStoreUrl] = useState("");
  const [otherStoreUrl, setOtherStoreUrl] = useState("");
  const [storeSelected, setStoreSelected] = useState("");
  const [cardList, setCardList] = useState("");
  const [submittedCards, setSubmittedCards] = useState([] as any[]);
  const [copied, setCopied] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [creating, setCreating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    fileInputRef.current?.click();
  }

  const handleSelectStore = (value: string, type: string) => {
    console.log(value);
    if (type === "select") {
      setStoreUrl(value);
      setOtherStoreUrl("");
    }
    if (type === "input") {
      setOtherStoreUrl(value);
      setStoreUrl("");
    }

    setStoreSelected(value);
    setSubmittedCards([]);
  };

  const handleSetStoreRouter = ({
    storeUrl,
    cardName,
  }: {
    storeUrl: string;
    cardName: string;
  }) => {
    const normilizedCardName = urlCodeText(cardName);

    return `${storeUrl}?view=ecom%2Fitens&searchExactMatch=&busca=${normilizedCardName}&txt_filtro_multiestoque=&txt_order=1&txt_limit=120&txt_filtro_multiestoque=0&btFiltrar=Filtrar`;
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
            storeUrl: storeSelected,
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
      }, 300);
    } catch (error) {
      console.log(error);
    }
    setTimeout(() => {
      setCreating(false);
    }, 500);
  };

  const handleCopy = () => {
    if (submittedCards.length > 0) {
      const store = storesMTG.find((s) => s.path === storeUrl);
      const storeTitle = store ? `${store.nome} ` : "Lista de cards";
      navigator.clipboard.writeText(
        [
          storeTitle,
          ...submittedCards.map((card) => `🔗 ${card.name} - ${card.path}`),
        ].join("\n")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleList = (data: any) => {
    const value = Array.isArray(data)
      ? data.map((item: any) => normalizeData(item)).join("\n")
      : normalizeData(data.target.value);

    setCardList(value);
  };

  const handleImportTxt = (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    setSubmittedCards([]);

    reader.onload = (e) => {
      const text = e.target?.result;

      if (typeof text === "string") {
        setCardList(normalizeData(text));
      }
    };

    reader.onerror = (e) => {
      console.error("Erro ao ler arquivo", e);
    };

    reader.readAsText(file);
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
    <div className=" min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[720px] flex align-top justify-start gap-2 flex-col">
        {/* Formulário */}
        <Card className={`w-full shadow-lg`}>
          <CardContent className="space-y-4">
            <div style={{ zIndex: 100, marginBlockEnd: 30 }}>
              <label className="text-sm font-medium">Escolha a loja parceira</label>
              <div className="flex align-center justify-between gap-2 ">
                <Select
                  value={storeUrl}
                  onValueChange={(e) => handleSelectStore(e, "select")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione uma loja" />
                  </SelectTrigger>
                  <SelectContent style={{ backgroundColor: "#fff" }}>
                    <SelectGroup>
                      <SelectLabel>Lojas</SelectLabel>
                      {storesMTG.map((store) => (
                        <SelectItem key={store.nome} value={store.path}>
                          {store.nome}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <span className="flex items-center justify-center">ou</span>
                <Input
                  type="url"
                  placeholder="sua loja favorita"
                  value={otherStoreUrl}
                  onChange={(e) => handleSelectStore(e.target.value, "input")}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-2 mb-[16px]">
                <label className="text-sm font-medium">Sua Lista</label>
                <div className="grid max-w-sm items-center gap-3">
                  <Button onClick={handleClick}>
                    <FileText />
                    Importar .txt
                  </Button>
                  <Input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImportTxt}
                    className="hidden"
                  />
                </div>
              </div>
              <Textarea
                placeholder="Insira um card por linha..."
                value={cardList}
                onChange={(e) => handleList(e)}
                className="mt-1 min-h-[150px]"
              />
            </div>

            <Button
              className="font-bold py-2 px-4 rounded w-full cursor-pointer"
              onClick={handleSubmit}
              disabled={!storeSelected || !cardList || creating}
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
                    <Alert key={index}>
                      <Link />
                      <AlertTitle>
                        <b>{card.name}</b>
                      </AlertTitle>
                      <AlertDescription className="break-all">
                        <a href={card.path} style={{ color: "#06b6d4" }} target="_blank">
                          {card.path}
                        </a>
                      </AlertDescription>
                    </Alert>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      <div className="fixed bottom-6 right-6 grid">
        {submittedCards.length > 0 && !creating && (
          <Button
            onClick={() => {
              listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="fixed bottom-20 right-6 rounded-full shadow-lg bg-cyan-600 text-white hover:bg-cyan-700 transition-colors"
          >
            Ir para Lista
          </Button>
        )}

        {isVisible && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className=" rounded-full shadow-lg hover:scale-105 transition-transform bg-black text-white"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
