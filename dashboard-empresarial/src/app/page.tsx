"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parse, isAfter, isBefore } from "date-fns";

export default function Home() {
  const [dados, setDados] = useState<any[]>([]);
  const [filtroDataInicio, setFiltroDataInicio] = useState("");
  const [filtroDataFim, setFiltroDataFim] = useState("");
  const [canal, setCanal] = useState("Todos");

  const [colunas, setColunas] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/leads/kommo-leads")
      .then((res) => res.json())
      .then((data) => {
        setDados(data);
        if (data.length > 0) {
          const nomes = Object.keys(data[0]);
          setColunas(nomes);
          console.log("🔍 COLUNAS DISPONÍVEIS NO CSV:", nomes);
        }
      });
  }, []);

  function encontrarColunaCanal(chave: string) {
    return colunas.find((coluna) =>
      coluna.toLowerCase().includes(chave.toLowerCase())
    );
  }

  const dadosFiltrados = dados.filter((linha) => {
    const dataTexto = linha["DATA"];
    const dataValida = /^\d{2}\/\d{2}\/\d{4}$/.test(dataTexto);
    if (!dataValida) return false;

    const dataFormatada = parse(dataTexto, "dd/MM/yyyy", new Date());

    const dentroDoIntervalo =
      (!filtroDataInicio || !isBefore(dataFormatada, new Date(filtroDataInicio))) &&
      (!filtroDataFim || !isAfter(dataFormatada, new Date(filtroDataFim)));

    const chaveCanal = canal === "WhatsApp" ? "WhatsApp" : canal === "Instagram" ? "Instagram" : "";
    const nomeColuna = canal === "Todos" ? null : encontrarColunaCanal(chaveCanal);
    const valor = nomeColuna ? linha[nomeColuna] : null;
    const numero = valor ? parseInt(valor.toString().replace(/\D/g, "")) || 0 : 0;

    console.log(
      "Canal:", canal,
      "| Coluna Detectada:", nomeColuna,
      "| Valor Original:", valor,
      "| Número:", numero,
      "| Dentro Intervalo:", dentroDoIntervalo,
      "| Mostrar:", dentroDoIntervalo && (canal === "Todos" || numero > 0)
    );

    if (canal === "Todos") {
      return dentroDoIntervalo;
    }

    return dentroDoIntervalo && numero > 0;
  });

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard – Leads Chivunk 🔥</h1>

      <div className="flex flex-wrap gap-4">
        <div className="space-y-1">
          <label className="text-sm">Data Início</label>
          <Input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Data Fim</label>
          <Input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm">Canal</label>
          <Select value={canal} onValueChange={setCanal}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              {colunas.map((coluna, index) => (
                <TableHead key={index}>{coluna}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {dadosFiltrados.map((linha, index) => (
              <TableRow key={index}>
                {colunas.map((coluna, i) => (
                  <TableCell key={i}>{linha[coluna]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}