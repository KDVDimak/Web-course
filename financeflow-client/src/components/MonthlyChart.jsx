import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function MonthlyChart({ transactions }) {
  const months = [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ];

  const income = Array(12).fill(0);
  const expense = Array(12).fill(0);

  transactions.forEach((t) => {
    const d = new Date(t.createdAt);
    const month = d.getMonth();

    if (t.type === "income") income[month] += Number(t.amount);
    else expense[month] += Number(t.amount);
  });

  const data = {
    labels: months,
    datasets: [
      {
        label: "Доходы",
        data: income,
        borderColor: "rgb(80, 200, 120)",
        backgroundColor: "rgba(80, 200, 120, 0.3)",
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 4,
      },
      {
        label: "Расходы",
        data: expense,
        borderColor: "rgb(255, 90, 90)",
        backgroundColor: "rgba(255, 90, 90, 0.3)",
        borderWidth: 3,
        tension: 0.3,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "white", font: { size: 14 } },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255,255,255,0.1)" },
      },
    },
  };

  return (
    <div className="chart-block">
      <h2 className="chart-title">Помесячная статистика</h2>
      <Line data={data} options={options} />
    </div>
  );
}

export default MonthlyChart;
