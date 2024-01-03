import React, { useEffect, useState } from 'react';
import { VictoryPie } from 'victory';

const SalesOverview: React.FC = () => {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3001/db');
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getStatusColor = (statusId: number) => {
    const colorMap: Record<number, string> = {
      1: '#3498db', // Azul claro
      2: '#2c3e50', // Azul escuro
    };

    return colorMap[statusId] || '#000000';
  };

  const renderChart = (title: string, dataKey: string) => {
    const counts: Record<number, number> = {};
    data[dataKey].forEach((item: { statusId: number }) => {
      counts[item.statusId] = (counts[item.statusId] || 0) + 1;
    });

    const total = Object.values(counts).reduce((acc, count) => acc + count, 0);

    const dataPoints = Object.keys(counts).map((statusId) => ({
      x: statusId.toString(),
      y: counts[parseInt(statusId, 10)],
      label: counts[parseInt(statusId, 10)].toString(),
    }));

    return (
      <div key={title} style={{ display: 'inline-block', padding: '10px', borderRadius: '5px', textAlign: 'center' }}>
        <div>
          <text
            x="50%"
            y="15%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="20"
            fill="#000000"
            style={{ fontWeight: 'bold' }}
          >
            {title}
          </text>
          <VictoryPie
            data={dataPoints}
            colorScale={Object.keys(counts).map((statusId) =>
              getStatusColor(parseInt(statusId, 10))
            )}
            innerRadius={80}
            labelRadius={100}
            labels={({ datum }) => `${datum.label}`} 
            style={{ labels: { fill: 'white', fontSize: 20, fontWeight: 'bold' } }}
          />
        </div>
        <div>
          <text
            x="50%"
            y="75%"
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="18"
            fill="#000000"
            style={{ fontWeight: 'bold' }}
          >
            Total: {total}
          </text>
        </div>
      </div>
    );
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <text
        x="50%"
        y="10%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24"
        fill="#000000"
        style={{ fontWeight: 'bold' }}
      >
        Indicadores de Performance
      </text>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {renderChart('Objetivos', 'objetivos')}
        {renderChart('Projetos', 'projetos')}
        {renderChart('Etapas', 'etapas')}
      </div>
    </div>
  );
};

export default SalesOverview;
