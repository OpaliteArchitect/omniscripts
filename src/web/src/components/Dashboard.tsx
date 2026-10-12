import { useState, useEffect } from "react";
import { fetchScripts } from "@/lib/api";
import type { ScriptsDto, CategoryGroup, IssueScript } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

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
          setError(err.message);
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
    // Automatically select the first issue in the new category
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
      {/* Top Bar with Sign Out */}
      <header className="flex h-16 items-center justify-between border-b px-6">
        <h1 className="text-lg font-semibold">Support Scripts Dashboard</h1>
        <Button variant="outline" onClick={onLogout}>
          Sign Out
        </Button>
      </header>

      {/* Three-Pane Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Pane 1: Categories */}
        <div className="w-1/4 border-r">
          <div className="p-4 font-semibold border-b">Categories</div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-2 space-y-1">
              {data?.categories.map((cat) => {
                const isSelected = selectedCategory?.category === cat.category;
                return (
                  <Button
                    key={cat.category}
                    variant={isSelected ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => handleSelectCategory(cat)}
                  >
                    {cat.category}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Pane 2: Issues */}
        <div className="w-1/4 border-r">
          <div className="p-4 font-semibold border-b">Issues</div>
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-2 space-y-1">
              {selectedCategory?.items.map((item) => {
                const isSelected = selectedIssue?.issue === item.issue;
                return (
                  <Button
                    key={item.issue}
                    variant={isSelected ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedIssue(item)}
                  >
                    {item.issue}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Pane 3: Script Content */}
        <div className="flex-1 flex flex-col bg-muted/10">
          <div className="p-4 font-semibold border-b">Script Content</div>
          <ScrollArea className="flex-1 p-6">
            {selectedIssue ? (
              <div className="space-y-4 max-w-2xl">
                <div>
                  <h2 className="text-xl font-bold">{selectedIssue.issue}</h2>
                  <p className="text-sm text-muted-foreground">
                    {selectedCategory?.category}
                  </p>
                </div>
                <Separator />
                <div className="whitespace-pre-wrap leading-relaxed rounded-lg border bg-background p-6 shadow-sm">
                  {selectedIssue.script}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                Select an issue to view the script.
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
