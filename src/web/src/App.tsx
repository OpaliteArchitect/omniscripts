import { useState } from "react";
import { Login } from "./components/Login";
import { Button } from "@/components/ui/button";

export function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwt_token"),
  );

  const handleLoginSuccess = (newToken: string) => {
    localStorage.setItem("jwt_token", newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwt_token");
    setToken(null);
  };

  if (!token) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="p-8 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Scripts Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Sign Out
        </Button>
      </div>
      <p className="text-muted-foreground">
        Successfully authenticated with backend!
      </p>
    </div>
  );
}

export default App;
