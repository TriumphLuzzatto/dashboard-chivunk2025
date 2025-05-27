'use client';

import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import TabelaResumo from "@/components/TabelaResumo";

// Tipagem refinada dos dados da API
type DadoAPI = {
  data: string;
  whatsapp?: number;
  instagram?: number;
  mentoria_3k?: number;
  mentoria_2k?: number;
  tribo?: number;
  ag_wpp?: number;
  ag_insta?: number;
  vendas_tribo?: number;
  vendas_mentoria?: number;
  vendas_outros?: number;
};

type DadoLinha = { data: string; whatsapp: number; instagram: number };
type DadoBarra = { data: string; mentoria_3k: number; mentoria_2k: number; tribo: number };
type DadoPizza = { name: string; value: number };
type Kpi = { label: string; value: string | number };

export default function DashboardCompleto() {
  const [dados, setDados] = useState<DadoAPI[]>([]);
  const [dataLinha, setDataLinha] = useState<DadoLinha[]>([]);
  const [dataBarras, setDataBarras] = useState<DadoBarra[]>([]);
  const [dataPizza, setDataPizza] = useState<DadoPizza[]>([]);
  const [kpis, setKpis] = useState<Kpi[]>([]);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [canal, setCanal] = useState("Todos");

  useEffect(() => {
    fetch("/api/leads")
      .then((res) => res.json())
      .then((dados: DadoAPI[]) => {
        const linha: DadoLinha[] = [];
        const barras: DadoBarra[] = [];

        let totalWhatsApp = 0;
        let totalInstagram = 0;
        let totalAgWhatsApp = 0;
        let totalAgInstagram = 0;

        dados.forEach((item) => {
          const dataStr = item.data;
          if (!dataStr) return;

          const [dia, mes, ano] = dataStr.split("/");
          const dataFormatada = new Date(Number(ano), Number(mes) - 1, Number(dia));

          const inicio = dataInicio ? new Date(dataInicio) : null;
          const fim = dataFim ? new Date(dataFim) : null;

          if (inicio && dataFormatada < inicio) return;
          if (fim && dataFormatada > fim) return;

          const whatsapp = item.whatsapp || 0;
          const instagram = item.instagram || 0;
          const agWpp = item.ag_wpp || 0;
          const agInsta = item.ag_insta || 0;

          if (canal === "WhatsApp" && whatsapp === 0) return;
          if (canal === "Instagram" && instagram === 0) return;

          totalWhatsApp += whatsapp;
          totalInstagram += instagram;
          totalAgWhatsApp += agWpp;
          totalAgInstagram += agInsta;

          linha.push({ data: dataStr, whatsapp, instagram });
          barras.push({ data: dataStr, mentoria_3k: 0, mentoria_2k: 0, tribo: 0 });
        });

        const conversaoWhatsApp = totalWhatsApp ? ((totalAgWhatsApp / totalWhatsApp) * 100).toFixed(1) : "0.0";
        const conversaoInstagram = totalInstagram ? ((totalAgInstagram / totalInstagram) * 100).toFixed(1) : "0.0";

        setDataLinha(linha);
        setDataBarras(barras);
        setDataPizza([
          { name: "Tribo", value: 0 },
          { name: "Mentoria", value: 0 },
          { name: "Outros", value: 0 },
        ]);
        setKpis([
          { label: "Ag. WhatsApp", value: totalAgWhatsApp },
          { label: "Ag. Instagram", value: totalAgInstagram },
          { label: "Leads WhatsApp", value: totalWhatsApp },
          { label: "Leads Instagram", value: totalInstagram },
          { label: "Conversão WhatsApp (%)", value: conversaoWhatsApp },
          { label: "Conversão Instagram (%)", value: conversaoInstagram },
        ]);
        setDados(dados);
      });
  }, [canal, dataInicio, dataFim]);

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-sm">Data Início</label>
          <input type="date" className="border rounded px-2 py-1" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Data Fim</label>
          <input type="date" className="border rounded px-2 py-1" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
        </div>
        <div>
          <label className="text-sm">Canal</label>
          <select className="border rounded px-2 py-1" value={canal} onChange={(e) => setCanal(e.target.value)}>
            <option>Todos</option>
            <option>WhatsApp</option>
            <option>Instagram</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <Card key={index} className="bg-white text-black shadow-md">
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">{kpi.label}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-lg font-semibold mb-2">Leads WhatsApp</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataLinha}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="whatsapp" stroke="#e11d48" name="WhatsApp" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h2 className="text-lg font-semibold mb-2">Leads Instagram</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataLinha}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="data" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="instagram" stroke="#2563eb" name="Instagram" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

        

      <TabelaResumo dados={dados} />
    </div>
  );
}
