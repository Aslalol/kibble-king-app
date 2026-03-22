import { DailyConsumption } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ConsumptionChartProps {
  data: DailyConsumption[];
}

export function ConsumptionChart({ data }: ConsumptionChartProps) {
  return (
    <div className="rounded-xl bg-card p-5 shadow-sm">
      <h3 className="font-semibold text-foreground mb-4">Consumo Semanal (g)</h3>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 15% 89%)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(160 6% 50%)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(160 6% 50%)' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '0.75rem',
                border: '1px solid hsl(40 15% 89%)',
                backgroundColor: 'hsl(40 30% 99%)',
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
            <Bar dataKey="recommended" name="Recomendado" fill="hsl(152 35% 38%)" radius={[4, 4, 0, 0]} opacity={0.35} />
            <Bar dataKey="served" name="Servido" fill="hsl(152 35% 38%)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
