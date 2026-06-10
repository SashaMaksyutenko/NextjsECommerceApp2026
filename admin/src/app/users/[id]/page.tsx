import { cookies } from "next/headers";
import CardList from "@/components/CardList"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Progress } from "@/components/ui/progress"
import { BadgeCheck, Candy, Citrus, Shield } from "lucide-react"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import EditUser from "@/components/EditUser"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AppLineChart from "@/components/AppLineChart"

interface UserData {
  _id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
}

const getUser = async (id: string): Promise<UserData | null> => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
      headers: { Cookie: cookieStore.toString() },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
};

const SingleUserPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const user = await getUser(id);

  const displayName = user?.username || "Unknown User";
  const initials = displayName.slice(0, 2).toUpperCase();
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US")
    : "N/A";

  return (
    <div className="">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/users">Users</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{displayName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* CONTAINER */}
      <div className="mt-4 flex flex-col gap-8 xl:flex-row">
        {/* LEFT */}
        <div className="w-full space-y-6 xl:w-1/3">
          {/* USER BADGES */}
          <div className="rounded-lg bg-primary-foreground p-4">
            <h1 className="text-xl font-semibold">User Badges</h1>
            <div className="mt-4 flex gap-4">
              <HoverCard>
                <HoverCardTrigger>
                  <BadgeCheck size={36} className="rounded-full border border-blue-500/50 bg-blue-500/30 p-2" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="mb-2 font-bold">Verified User</h1>
                  <p className="text-sm text-muted-foreground">This user has been verified by the admin.</p>
                </HoverCardContent>
              </HoverCard>
              {user?.role === "admin" && (
                <HoverCard>
                  <HoverCardTrigger>
                    <Shield size={36} className="rounded-full border border-green-800/50 bg-green-800/30 p-2" />
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <h1 className="mb-2 font-bold">Admin</h1>
                    <p className="text-sm text-muted-foreground">Admin users have access to all features.</p>
                  </HoverCardContent>
                </HoverCard>
              )}
              <HoverCard>
                <HoverCardTrigger>
                  <Candy size={36} className="rounded-full border border-yellow-500/50 bg-yellow-500/30 p-2" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="mb-2 font-bold">Awarded</h1>
                  <p className="text-sm text-muted-foreground">This user has been awarded for their contributions.</p>
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger>
                  <Citrus size={36} className="rounded-full border border-orange-500/50 bg-orange-500/30 p-2" />
                </HoverCardTrigger>
                <HoverCardContent>
                  <h1 className="mb-2 font-bold">Popular</h1>
                  <p className="text-sm text-muted-foreground">This user has been popular in the community.</p>
                </HoverCardContent>
              </HoverCard>
            </div>
          </div>
          {/* USER CARD */}
          <div className="space-y-2 rounded-lg bg-primary-foreground p-4">
            <div className="flex items-center gap-2">
              <Avatar className="size-12">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold">{displayName}</h1>
                <Badge variant={user?.isActive ? "default" : "destructive"}>
                  {user?.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
          {/* INFORMATION */}
          <div className="rounded-lg bg-primary-foreground p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">User Information</h1>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Edit User</Button>
                </SheetTrigger>
                <EditUser />
              </Sheet>
            </div>
            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-2">
                <span className="font-bold">Username:</span>
                <span>{user?.username || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Email:</span>
                <span>{user?.email || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold">Role:</span>
                <span className="capitalize">{user?.role || "—"}</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">Joined on {joinedDate}</p>
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full space-y-6 xl:w-2/3">
          <div className="rounded-lg bg-primary-foreground p-4">
            <h1 className="text-xl font-semibold">User Activity</h1>
            <AppLineChart />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
