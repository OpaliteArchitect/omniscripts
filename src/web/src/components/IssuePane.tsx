import type { IssueScript } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface IssuePaneProps {
  issues: IssueScript[];
  selectedIssue: IssueScript | null;
  onSelectIssue: (issue: IssueScript) => void;
}

export function IssuePane({
  issues,
  selectedIssue,
  onSelectIssue,
}: IssuePaneProps) {
  return (
    <div className="w-1/4 border-r flex flex-col">
      <div className="p-4 font-semibold border-b">Issues</div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {issues.map((item) => {
            const isSelected = selectedIssue?.issue === item.issue;
            return (
              <Button
                key={item.issue}
                variant={isSelected ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectIssue(item)}
              >
                {item.issue}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
