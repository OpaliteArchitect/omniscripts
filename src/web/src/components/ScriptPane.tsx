import type { IssueScript, CategoryGroup } from "@/types/auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ScriptPaneProps {
  selectedIssue: IssueScript | null;
  selectedCategory: CategoryGroup | null;
}

export function ScriptPane({
  selectedIssue,
  selectedCategory,
}: ScriptPaneProps) {
  return (
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
  );
}
