import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Criar o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar se há dados salvos no localStorage ao inicializar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error);
        // Limpar dados corrompidos
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  // Função para fazer login
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    fetchUserSubscription(userToken);
  };

  const fetchUserData = async (userToken) => {
    try {
      console.log("Verificando token...");
    } catch (error) {
      console.error("Token inválido:", error);
      logout();
    }
  };

  const fetchUserSubscription = async (userToken) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:3000/api/subscription/user/subscription",
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("✅ Resposta completa:", response);
      console.log("📋 Dados da resposta:", response.data);
      console.log("🎯 Subscription recebida:", response.data.subscription);

      setSubscription(response.data.subscription);
      console.log("subscription::", subscription);
    } catch (error) {
      console.error("Erro ao buscar subscription:", error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para fazer logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Função para verificar se o usuário está autenticado
  const isAuthenticated = () => {
    return !!(user && token);
  };

  // Função para atualizar dados do usuário
  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    subscription,
    logout,
    isAuthenticated,
    updateUser,
  };
  useEffect(() => {
    if (token && !user) {
      // Verificar se o token ainda é válido e buscar dados do usuário
      fetchUserData(token);
    }
  }, [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
