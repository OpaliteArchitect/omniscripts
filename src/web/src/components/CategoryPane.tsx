import type { CategoryGroup } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CategoryPaneProps {
  categories: CategoryGroup[];
  selectedCategory: CategoryGroup | null;
  onSelectCategory: (category: CategoryGroup) => void;
}

export function CategoryPane({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryPaneProps) {
  return (
    <div className="w-1/4 border-r flex flex-col">
      <div className="p-4 font-semibold border-b">Categories</div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory?.category === cat.category;
            return (
              <Button
                key={cat.category}
                variant={isSelected ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSelectCategory(cat)}
              >
                {cat.category}
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
