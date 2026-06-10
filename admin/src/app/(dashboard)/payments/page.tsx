import { cookies } from "next/headers";
import { Payment, columns } from "./columns";
import { DataTable } from "./data-table";

const getOrders = async (): Promise<Payment[]> => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/orders?limit=50`,
      {
        headers: { Cookie: cookieStore.toString() },
        cache: "no-store",
      }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const orders = Array.isArray(data) ? data : (data.orders ?? []);
    return orders.map((o: {
      _id: string;
      user?: { _id: string; username: string; email: string };
      totalPrice: number;
      status: string;
    }) => ({
      id: o._id,
      amount: o.totalPrice,
      fullName: o.user?.username || "Unknown",
      userId: o.user?._id || "",
      email: o.user?.email || "",
      status: o.status as Payment["status"],
    }));
  } catch {
    return [];
  }
};

const PaymentsPage = async () => {
  const data = await getOrders();
  return (
    <div className="">
      <div className="mb-8 px-4 py-2 bg-secondary rounded-md">
        <h1 className="font-semibold">All Orders</h1>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default PaymentsPage;
