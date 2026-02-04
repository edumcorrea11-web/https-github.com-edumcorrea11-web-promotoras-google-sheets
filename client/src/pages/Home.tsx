import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export default function Home() {
  const [reportType, setReportType] = useState("simple");
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

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.promoter || !formData.visitDate || !formData.network || !formData.store) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    try {
      const report = formatReport();
      
      await navigator.clipboard.writeText(report);
      toast.success("Relatório copiado para a área de transferência!");
      
      setSubmitted(true);
      setTimeout(() => { resetForm(); }, 2000);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao copiar relatório");
    }
  };

  const formatReport = () => {
    if (reportType === "simple") {
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
   - Qualidade Visual: ${formatQuality(formData.visualQuality)}
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

  const formatQuality = (quality: string) => {
    const map: Record<string, string> = {
      excellent: "ÓTIMA",
      good: "BOA",
      regular: "REGULAR",
      poor: "RUIM"
    };
    return map[quality] || quality;
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
                <Button onClick={resetForm} className="bg-green-600 hover:bg-green-700">
                  Criar Novo Relatório
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <Tabs value={reportType} onValueChange={setReportType} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="simple" className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Visita Normal
                </TabsTrigger>
                <TabsTrigger value="critical" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Alerta Crítico
                </TabsTrigger>
              </TabsList>

              {/* Simple Report */}
              <TabsContent value="simple" className="space-y-6">
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

                {/* Freezer Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Estoque (Câmara Fria)</CardTitle>
                    <CardDescription>Situação dos produtos em refrigeração</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label>Produtos Bridor presentes?</Label>
                      <RadioGroup value={formData.productsInFreezer} onValueChange={(value) => handleSelectChange("productsInFreezer", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="freezer-yes" />
                          <Label htmlFor="freezer-yes" className="font-normal cursor-pointer">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="freezer-no" />
                          <Label htmlFor="freezer-no" className="font-normal cursor-pointer">Não</Label>
                        </div>
                      </RadioGroup>
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

                    <div className="space-y-3">
                      <Label>Organização/Limpeza</Label>
                      <RadioGroup value={formData.freezerOrganization} onValueChange={(value) => handleSelectChange("freezerOrganization", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ok" id="org-ok" />
                          <Label htmlFor="org-ok" className="font-normal cursor-pointer">OK</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="problem" id="org-problem" />
                          <Label htmlFor="org-problem" className="font-normal cursor-pointer">Problema</Label>
                        </div>
                      </RadioGroup>
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

                {/* Counter/PDV Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Balcão/PDV</CardTitle>
                    <CardDescription>Situação dos produtos expostos</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label>Produtos Bridor assados hoje?</Label>
                      <RadioGroup value={formData.productsToasted} onValueChange={(value) => handleSelectChange("productsToasted", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="yes" id="toasted-yes" />
                          <Label htmlFor="toasted-yes" className="font-normal cursor-pointer">Sim</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="no" id="toasted-no" />
                          <Label htmlFor="toasted-no" className="font-normal cursor-pointer">Não</Label>
                        </div>
                      </RadioGroup>
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

                    <div className="space-y-3">
                      <Label>Qualidade Visual</Label>
                      <Select value={formData.visualQuality} onValueChange={(value) => handleSelectChange("visualQuality", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Ótima</SelectItem>
                          <SelectItem value="good">Boa</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="poor">Ruim</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label>Exposição</Label>
                      <RadioGroup value={formData.exposure} onValueChange={(value) => handleSelectChange("exposure", value)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="ok" id="exp-ok" />
                          <Label htmlFor="exp-ok" className="font-normal cursor-pointer">OK</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="problem" id="exp-problem" />
                          <Label htmlFor="exp-problem" className="font-normal cursor-pointer">Problema</Label>
                        </div>
                      </RadioGroup>
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

                {/* General Observations */}
                <Card>
                  <CardHeader>
                    <CardTitle>Observações Gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="generalObservations">Feedback, oportunidades e boas práticas</Label>
                      <Textarea
                        id="generalObservations"
                        name="generalObservations"
                        placeholder="Ex: Gerente pediu mais etiquetas, Degustação de sucesso, Cross-merchandising com queijos"
                        value={formData.generalObservations}
                        onChange={handleInputChange}
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Critical Report */}
              <TabsContent value="critical" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                    <CardDescription>Dados da promotora e da loja visitada</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="promoter-crit">Promotora *</Label>
                        <Input
                          id="promoter-crit"
                          name="promoter"
                          placeholder="Seu nome"
                          value={formData.promoter}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="visitDate-crit">Data da Visita *</Label>
                        <Input
                          id="visitDate-crit"
                          name="visitDate"
                          type="date"
                          value={formData.visitDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="network-crit">Rede *</Label>
                        <Input
                          id="network-crit"
                          name="network"
                          placeholder="Ex: Zona Sul, Pão de Açúcar"
                          value={formData.network}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="store-crit">Loja *</Label>
                        <Input
                          id="store-crit"
                          name="store"
                          placeholder="Ex: Loja 17 Barra da Tijuca"
                          value={formData.store}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaderName-crit">Líder da Padaria</Label>
                        <Input
                          id="leaderName-crit"
                          name="leaderName"
                          placeholder="Nome do responsável"
                          value={formData.leaderName}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="leaderPhone-crit">Telefone do Líder</Label>
                        <Input
                          id="leaderPhone-crit"
                          name="leaderPhone"
                          placeholder="Ex: (21) 99999-9999"
                          value={formData.leaderPhone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="text-red-900">Problema Principal Identificado</CardTitle>
                    <CardDescription className="text-red-800">Descreva o problema crítico encontrado</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="mainProblem"
                      placeholder="Ex: Ruptura Crônica desde abril, Problema de Qualidade, Erro de Sistema"
                      value={formData.mainProblem}
                      onChange={handleInputChange}
                      rows={3}
                      required
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Detalhes do Estoque (Câmara Fria)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="stockDetails"
                      placeholder="Produtos em falta, quantidade de estoque, condição da câmara, acesso, etc."
                      value={formData.stockDetails}
                      onChange={handleInputChange}
                      rows={4}
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
                      placeholder="Produtos assados, qualidade visual, exposição, etiquetas, etc."
                      value={formData.counterDetails}
                      onChange={handleInputChange}
                      rows={4}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ação Tomada pela Promotora</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="actionTaken"
                      placeholder="Ex: Orientei padeiro, Falei com gerente, Avisei o líder da padaria"
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
                      placeholder="Ex: Gerente informou que não recebe o produto desde ABRIL"
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
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-slate-50 mt-12 py-6">
        <div className="container text-center text-sm text-slate-600">
          <p>Bridor - Gestão Operacional de Visitas © 2025</p>
        </div>
      </div>
    </div>
  );
}
