import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const CancelSubscriptionButton = ({ subscriptionId, userId }) => {
  console.log("Props recebidos:", { subscriptionId, userId });
  const [loading, setLoading] = useState(false);
  const [canceled, setCanceled] = useState(false);
  const { token } = useAuth();

  const handleCancel = async () => {
    if (!confirm("Tem certeza que deseja cancelar sua assinatura?")) {
      return;
    }
    if (!token) {
      alert("Você precisa estar logado para cancelar a assinatura");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:3000/api/subscription/cancel-subscription",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            subscriptionId,
            userId,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setCanceled(true);
        alert("Assinatura cancelada com sucesso!");
        // Opcional: redirecionar ou atualizar estado da página
        window.location.reload();
      } else {
        alert(data.error || "Erro ao cancelar assinatura");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (canceled) {
    return <p>Assinatura cancelada ✓</p>;
  }

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      style={{
        backgroundColor: "#dc3545",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "4px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Cancelando..." : "Cancelar Assinatura"}
    </button>
  );
};

export default CancelSubscriptionButton;
