import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  clearDraft,
  formatDraftAge,
  readDraft,
  readRecentValues,
  RECENT_NETWORKS_KEY,
  RECENT_PROMOTERS_KEY,
  RECENT_STORES_KEY,
  saveDraft,
  rememberRecentValue,
} from "@/lib/formUtils";

const PROMOTER_SUGGESTIONS = ["Jocieli-RJ", "Odara-SP"];

const createInitialFormData = () => ({
  promoter: "",
  visitDate: "",
  network: "",
  store: "",
  leaderName: "",
  leaderPhone: "",
  productsInFreezer: "yes",
  freezerProducts: "",
  freezerOrganization: "ok",
  freezerProblems: "",
  productsToasted: "yes",
  toastedProducts: "",
  visualQuality: "good",
  exposure: "ok",
  exposureProblems: "",
  generalObservations: "",
  mainProblem: "",
  stockDetails: "",
  counterDetails: "",
  actionTaken: "",
  feedback: "",
});

type FormField = keyof ReturnType<typeof createInitialFormData>;

export default function Home() {
  const [reportType, setReportType] = useState("normal");
  const [submitted, setSubmitted] = useState(false);
  const [draftAvailable, setDraftAvailable] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [recentPromoters, setRecentPromoters] = useState<string[]>([]);
  const [recentNetworks, setRecentNetworks] = useState<string[]>([]);
  const [recentStores, setRecentStores] = useState<string[]>([]);
  const [showValidation, setShowValidation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sheetStatus, setSheetStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  
  const [formData, setFormData] = useState(createInitialFormData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setFormData(prev => ({ ...prev, [name]: value }));
    setShowValidation(false);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setShowValidation(false);
  };

  const addQuickPhrase = (field: FormField, phrase: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field] ? `${prev[field]}; ${phrase}` : phrase,
    }));
  };

  const hasUserInput = useMemo(
    () => [
      formData.promoter,
      formData.visitDate,
      formData.network,
      formData.store,
      formData.leaderName,
      formData.leaderPhone,
      formData.freezerProducts,
      formData.freezerProblems,
      formData.toastedProducts,
      formData.exposureProblems,
      formData.generalObservations,
      formData.mainProblem,
      formData.stockDetails,
      formData.counterDetails,
      formData.actionTaken,
      formData.feedback,
    ].some(Boolean),
    [formData],
  );

  const promoterSuggestions = useMemo(
    () => Array.from(new Set([...PROMOTER_SUGGESTIONS, ...recentPromoters])),
    [recentPromoters],
  );

  const missingRequiredFields = useMemo(() => {
    const fields = [
      ["Promotora", formData.promoter],
      ["Data da visita", formData.visitDate],
      ["Rede", formData.network],
      ["Loja", formData.store],
    ] as const;
    return fields.filter(([, value]) => !value.trim()).map(([label]) => label);
  }, [formData]);

  const networkSuggestions = useMemo(() => recentNetworks, [recentNetworks]);
  const storeSuggestions = useMemo(() => recentStores, [recentStores]);

  useEffect(() => {
    const existingDraft = readDraft();
    if (existingDraft) {
      setDraftAvailable(true);
      setDraftSavedAt(existingDraft.savedAt);
    }
    setRecentPromoters(readRecentValues(RECENT_PROMOTERS_KEY));
    setRecentNetworks(readRecentValues(RECENT_NETWORKS_KEY));
    setRecentStores(readRecentValues(RECENT_STORES_KEY));
  }, []);

  useEffect(() => {
    if (!hasUserInput) return;

    const timeoutId = window.setTimeout(() => {
      const saved = saveDraft({ reportType, formData });
      if (saved) {
        setDraftSavedAt(new Date().toISOString());
      }
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [formData, hasUserInput, reportType]);

  const restoreDraft = () => {
    const existingDraft = readDraft();
    if (!existingDraft) {
      setDraftAvailable(false);
      setDraftSavedAt(null);
      return;
    }

    setReportType(existingDraft.reportType);
    setFormData({ ...createInitialFormData(), ...existingDraft.formData });
    setDraftAvailable(false);
    toast.success("Rascunho recuperado neste aparelho");
  };

  const discardDraft = () => {
    clearDraft();
    setDraftAvailable(false);
    setDraftSavedAt(null);
    toast.success("Rascunho descartado");
  };

  const formatReport = () => {
    if (reportType === "normal") {
      return `*VISITA BRIDOR*

**Promotora:** ${formData.promoter}
**Data Visita:** ${formData.visitDate}
**Rede:** ${formData.network}
**Loja:** ${formData.store}${formData.leaderName ? `
**Líder da Padaria:** ${formData.leaderName}` : ""}${formData.leaderPhone ? `
**Telefone:** ${formData.leaderPhone}` : ""}

**1. ESTOQUE (Câmara Fria):**
   - Produtos Bridor presentes? ${formData.productsInFreezer === "yes" ? "SIM" : "NÃO"}
   - Quais produtos em estoque? ${formData.freezerProducts || "N/A"}
   - Organização/Limpeza: ${formData.freezerOrganization === "ok" ? "OK" : "PROBLEMA"}
   - Problemas (se houver): ${formData.freezerProblems || "Nenhum"}

**2. BALCÃO/PDV:**
   - Produtos Bridor assados hoje? ${formData.productsToasted === "yes" ? "SIM" : "NÃO"}
   - Quais produtos assados? ${formData.toastedProducts || "N/A"}
   - Qualidade Visual: ${formData.visualQuality}
   - Exposição: ${formData.exposure === "ok" ? "OK" : "PROBLEMA"}
   - Detalhes: ${formData.exposureProblems || "Nenhum"}

**3. OBSERVAÇÕES GERAIS:**
${formData.generalObservations || "Nenhuma observação adicional"}

----
*Envie fotos da visita logo após este relatório*`;
    } else {
      return `*ALERTA BRIDOR - VISITA CRÍTICA*

**Promotora:** ${formData.promoter}
**Data Visita:** ${formData.visitDate}
**Rede:** ${formData.network}
**Loja:** ${formData.store}${formData.leaderName ? `
**Líder da Padaria:** ${formData.leaderName}` : ""}${formData.leaderPhone ? `
**Telefone:** ${formData.leaderPhone}` : ""}

**1. PROBLEMA PRINCIPAL IDENTIFICADO:**
${formData.mainProblem}

**2. DETALHES DO ESTOQUE (Câmara Fria):**
${formData.stockDetails}

**3. DETALHES DO BALCÃO/PDV:**
${formData.counterDetails}

**4. AÇÃO TOMADA PELA PROMOTORA:**
${formData.actionTaken}

**5. FEEDBACK DA LOJA/LÍDER:**
${formData.feedback}

----
*Envie fotos de evidência da situação logo após este relatório*`;
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    setShowValidation(true);
    if (missingRequiredFields.length > 0) {
      toast.error(`Preencha: ${missingRequiredFields.join(", ")}`);
      return;
    }

    setIsSubmitting(true);
    setSheetStatus("sending");

    try {
      const report = formatReport();
      setRecentPromoters(rememberRecentValue(RECENT_PROMOTERS_KEY, formData.promoter));
      setRecentNetworks(rememberRecentValue(RECENT_NETWORKS_KEY, formData.network));
      setRecentStores(rememberRecentValue(RECENT_STORES_KEY, formData.store));
      clearDraft();
      setDraftAvailable(false);
      setDraftSavedAt(null);

      await navigator.clipboard.writeText(report);
      toast.success("Relatório copiado para o clipboard!");
      setSubmitted(true);

      const payload = {
        ...formData,
        reportType: reportType === "normal" ? "Visita Normal" : "Alerta Crítico",
        report,
      };

      try {
        await fetch("https://script.google.com/macros/s/AKfycbw1UyX3duJKlJ410tnIJPyFMv8G7zxjgdPCrXDvP7AIzb37CxoS5-pxogKZW6NpjfZA/exec", {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(payload),
        });
        setSheetStatus("sent");
        toast.success("Envio para o Google Sheets concluído!");
      } catch (error) {
        console.error("Erro ao enviar para Google Sheets:", error);
        setSheetStatus("error");
        toast.error("A cópia foi feita, mas o envio para o Sheets falhou.");
      }
    } catch (error) {
      console.error("Erro ao preparar relatório:", error);
      setSheetStatus("error");
      toast.error("Não foi possível copiar o relatório. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(createInitialFormData());
    clearDraft();
    setDraftAvailable(false);
    setDraftSavedAt(null);
    setShowValidation(false);
    setSheetStatus("idle");
    setSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Bridor Relatórios</h1>
              <p className="text-sm text-slate-600">Formulário de Visitas Operacionais</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        {submitted ? (
          <div className="max-w-2xl mx-auto">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-8 text-center">
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-green-900 mb-2">Relatório Preparado!</h2>
                <p className="text-green-800 mb-4">O relatório foi copiado para a área de transferência e está pronto para enviar no WhatsApp.</p>
                <div className="mx-auto mb-6 max-w-md space-y-2 rounded-lg border border-green-200 bg-white/70 p-4 text-left text-sm">
                  <p className="font-medium text-green-900">✓ Copiado para o WhatsApp</p>
                  <p className={sheetStatus === "error" ? "font-medium text-red-700" : "font-medium text-green-900"}>
                    {sheetStatus === "sending" && "⏳ Enviando para o Google Sheets..."}
                    {sheetStatus === "sent" && "✓ Enviado para o Google Sheets"}
                    {sheetStatus === "error" && "! A cópia foi feita, mas o envio ao Sheets falhou"}
                  </p>
                </div>
                <div className="flex flex-col gap-3 justify-center sm:flex-row">
                  <Button onClick={() => setSubmitted(false)} className="bg-blue-600 hover:bg-blue-700">
                    Editar Relatório
                  </Button>
                  <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
                    Novo Relatório
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {draftAvailable && draftSavedAt && (
                <Card className="border-amber-200 bg-amber-50" role="status">
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-amber-950">Encontramos um rascunho neste aparelho</p>
                      <p className="text-sm text-amber-800">Salvo {formatDraftAge(draftSavedAt)}. Você quer continuar?</p>
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" onClick={restoreDraft} className="bg-amber-600 hover:bg-amber-700">
                        Continuar
                      </Button>
                      <Button type="button" onClick={discardDraft} variant="outline" className="border-amber-300 bg-white">
                        Descartar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {showValidation && missingRequiredFields.length > 0 && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">
                  <strong>Faltam informações:</strong> {missingRequiredFields.join(", ")}.
                </div>
              )}

              <datalist id="promoter-suggestions">
                {promoterSuggestions.map((value) => <option key={value} value={value} />)}
              </datalist>
              <datalist id="network-suggestions">
                {networkSuggestions.map((value) => <option key={value} value={value} />)}
              </datalist>
              <datalist id="store-suggestions">
                {storeSuggestions.map((value) => <option key={value} value={value} />)}
              </datalist>

              <Tabs value={reportType} onValueChange={setReportType} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="normal" className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Visita Normal
                  </TabsTrigger>
                  <TabsTrigger value="critical" className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Alerta Crítico
                  </TabsTrigger>
                </TabsList>

                {/* Normal Report */}
                <TabsContent value="normal" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Básicas</CardTitle>
                      <CardDescription>Dados da promotora e da loja visitada</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="promoter">Promotora *</Label>
                          <Input
                            id="promoter"
                            name="promoter"
                            placeholder="Seu nome"
                            list="promoter-suggestions"
                            autoComplete="name"
                            value={formData.promoter}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visitDate">Data da Visita *</Label>
                          <Input
                            id="visitDate"
                            name="visitDate"
                            type="date"
                            value={formData.visitDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="network">Rede *</Label>
                          <Input
                            id="network"
                            name="network"
                            placeholder="Ex: Zona Sul, Pão de Açúcar, OBA"
                            list="network-suggestions"
                            autoComplete="organization"
                            value={formData.network}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="store">Loja *</Label>
                          <Input
                            id="store"
                            name="store"
                            placeholder="Ex: Loja 17 Barra da Tijuca"
                            list="store-suggestions"
                            autoComplete="address-line1"
                            value={formData.store}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leaderName">Líder da Padaria</Label>
                          <Input
                            id="leaderName"
                            name="leaderName"
                            placeholder="Nome do responsável"
                            value={formData.leaderName}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leaderPhone">Telefone do Líder</Label>
                          <Input
                            id="leaderPhone"
                            name="leaderPhone"
                            placeholder="Ex: (21) 99999-9999"
                            value={formData.leaderPhone}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Estoque (Câmara Fria)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Produtos Bridor presentes?</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="productsInFreezer"
                              value="yes"
                              checked={formData.productsInFreezer === "yes"}
                              onChange={(e) => handleSelectChange("productsInFreezer", e.target.value)}
                            />
                            Sim
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="productsInFreezer"
                              value="no"
                              checked={formData.productsInFreezer === "no"}
                              onChange={(e) => handleSelectChange("productsInFreezer", e.target.value)}
                            />
                            Não
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="freezerProducts">Quais produtos em estoque?</Label>
                        <Textarea
                          id="freezerProducts"
                          name="freezerProducts"
                          placeholder="Ex: 5 cx Croissant Tradicional, 2 cx Folhado Chocolate"
                          value={formData.freezerProducts}
                          onChange={handleInputChange}
                          rows={2}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Organização/Limpeza</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="freezerOrganization"
                              value="ok"
                              checked={formData.freezerOrganization === "ok"}
                              onChange={(e) => handleSelectChange("freezerOrganization", e.target.value)}
                            />
                            OK
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="freezerOrganization"
                              value="problem"
                              checked={formData.freezerOrganization === "problem"}
                              onChange={(e) => handleSelectChange("freezerOrganization", e.target.value)}
                            />
                            Problema
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="freezerProblems">Problemas (se houver)</Label>
                        <Textarea
                          id="freezerProblems"
                          name="freezerProblems"
                          placeholder="Ex: Produtos amassados, Acesso negado, Pouco espaço"
                          value={formData.freezerProblems}
                          onChange={handleInputChange}
                          rows={2}
                        />
                        <p className="text-xs text-slate-500">Atalhos — toque para adicionar:</p>
                        <div className="flex flex-wrap gap-2">
                          {["Câmara fria desorganizada", "Produto descongelado", "Produto grudado", "Sem acesso à câmara fria"].map((phrase) => (
                            <Button key={phrase} type="button" size="sm" variant="outline" className="h-8 bg-white text-xs" onClick={() => addQuickPhrase("freezerProblems", phrase)}>
                              {phrase}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Balcão/PDV</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Produtos Bridor assados hoje?</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="productsToasted"
                              value="yes"
                              checked={formData.productsToasted === "yes"}
                              onChange={(e) => handleSelectChange("productsToasted", e.target.value)}
                            />
                            Sim
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="productsToasted"
                              value="no"
                              checked={formData.productsToasted === "no"}
                              onChange={(e) => handleSelectChange("productsToasted", e.target.value)}
                            />
                            Não
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="toastedProducts">Quais produtos assados?</Label>
                        <Textarea
                          id="toastedProducts"
                          name="toastedProducts"
                          placeholder="Ex: Croissant Tradicional, Mini Amanteigado"
                          value={formData.toastedProducts}
                          onChange={handleInputChange}
                          rows={2}
                        />
                        <p className="text-xs text-slate-500">Atalhos — toque para adicionar:</p>
                        <div className="flex flex-wrap gap-2">
                          {["Produto mal assado", "Produto grudado", "Produto descongelado"].map((phrase) => (
                            <Button key={phrase} type="button" size="sm" variant="outline" className="h-8 bg-white text-xs" onClick={() => addQuickPhrase("toastedProducts", phrase)}>
                              {phrase}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visualQuality">Qualidade Visual</Label>
                        <select
                          id="visualQuality"
                          name="visualQuality"
                          value={formData.visualQuality}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        >
                          <option value="excellent">Ótima</option>
                          <option value="good">Boa</option>
                          <option value="regular">Regular</option>
                          <option value="poor">Ruim</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label>Exposição</Label>
                        <div className="flex gap-4">
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="exposure"
                              value="ok"
                              checked={formData.exposure === "ok"}
                              onChange={(e) => handleSelectChange("exposure", e.target.value)}
                            />
                            OK
                          </label>
                          <label className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="exposure"
                              value="problem"
                              checked={formData.exposure === "problem"}
                              onChange={(e) => handleSelectChange("exposure", e.target.value)}
                            />
                            Problema
                          </label>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="exposureProblems">Detalhes</Label>
                        <Textarea
                          id="exposureProblems"
                          name="exposureProblems"
                          placeholder="Ex: Sem etiqueta, Pouca visibilidade"
                          value={formData.exposureProblems}
                          onChange={handleInputChange}
                          rows={2}
                        />
                        <p className="text-xs text-slate-500">Atalhos — toque para adicionar:</p>
                        <div className="flex flex-wrap gap-2">
                          {["Sem etiqueta", "Pouca visibilidade", "Exposição desorganizada"].map((phrase) => (
                            <Button key={phrase} type="button" size="sm" variant="outline" className="h-8 bg-white text-xs" onClick={() => addQuickPhrase("exposureProblems", phrase)}>
                              {phrase}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Observações Gerais</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="generalObservations"
                        placeholder="Ex: Gerente pediu mais etiquetas, Degustação de sucesso, Cross-merchandising com queijos"
                        value={formData.generalObservations}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Critical Alert */}
                <TabsContent value="critical" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações Básicas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="promoter-critical">Promotora *</Label>
                          <Input
                            id="promoter-critical"
                            name="promoter"
                            placeholder="Seu nome"
                            list="promoter-suggestions"
                            autoComplete="name"
                            value={formData.promoter}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="visitDate-critical">Data da Visita *</Label>
                          <Input
                            id="visitDate-critical"
                            name="visitDate"
                            type="date"
                            value={formData.visitDate}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="network-critical">Rede *</Label>
                          <Input
                            id="network-critical"
                            name="network"
                            placeholder="Ex: Zona Sul, Pão de Açúcar, OBA"
                            list="network-suggestions"
                            autoComplete="organization"
                            value={formData.network}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="store-critical">Loja *</Label>
                          <Input
                            id="store-critical"
                            name="store"
                            placeholder="Ex: Loja 17 Barra da Tijuca"
                            list="store-suggestions"
                            autoComplete="address-line1"
                            value={formData.store}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Problema Principal Identificado</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="mainProblem"
                        placeholder="Descreva o problema principal encontrado"
                        value={formData.mainProblem}
                        onChange={handleInputChange}
                        rows={3}
                      />
                      <p className="mt-2 text-xs text-slate-500">Atalhos — toque para adicionar:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Ruptura de produto", "Produto mal assado", "Produto grudado", "Problema na câmara fria"].map((phrase) => (
                          <Button key={phrase} type="button" size="sm" variant="outline" className="h-8 bg-white text-xs" onClick={() => addQuickPhrase("mainProblem", phrase)}>
                            {phrase}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes do Estoque</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="stockDetails"
                        placeholder="Detalhes sobre o estoque na câmara fria"
                        value={formData.stockDetails}
                        onChange={handleInputChange}
                        rows={3}
                      />
                      <p className="mt-2 text-xs text-slate-500">Atalhos — toque para adicionar:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Produto descongelado", "Produto grudado", "Câmara fria desorganizada"].map((phrase) => (
                          <Button key={phrase} type="button" size="sm" variant="outline" className="h-8 bg-white text-xs" onClick={() => addQuickPhrase("stockDetails", phrase)}>
                            {phrase}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detalhes do Balcão/PDV</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="counterDetails"
                        placeholder="Detalhes sobre o balcão e ponto de venda"
                        value={formData.counterDetails}
                        onChange={handleInputChange}
                        rows={3}
                      />
                      <p className="mt-2 text-xs text-slate-500">Atalhos — toque para adicionar:</p>
                      <div className="flex flex-wrap gap-2">
                        {["Produto mal assado", "Exposição insuficiente", "Produto grudado"].map((phrase) => (
                          <Button key={phrase} type="button" size="sm" variant="outline" className="h-8 bg-white text-xs" onClick={() => addQuickPhrase("counterDetails", phrase)}>
                            {phrase}
                          </Button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Ação Tomada</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="actionTaken"
                        placeholder="Qual ação foi tomada para resolver o problema?"
                        value={formData.actionTaken}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Feedback da Loja/Líder</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        name="feedback"
                        placeholder="Qual foi o feedback recebido?"
                        value={formData.feedback}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <div className="mt-8">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    size="lg"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:cursor-wait disabled:opacity-70"
                  >
                    {isSubmitting ? "Preparando relatório..." : "Preparar Relatório para WhatsApp"}
                  </Button>
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    size="lg"
                    disabled={isSubmitting}
                  >
                    Limpar
                  </Button>
                </div>
                {hasUserInput && draftSavedAt && (
                  <p className="mt-2 text-center text-xs text-slate-500">Rascunho salvo {formatDraftAge(draftSavedAt)} neste aparelho.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
