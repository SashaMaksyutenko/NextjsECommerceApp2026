"use client";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddCategory from "./AddCategory";

const AddCategorySheet = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button size="sm" className="flex items-center gap-1">
        <Plus className="w-4 h-4" /> Add Category
      </Button>
    </SheetTrigger>
    <AddCategory />
  </Sheet>
);

export default AddCategorySheet;
