import { Box, Typography } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS } from 'chart.js/auto';

function ResultChart({
  question,
  chartOptions = {
    width: 300,
    height: 500,
    titleSize: 20,
    labelSize: 16,
  },
}) {
  const { answers, question: questionText } = question;
  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            size: chartOptions.labelSize,
          },
        },
      },
      x: {
        ticks: {
          font: {
            size: chartOptions.labelSize,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const labels = answers.map((data) => data.text);
  const values = answers.map((data) => data.total);
  const data = {
    labels: labels,
    datasets: [
      {
        data: values,
        backgroundColor: [
          '#1fabad',
          '#1f79ad',
          '#1f42ad',
          '#533eb0',
          '#8c3eb0',
        ],
        datalabels: {
          align: 'end',
          anchor: 'end',
          font: {
            size: 16,
          },
        },
      },
    ],
  };

  return (
    <Box p={2}>
      <Typography
        variant='h2'
        fontSize={chartOptions.titleSize}
        fontWeight={400}
        mb={3}
        px={2}
      >
        {questionText}
      </Typography>
      <Box>
        <Bar
          data={data}
          options={options}
          plugins={[ChartDataLabels]}
          width={chartOptions.width}
          height={chartOptions.height}
        />
      </Box>
    </Box>
  );
}

export default ResultChart;
