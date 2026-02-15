import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'

interface OverviewProps {
    data: { name: string; total: number }[]
}

export function Overview({ data }: OverviewProps) {
    return (
        <ResponsiveContainer width='100%' height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey='name'
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke='#888888'
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                />
                <Tooltip
                    cursor={{ fill: 'var(--muted)', opacity: 0.1 }}
                    content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                            return (
                                <div className="rounded-lg border bg-background p-2 shadow-sm">
                                    <div className="flex flex-col">
                                        <span className="text-[0.70rem] text-muted-foreground">
                                            Cases
                                        </span>
                                        <span className="font-bold text-muted-foreground">
                                            {payload[0].value}
                                        </span>
                                    </div>
                                </div>
                            )
                        }
                        return null
                    }}
                />
                <Bar
                    dataKey='total'
                    fill='currentColor'
                    radius={[4, 4, 0, 0]}
                    className='fill-primary'
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
