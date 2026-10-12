import { useState, useEffect } from "react";
import { fetchScripts } from "@/lib/api";
import type { ScriptsDto, CategoryGroup, IssueScript } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "./DashboardHeader";
import { CategoryPane } from "./CategoryPane";
import { IssuePane } from "./IssuePane";
import { ScriptPane } from "./ScriptPane";

interface DashboardProps {
  token: string;
  onLogout: () => void;
}

export function Dashboard({ token, onLogout }: DashboardProps) {
  const [data, setData] = useState<ScriptsDto | null>(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryGroup | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<IssueScript | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadScripts() {
      try {
        const result = await fetchScripts(token);
        setData(result);
        if (result.categories.length > 0) {
          setSelectedCategory(result.categories[0]);
          if (result.categories[0].items.length > 0) {
            setSelectedIssue(result.categories[0].items[0]);
          }
        }
      } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message || "Failed to load scripts.");
          } else {
            setError("Failed to load scripts.");
          }
      } finally {
        setIsLoading(false);
      }
    }

    loadScripts();
  }, [token]);

  const handleSelectCategory = (category: CategoryGroup) => {
    setSelectedCategory(category);
    setSelectedIssue(category.items.length > 0 ? category.items[0] : null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading scripts...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-medium">{error}</p>
        <Button onClick={onLogout}>Sign Out</Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <DashboardHeader onLogout={onLogout} />
      <div className="flex flex-1 overflow-hidden">
        <CategoryPane
          categories={data?.categories ?? []}
          selectedCategory={selectedCategory}
          onSelectCategory={handleSelectCategory}
        />
        <IssuePane
          issues={selectedCategory?.items ?? []}
          selectedIssue={selectedIssue}
          onSelectIssue={setSelectedIssue}
        />
        <ScriptPane
          selectedIssue={selectedIssue}
          selectedCategory={selectedCategory}
        />
      </div>
    </div>
  );
}
