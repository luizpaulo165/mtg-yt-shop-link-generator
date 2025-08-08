import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy } from "lucide-react";

export default function Store() {
  const [storeUrl, setStoreUrl] = useState("");
  const [cardList, setCardList] = useState("");
  const [submittedCards, setSubmittedCards] = useState([] as any[]);
  const [copied, setCopied] = useState(false);

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
    const lines = cardList
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => line.replace(/^\d+\s*/, ""));

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
  };

  const handleCopy = () => {
    if (submittedCards.length > 0) {
      navigator.clipboard.writeText(
        submittedCards.map((card) => `🔗 ${card.name} - ${card.path}`).join("\n")
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-column gap-6 w-full max-w-[720px]">
        {/* Formulário */}
        <Card className=" shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Adicionar Cards da Loja</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">URL da Loja</label>
              <Input
                type="url"
                placeholder="https://minhaloja.com"
                value={storeUrl}
                onChange={(e) => setStoreUrl(e.target.value)}
                className="mt-1"
              />
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
            >
              Criar lista
            </Button>
          </CardContent>
        </Card>

        {/* Lista gerada */}
        {submittedCards.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-2xl font-bold">Lista Gerada</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-2"
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
                    <a href={card.path} style={{ color: "#06b6d4" }} target="_blank">
                      {card.path}
                    </a>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
