import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ItemData, ITEMS } from "@/data/items";
import { Plus } from "lucide-react";

interface AddItemDialogProps {
  onAddItem: (item: ItemData) => void;
}

export function AddItemDialog({ onAddItem }: AddItemDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("📦");
  const [unit, setUnit] = useState("Item");
  const [price2024, setPrice2024] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Generate mock history based on the "Grocery Basket" (general inflation) curve
    // We use grocery basket as it represents a good average of goods inflation
    const baseItem = ITEMS.find(i => i.id === "grocery") || ITEMS[0];
    const base2024 = baseItem.data[baseItem.data.length - 1].itemPriceUSD;
    const target2024 = parseFloat(price2024);
    
    // Calculate ratio to scale the historical data
    const ratio = target2024 / base2024;

    const newDataPoints = baseItem.data.map(d => ({
      ...d,
      itemPriceUSD: Number((d.itemPriceUSD * ratio).toFixed(2))
    }));

    const newItem: ItemData = {
      id: `custom-${Date.now()}`,
      name,
      description: "Custom added item (simulated history)",
      unit,
      emoji,
      data: newDataPoints
    };

    onAddItem(newItem);
    setOpen(false);
    
    // Reset form
    setName("");
    setPrice2024("");
    setUnit("Item");
    setEmoji("📦");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 h-12 px-6">
          <Plus className="h-4 w-4" />
          Add Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Custom Item</DialogTitle>
          <DialogDescription>
            Add a new item to compare. We'll simulate its historical price curve based on general inflation data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Gaming Laptop"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="emoji" className="text-right">
              Emoji
            </Label>
            <div className="col-span-3 flex gap-2 items-center">
                <Input
                id="emoji"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-16 text-center text-lg"
                maxLength={2}
                required
                />
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" size="icon" onClick={() => setEmoji("💻")}>💻</Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setEmoji("📱")}>📱</Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setEmoji("🎮")}>🎮</Button>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setEmoji("👟")}>👟</Button>
                </div>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unit" className="text-right">
              Unit
            </Label>
            <Input
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="col-span-3"
              placeholder="e.g. Unit, lb, gallon"
              required
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">
              2024 Price ($)
            </Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price2024}
              onChange={(e) => setPrice2024(e.target.value)}
              className="col-span-3"
              placeholder="100.00"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit">Create Item</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
