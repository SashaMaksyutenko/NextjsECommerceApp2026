import { cookies } from "next/headers";
import { User, columns } from "./columns";
import { DataTable } from "./data-table";

const getUsers = async (): Promise<User[]> => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/users?limit=50`,
      {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.users || []).map((u: {
      _id: string;
      username: string;
      email: string;
      isActive: boolean;
      avatar?: string;
    }) => ({
      id: u._id,
      avatar: u.avatar || "/users/default.png",
      fullName: u.username,
      email: u.email,
      status: u.isActive ? "active" : "inactive",
    }));
  } catch {
    return [];
  }
};

const UsersPage = async () => {
  const data = await getUsers();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Users</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default UsersPage;
