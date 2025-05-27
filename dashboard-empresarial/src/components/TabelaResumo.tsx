'use client';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

interface TabelaResumoProps {
  dados: any[];
}

export default function TabelaResumo({ dados }: TabelaResumoProps) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-2">Resumo Diário</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>Instagram</TableHead>
            <TableHead>Mentoria 3k</TableHead>
            <TableHead>Mentoria 2k</TableHead>
            <TableHead>Tribo</TableHead>
            <TableHead>Calls</TableHead>
            <TableHead>Vendas Tribo</TableHead>
            <TableHead>Vendas Mentoria</TableHead>
            <TableHead>Vendas Outros</TableHead>
            <TableHead>Total Vendas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dados.map((item, i) => (
            <TableRow key={i}>
              <TableCell>{item.data}</TableCell>
              <TableCell>{item.whatsapp}</TableCell>
              <TableCell>{item.instagram}</TableCell>
              <TableCell>{item.mentoria_3k}</TableCell>
              <TableCell>{item.mentoria_2k}</TableCell>
              <TableCell>{item.tribo}</TableCell>
              <TableCell>{item.calls}</TableCell>
              <TableCell>{item.vendas_tribo}</TableCell>
              <TableCell>{item.vendas_mentoria}</TableCell>
              <TableCell>{item.vendas_outros}</TableCell>
              <TableCell>{item.total_vendas}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
