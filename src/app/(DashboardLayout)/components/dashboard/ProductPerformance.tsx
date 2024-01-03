import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@material-ui/core";

interface Data {
  objetivos: {
    id: string;
    nome: string;
    statusId: number;
    diretoria: number; // Adicione mais propriedades conforme necessário
    tags: string[];
  }[];
  projetos: {
    id: string;
    nome: string;
    objetivoId: string;
    diretoria: number;
    tags: string[];
  }[];
  responsavel: {
    id: number;
    nome: string;
  }[];
  diretorias: {
    id: number;
    nome: string;
    sigla: string;
  }[];
}

const ProductPerformance = () => {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3001/db");
        const jsonData: Data = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Erro ao carregar os dados:", error);
      }
    };

    fetchData();
  }, []);

  if (!data) {
    return <p>Carregando...</p>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Projeto</TableCell>
            <TableCell>Objetivo</TableCell>
            <TableCell>Responsável</TableCell>
            <TableCell>Diretoria</TableCell>
            <TableCell>Tag</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.projetos.map((projeto) => (
            <TableRow key={projeto.id}>
              <TableCell>{projeto.nome}</TableCell>
              <TableCell>
                {data.objetivos.find((objetivo) => objetivo.id === projeto.objetivoId)?.nome}
              </TableCell>
              <TableCell>{data.responsavel.find((resp) => resp.id === projeto.diretoria)?.nome}</TableCell>
              <TableCell>{data.diretorias.find((dir) => dir.id === projeto.diretoria)?.nome}</TableCell>
              <TableCell>{projeto.tags.join(", ")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductPerformance;
