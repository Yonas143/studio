'use client'

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { category: 'Performing Arts', votes: 12503 },
  { category: 'Traditional Music', votes: 21890 },
  { category: 'Digital Arts', votes: 8450 },
  { category: 'Poetry', votes: 15230 },
];

const timeSeriesData = [
  { date: '01/09', votes: 21000 },
  { date: '05/09', votes: 55000 },
  { date: '10/09', votes: 110000 },
  { date: '15/09', votes: 250000 },
  { date: '20/09', votes: 480000 },
  { date: '25/09', votes: 800000 },
  { date: '30/09', votes: 1200000 },
];

const chartConfig = {
  votes: {
    label: 'Votes',
    color: 'hsl(var(--primary))',
  },
};

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into votes, participants, and engagement.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Votes by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Bar dataKey="votes" fill="var(--color-votes)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Votes Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <LineChart accessibilityLayer data={timeSeriesData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                 <YAxis />
                <Tooltip cursor={false} content={<ChartTooltipContent />} />
                <Line
                  dataKey="votes"
                  type="monotone"
                  stroke="var(--color-votes)"
                  strokeWidth={2}
                  dot={true}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
