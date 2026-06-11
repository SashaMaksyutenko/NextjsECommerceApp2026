"use client";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import EditUser from "./EditUser";

interface EditUserSheetProps {
  userId: string;
  defaultValues: { username: string; email: string; role: "user" | "admin" };
}

const EditUserSheet = ({ userId, defaultValues }: EditUserSheetProps) => (
  <Sheet>
    <SheetTrigger asChild>
      <Button size="sm">Edit User</Button>
    </SheetTrigger>
    <EditUser userId={userId} defaultValues={defaultValues} />
  </Sheet>
);

export default EditUserSheet;
