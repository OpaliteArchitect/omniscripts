import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  onLogout: () => void;
}

export function DashboardHeader({ onLogout }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <h1 className="text-lg font-semibold">Support Scripts Dashboard</h1>
      <Button variant="outline" onClick={onLogout}>
        Sign Out
      </Button>
    </header>
  );
}
