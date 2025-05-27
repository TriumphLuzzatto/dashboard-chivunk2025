import { NextResponse } from "next/server";
import Papa from "papaparse";

export const dynamic = "force-dynamic";

export async function GET() {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWmnvgOq3tKpFmJ-SD3NQktUOZf0ysHUFeKnn-DTOjdQEuCTZfv7Mf--ZAxWHvW5oZK4IUbFXMO0yp/pub?output=csv";

  try {
    const response = await fetch(sheetUrl);
    const fileContent = await response.text();

    const { data } = Papa.parse(fileContent, {
      header: true,
      skipEmptyLines: true,
    });

    const dadosFormatados = (data as any[])
      .map((item) => {
        const novoItem: Record<string, any> = {};

        for (const [key, value] of Object.entries(item)) {
          const k = key.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
          const v = value?.toString().trim();

          if (k.toLowerCase().includes("data")) novoItem["data"] = v;
          else if (k.includes("LEADS MENTORIA 3k")) novoItem["mentoria_3k"] = Number(v) || 0;
          else if (k.includes("LEADS MENTORIA 2K")) novoItem["mentoria_2k"] = Number(v) || 0;
          else if (k.includes("LEADS TRIBO")) novoItem["tribo"] = Number(v) || 0;
          else if (k.includes("TOTAL DE LEADS ÚTEIS WHATSAPP")) novoItem["whatsapp"] = Number(v) || 0;
          else if (k.includes("LEADS NOVOS INSTAGRAM")) novoItem["instagram"] = Number(v) || 0;
          else if (k.includes("AGENDAMENTOS FEITOS NO DIA WHATSAPP")) {
            novoItem["ag_wpp"] = Number(v) || 0;
          }
          else if (k.includes("AGENDAMENTOS INSTAGRAM")) {
            novoItem["ag_insta"] = Number(v) || 0;
          }
          else if (k.includes("TRIBO CHIVUNK")) {
            novoItem["vendas_tribo"] = (novoItem["vendas_tribo"] || 0) + (Number(v) || 0);
          }
          else if (k.includes("VENDAS REALIZADAS MENTORIA")) {
            novoItem["vendas_mentoria"] = (novoItem["vendas_mentoria"] || 0) + (Number(v) || 0);
          }
          else if (k.includes("VENDAS DE OUTROS PRODUTOS")) {
            novoItem["vendas_outros"] = (novoItem["vendas_outros"] || 0) + (Number(v) || 0);
          }
        }

        novoItem["total_vendas"] =
          (novoItem["vendas_tribo"] || 0) +
          (novoItem["vendas_mentoria"] || 0) +
          (novoItem["vendas_outros"] || 0);

        return novoItem;
      })
      .filter((item) =>
        item["data"] &&
        !item["data"].toString().toLowerCase().includes("soma") &&
        !item["data"].toString().toLowerCase().includes("total")
      );

    return NextResponse.json(dadosFormatados);
  } catch (error) {
    console.error("Erro ao buscar dados:", error);
    return NextResponse.json({ error: "Erro ao buscar a planilha." }, { status: 500 });
  }
}