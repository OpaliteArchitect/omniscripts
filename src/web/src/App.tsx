import { useState } from "react";
import { Button } from "./components/ui/button";

function App() {
  const [scripts, setScripts] = useState("");

  async function getScripts() {
    const url = "/api/scripts";

    const response = await fetch(url);
    if (response.ok) {
      const text = await response.text();
      setScripts(text);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button variant="ghost" onClick={getScripts}>
        Click Me
      </Button>
      <pre>{scripts}</pre>
    </div>
  );
}

export default App;
