import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  BrushCleaning,
  CheckCircle2Icon,
  ChevronUp,
  Copy,
  FileDown,
  FileText,
  Link,
} from "lucide-react";
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
import moment from "moment";

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
    console.log(event);
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

  const handleCleanList = () => {
    setCardList("");
    setSubmittedCards([]);
  };

  const handleDownloadTxt = () => {
    if (submittedCards.length > 0) {
      const store = storesMTG.find((s) => s.path === storeUrl);
      const storeTitle = store ? `${store.nome} ` : "Lista";
      const content = [
        storeTitle,
        ...submittedCards.map((card) => `🔗 ${card.name} - ${card.path}`),
      ].join("\n");

      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `compra-por-lista-${moment().format("DD_MM_YY_HH-mm")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-full max-w-5xl mx-auto flex item-center justify-center gap-2 flex-col">
        {/* Formulário */}
        <Card className={`w-full shadow-lg mb-4`}>
          <CardContent className="space-y-4">
            <div style={{ zIndex: 100, marginBlockEnd: 30 }}>
              <div className="flex items-center justify-between gap-2 flex-col xs:flex-col sm:flex-col md:flex-row">
                <div className="grid flex-1 max-w-sm items-center gap-3">
                  <label className="text-sm font-medium">Escolha uma loja parceira</label>
                  <Select
                    value={storeUrl}
                    onValueChange={(e: any) => handleSelectStore(e, "select")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione uma loja" />
                    </SelectTrigger>
                    <SelectContent style={{ backgroundColor: "var(--card)" }}>
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
                </div>
                <span className="flex items-center justify-center relative top-3">
                  ou
                </span>
                <div className="flex flex-1 align-center justify-between gap-2 flex-col">
                  <label className="text-sm font-medium">Digite sua loja favorita</label>
                  <Input
                    type="url"
                    placeholder="https://www.minhalojafavorita.com.br/"
                    value={otherStoreUrl}
                    onChange={(e) => handleSelectStore(e.target.value, "input")}
                  />
                </div>
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
                    accept=".txt"
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
              <Alert className="bg-orange-100 border-0 shadow-none mt-2 text-black">
                <CheckCircle2Icon />
                <AlertTitle>
                  Use o código <b>3nd</b> nas lojas parceiras e ganhe 5% de desconto nas
                  compras.
                </AlertTitle>
              </Alert>
            </div>

            <div className="w-full flex items-center justify-between gap-2">
              <Button
                className="font-bold py-2 px-4 rounded flex-1 cursor-pointer"
                onClick={handleSubmit}
                disabled={!storeSelected || !cardList || creating}
              >
                {creating ? `Gerando...` : "Gerar lista com links"}
              </Button>
              {cardList && (
                <Button variant="destructive" onClick={handleCleanList}>
                  <BrushCleaning />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista gerada */}
        {submittedCards.length > 0 && !creating && (
          <div className="w-full" ref={listRef as any}>
            <Card className="shadow-lg ">
              <CardHeader className="flex flex-row items-center justify-between sticky top-0 z-10  ">
                <CardTitle className="text-2xl font-bold">Lista</CardTitle>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="flex items-center gap-2  transition-colors"
                  >
                    <Copy size={16} />
                    {copied ? "Copiado!" : "Copiar"}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTxt}
                    className="flex items-center gap-2  transition-colors"
                  >
                    <FileDown size={16} />
                    Baixar
                  </Button>
                </div>
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
      <div className="fixed bottom-6 right-6 flex items-center justify-center gap-2 flex-row">
        {submittedCards.length > 0 && !creating && (
          <Button
            onClick={handleCleanList}
            className="rounded-full shadow-lg  transition-colors"
            variant="destructive"
          >
            limpar lista
          </Button>
        )}
        {submittedCards.length > 0 && !creating && (
          <Button
            onClick={() => {
              listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
            className="rounded-full shadow-lg  transition-colors"
          >
            Ir para lista
          </Button>
        )}

        {isVisible && (
          <Button
            onClick={scrollToTop}
            size="icon"
            className=" rounded-full shadow-lg hover:scale-105 transition-transform font-bold cursor-pointer "
          >
            <ChevronUp />
          </Button>
        )}
      </div>
    </div>
  );
}
