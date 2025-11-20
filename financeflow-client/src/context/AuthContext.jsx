import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("financeflow_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("financeflow_token") || null;
  });

  const [walletBalance, setWalletBalance] = useState(() => {
    const bal = localStorage.getItem("financeflow_balance");
    return bal ? Number(bal) : 0;
  });

  useEffect(() => {
    if (user) localStorage.setItem("financeflow_user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    if (token) localStorage.setItem("financeflow_token", token);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("financeflow_balance", walletBalance);
  }, [walletBalance]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setWalletBalance(0);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        setToken,
        walletBalance,
        setWalletBalance,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
