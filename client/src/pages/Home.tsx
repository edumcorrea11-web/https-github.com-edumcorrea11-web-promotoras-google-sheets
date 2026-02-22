import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [reportType, setReportType] = useState("normal");
  const [submitted, setSubmitted] = useState(false);
  
  const [formData, setFormData] = useState({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
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
    
    if (!formData.promoter || !formData.visitDate || !formData.network || !formData.store) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      const report = formatReport();
      
      // 1. Copy to clipboard
      await navigator.clipboard.writeText(report);
      toast.success("Relatório copiado para clipboard!");
      
      // 2. Send to Google Sheets via webhook
      const payload = {
        ...formData,
        reportType: reportType === "normal" ? "Visita Normal" : "Alerta Crítico",
        report: report
      };
      
      fetch('https://script.google.com/macros/s/AKfycbw1UyX3duJKlJ410tnIJPyFMv8G7zxjgdPCrXDvP7AIzb37CxoS5-pxogKZW6NpjfZA/exec', {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(payload)
      })
        .then(() => toast.success("Dados enviados para Google Sheets!"))
        .catch(err => {
          console.error('Erro ao enviar para Google Sheets:', err);
          toast.error("Aviso: Dados nao foram para Google Sheets");
        });
      
      setSubmitted(true);
      // Nao reseta automaticamente - deixa o usuario decidir
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao copiar relatório");
    }
  };

  const resetForm = () => {
    setFormData({
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
                <div className="flex gap-3 justify-center">
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
             <div className="mt-8 flex gap-3">
              <Button
                onClick={handleSubmit}
                size="lg"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
              >
                Preparar Relatório para WhatsApp
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                size="lg"
              >
                Limpar
              </Button>
            </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
