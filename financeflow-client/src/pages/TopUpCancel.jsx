import { useNavigate } from "react-router-dom";

export default function TopUpCancel() {
  const navigate = useNavigate();

  return (
    <div className="cancel-page">
      <div className="cancel-box">
        <div className="cancel-icon">⚠️</div>
        <h2>Платёж отменён</h2>
        <p>Вы можете попробовать снова в любой момент.</p>

        <button className="cancel-btn" onClick={() => navigate("/topup")}>
          Попробовать снова
        </button>
      </div>
    </div>
  );
}
