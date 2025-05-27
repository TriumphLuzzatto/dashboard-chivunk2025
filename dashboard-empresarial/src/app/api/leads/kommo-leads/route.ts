import { NextResponse } from "next/server";

export async function GET() {
  const KOMMO_SUBDOMAIN = "dicasdebombeirooficial";
  const KOMMO_TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc3NjMxMDVhNGEzYjg2NDkyNGY0ZTg4YzE0MmY3MjlmNjdjMWM2ODRmOTg4YmVlYjcxOGQ4MTY0ZjUyMjAzYjkyNWJmMzI4ZjZlYTJjN2FkIn0.eyJhdWQiOiI2ZmQxMmJmNi04YTcwLTQ5MmUtOTY4Yy1kNTk3ZGVhYzY3NDAiLCJqdGkiOiI3NzYzMTA1YTRhM2I4NjQ5MjRmNGU4OGMxNDJmNzI5ZjY3YzFjNjg0Zjk4OGJlZWI3MThkODE2NGY1MjIwM2I5MjViZjMyOGY2ZWEyYzdhZCIsImlhdCI6MTc0ODM1MTI5NSwibmJmIjoxNzQ4MzUxMjk1LCJleHAiOjE3NDg1NjMyMDAsInN1YiI6IjEwNDMxNjk5IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMyMDI4MDI3LCJiYXNlX2RvbWFpbiI6ImtvbW1vLmNvbSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJjcm0iLCJmaWxlcyIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiLCJwdXNoX25vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiY2M4MGQ3YTQtM2RjYS00NzU0LWI2ODEtZWEwMDRiOWIxMjg1IiwiYXBpX2RvbWFpbiI6ImFwaS1nLmtvbW1vLmNvbSJ9.k3LOaKQmo6AadXAajtHtxOb2577OdcsF6PJpZ9oFZU_qU7kCuxQDzRjvDnDuw190Z-72zhhCvBM3NVgL7M0idwEBNCigpBv0nFMiWtHUVmfIaPicjuxkVdXmkyqTGjfNay5LaE3P2aq2uWTmMnV5j3p-dMse_21k9rJ5jpgqZmERPPcp-67tBOHvZ58o1wSwrFtz72kNTpHPLo4X9S4F7A1m0zuz1LsQRL-xMVKMb3yuRdlvNSn04lG8jcMD2X0dVRblk6OAbo8j04Wh6-_7ucGgt3R1_8qBiT1ZQiLp_ZvQXbiLM1xFi8fbeXyDIj0HSAEGjlTris2v3wvtHuoVRQ";

  const pipelines = [
    7762991, // Camisetas WhatsApp
    8084435, // Camisetas Instagram
    8623875, // Mentoria Chivunk
    10735752, // SUCESSO DO CLIENTE
    10765884, // SDR - INSTAGRAM TIAGOLUCIAN
    11176628, // AGENDAMENTO AGENTE - MENTORIA
  ];

  let allLeads: any[] = [];

  try {
    for (const pipelineId of pipelines) {
      const response = await fetch(`https://${KOMMO_SUBDOMAIN}.kommo.com/api/v4/leads?with=contacts&pipeline_id=${pipelineId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${KOMMO_TOKEN}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      const leads = data._embedded?.leads || [];

      console.log("🔍 LEADS DO KOMMO:", JSON.stringify(leads, null, 2));

      const leadsFormatados = leads.map((lead: any) => {
        const tags = (lead._embedded?.tags || []).map((t: any) => t.name.toUpperCase());
        const dataFormatada = new Date(lead.created_at * 1000).toLocaleDateString("pt-BR");

        return {
          DATA: dataFormatada,
          WhatsApp: tags.includes("WHATSAPP") ? 1 : 0,
          Instagram: tags.includes("INSTAGRAM") ? 1 : 0,
          Mentoria3k: tags.includes("MENTORIA 3K") ? 1 : 0,
          Mentoria2k: tags.includes("MENTORIA 2K") ? 1 : 0,
          Tribo: tags.includes("TRIBO CHIVUNK") ? 1 : 0,
          VendasTribo: tags.includes("TRIBO CHIVUNK") && lead.price >= 100 && lead.price <= 1000 ? 1 : 0,
          VendasMentoria: tags.some((t: any) => t.includes("MENTORIA")) && lead.price > 1000 ? 1 : 0,
          VendasOutros: tags.every((t: any) => !["TRIBO CHIVUNK", "MENTORIA 3K", "MENTORIA 2K"].includes(t)) && lead.price > 0 ? 1 : 0,
        };
      });

      allLeads = allLeads.concat(leadsFormatados);
    }

    return NextResponse.json(allLeads);
  } catch (error: any) {
    console.error("Erro geral:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}