"use client"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

const chartConfig = {
  count: {
    label: "Orders",
    color: "var(--chart-2)",
  },
  successful: {
    label: "Delivered",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

type MonthlyRevenue = { month: string; total: number; successful: number; count?: number }

const AppAreaChart = ({ data }: { data?: MonthlyRevenue[] }) => {
  const chartData = data && data.length > 0 ? data : []

  return (
    <div className="">
      <h1 className="mb-6 text-lg font-medium">Orders Over Time</h1>
      <ChartContainer config={chartConfig} className="min-h-50 w-full">
        <AreaChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis tickLine={false} tickMargin={10} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <defs>
            <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-count)"      stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-count)"      stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="fillSuccessful" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="var(--color-successful)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-successful)" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <Area
            dataKey="count"
            type="natural"
            fill="url(#fillCount)"
            fillOpacity={0.4}
            stroke="var(--color-count)"
            stackId="a"
          />
          <Area
            dataKey="successful"
            type="natural"
            fill="url(#fillSuccessful)"
            fillOpacity={0.4}
            stroke="var(--color-successful)"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
export default AppAreaChart
