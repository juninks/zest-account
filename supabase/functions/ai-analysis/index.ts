import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { transactions, month } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY não configurada");

    const income = transactions.filter((t: any) => t.type === "income").reduce((s: number, t: any) => s + t.amount, 0);
    const expense = transactions.filter((t: any) => t.type === "expense").reduce((s: number, t: any) => s + t.amount, 0);
    const byCat: Record<string, number> = {};
    transactions.filter((t: any) => t.type === "expense").forEach((t: any) => {
      byCat[t.category] = (byCat[t.category] ?? 0) + t.amount;
    });

    const summary = `Mês: ${month}
Receitas: R$ ${income.toFixed(2)}
Despesas: R$ ${expense.toFixed(2)}
Saldo: R$ ${(income - expense).toFixed(2)}
Gastos por categoria: ${Object.entries(byCat).map(([k, v]) => `${k}=R$${v.toFixed(2)}`).join(", ")}
Total de transações: ${transactions.length}`;

    const systemPrompt = `Você é um consultor financeiro pessoal brasileiro, direto, empático e prático. Analise os dados do mês do usuário e gere uma análise PERSONALIZADA e ÚNICA (varie sempre o tom e exemplos). Responda APENAS um JSON válido sem markdown, com este formato exato:
{
  "summary": "frase de abertura curta e personalizada (1-2 frases)",
  "insights": ["3 a 4 insights curtos com emojis"],
  "warnings": ["alertas se houver problemas, vazio se tudo bem"],
  "tips": ["2 a 3 dicas práticas e específicas"],
  "score": número de 0 a 100 representando saúde financeira
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: summary },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (response.status === 429) {
      return new Response(JSON.stringify({ error: "Muitas requisições. Aguarde um momento." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (response.status === 402) {
      return new Response(JSON.stringify({ error: "Créditos de IA esgotados. Adicione créditos no workspace." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!response.ok) {
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("Erro no gateway de IA");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content ?? "{}";
    const analysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-analysis error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
