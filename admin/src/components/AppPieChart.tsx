"use client"

import { Label, Pie, PieChart } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./ui/chart"

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--chart-1)",
  processing: "var(--chart-2)",
  shipped: "var(--chart-3)",
  delivered: "var(--chart-4)",
  cancelled: "var(--chart-5)",
}

const STATUS_DOT_CLASS: Record<string, string> = {
  pending: "bg-yellow-400",
  processing: "bg-blue-400",
  shipped: "bg-purple-400",
  delivered: "bg-green-400",
  cancelled: "bg-red-400",
}

type OrderStatus = { status: string; count: number }

const AppPieChart = ({ data }: { data?: OrderStatus[] }) => {
  const chartData = (data && data.length > 0 ? data : []).map((d) => ({
    status: d.status,
    count: d.count,
    fill: STATUS_COLORS[d.status] || "var(--chart-1)",
  }))

  const chartConfig: ChartConfig = {
    count: { label: "Orders" },
    ...Object.fromEntries(
      Object.entries(STATUS_COLORS).map(([k, color]) => [
        k,
        { label: k.charAt(0).toUpperCase() + k.slice(1), color },
      ])
    ),
  }

  const totalOrders = chartData.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="">
      <h1 className="mb-6 text-lg font-medium">Orders by Status</h1>
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
      >
        <PieChart>
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="status"
            innerRadius={60}
            strokeWidth={5}
          >
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-3xl font-bold"
                      >
                        {totalOrders.toLocaleString()}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy || 0) + 24}
                        className="fill-muted-foreground"
                      >
                        Orders
                      </tspan>
                    </text>
                  )
                }
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="mt-4 flex flex-col gap-2 items-center">
        {chartData.map((d) => (
          <div key={d.status} className="flex items-center gap-2 text-sm">
            <span className={`w-3 h-3 rounded-full ${STATUS_DOT_CLASS[d.status] ?? "bg-gray-400"}`} />
            <span className="capitalize">{d.status}</span>
            <span className="text-muted-foreground">({d.count})</span>
          </div>
        ))}
      </div>
    </div>
  )
}
export default AppPieChart
