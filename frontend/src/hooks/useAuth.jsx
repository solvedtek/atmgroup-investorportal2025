import { useContext } from "react";
import AuthContext from "../contexts/AuthContext"; // Import the context

// Custom hook for easy consumption
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
