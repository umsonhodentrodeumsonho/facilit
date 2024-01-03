import React, { useEffect, useState } from "react";
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme, VictoryLabel } from "victory";
import axios, { AxiosResponse } from "axios";

interface Project {
  id: string;
  nome: string;
  objetivoId: string;
  statusId: number;
  diretoria: string;
  tags: string[];
}

interface Department {
  id: number;
  nome: string;
  sigla: string;
}

const ProjectsByDepartmentChart: React.FC = () => {
  const [data, setData] = useState<{ department: string; projects: number; statusId: number }[]>([]);

  useEffect(() => {
    axios.get<{
      projetos: Project[];
      diretorias: Department[];
    }>("http://localhost:3001/db")
      .then((response: AxiosResponse) => {
        const projectsByDepartment = response.data.projetos.reduce((acc: Record<string, { projects: number; statusId: number }>, projeto: Project) => {
          const departmentId: string = projeto.diretoria;
          acc[departmentId] = acc[departmentId] || { projects: 0, statusId: 1 };
          acc[departmentId].projects += 1;
          acc[departmentId].statusId = projeto.statusId;
          return acc;
        }, {} as Record<string, { projects: number; statusId: number }>);

        const chartData = response.data.diretorias.map((diretoria: { sigla: string; id: string | number; }) => ({
          department: diretoria.sigla,
          projects: projectsByDepartment[diretoria.id]?.projects || 0,
          statusId: projectsByDepartment[diretoria.id]?.statusId || 1,
        }));

        setData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  // Função para obter a cor com base no statusId de cada projeto
  const getStatusColor = (statusId: number) => {
    const colorMap: Record<number, string> = {
      1: "#3498db", // Status 1
      2: "#2c3e50", // Status 2
    };
    return colorMap[statusId] || "#8884d8"; // Cor padrão, substitua pela cor desejada
  };

  return (
    <VictoryChart
      theme={VictoryTheme.material}
      domainPadding={{ x: 20 }}
      width={800}
      height={400}
      horizontal
    >
      <VictoryAxis
        dependentAxis
        tickFormat={(tick) => `${tick}`}
        tickCount={5}
        style={{
          axisLabel: { padding: 30, fontSize: 10 },
          tickLabels: { fontSize: 8 },
        }}
        label="Quantidade de Projetos"
      />
      <VictoryAxis
        tickFormat={(tick) => tick}
        style={{
          tickLabels: { fontSize: 10 },
        }}
      />
      <VictoryBar
        data={data}
        x="department"
        y="projects"
        labels={({ datum }) => datum.projects}
        style={{
          data: { fill: ({ datum }) => getStatusColor(datum.statusId) },
          labels: { fontSize: 14 },
        }}
      />
      <VictoryLabel
        text="Projetos por Diretoria"
        x={400}
        y={30}
        textAnchor="middle"
        style={{ fontSize: 14, fontWeight: "bold" }}
      />
    </VictoryChart>
  );
};

export default ProjectsByDepartmentChart;
