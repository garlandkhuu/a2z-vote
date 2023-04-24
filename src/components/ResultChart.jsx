
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
            legend: {
                display: false
            }
        }
    }

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
    <Box p={2}>
        <Typography variant="h2" fontSize={18} fontWeight={400} mb={5} px={2}>{questionText}</Typography>
        <Box>
            <Bar data={data} options={options} plugins={[ChartDataLabels]} width={300} height={500} />
        </Box>
    </Box>
  );
}

export default ResultChart;
