import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function ChartBlock({ transactions }) {
  const incomes = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const data = {
    labels: ["Доходы", "Расходы"],
    datasets: [
      {
        data: [incomes, expenses],
        backgroundColor: ["#4CAF50", "#FF5252"], 
        borderColor: ["#2e7d32", "#d32f2f"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.07)",
        padding: "30px",
        borderRadius: "18px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.4)",
        marginTop: "30px"
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Диаграмма доходов/расходов</h2>
      <Pie data={data} />
    </div>
  );
}

export default ChartBlock;
