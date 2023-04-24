
import { useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Chart as ChartJS } from "chart.js/auto";

function ResultChart(question) {
    const { answers, question: questionText } = question?.question;
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: true,
                text: questionText
            },
            legend: {
                display: false
            }
        }
    }
    console.log(question);

    const labels = answers.map((data) => data.text);
    const values = answers.map((data) => data.total);
    const data = {
    labels: labels,
    datasets: [
        {
            data: values,
            backgroundColor: ["#1fabad", "#1f79ad", "#1f42ad", "#533eb0", "#8c3eb0"],
            datalabels: {
                align: 'end',
                anchor: 'end'
            }
        }
    ]
  }

  return (
    <Box p={5}>
        <Bar data={data} options={options} plugins={[ChartDataLabels]} width={300} height={600} />
    </Box>
  );
}

export default ResultChart;
