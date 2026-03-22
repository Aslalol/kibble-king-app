import { DailyConsumption } from '@/lib/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, Cell } from 'recharts';

interface ConsumptionChartProps {
  data: DailyConsumption[];
}

export function ConsumptionChart({ data }: ConsumptionChartProps) {
  const avg = Math.round(data.reduce((s, d) => s + d.served, 0) / data.length);
  const avgRec = data[0]?.recommended ?? 0;
  const totalServed = data.reduce((s, d) => s + d.served, 0);
  const totalRec = data.reduce((s, d) => s + d.recommended, 0);
  const diffPercent = totalRec > 0 ? Math.round(((totalServed - totalRec) / totalRec) * 100) : 0;

  // Outlier: > 10% deviation from recommended
  const isOutlier = (d: DailyConsumption) => Math.abs(d.served - d.recommended) / d.recommended > 0.1;

  const insight =
    diffPercent < -5
      ? `⚠️ Consumo ${Math.abs(diffPercent)}% abaixo do recomendado esta semana`
      : diffPercent > 5
      ? `📈 Consumo ${diffPercent}% acima do recomendado esta semana`
      : `✅ Consumo dentro do esperado esta semana`;

  return (
    <div className="rounded-xl bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold text-foreground">Consumo Semanal (g)</h3>
        <span className="text-xs font-medium text-muted-foreground tabular-nums">Média: {avg}g</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{insight}</p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(120 10% 88%)" />
            <XAxis dataKey="date" tick={{ fontSize: 12, fill: 'hsl(120 5% 46%)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'hsl(120 5% 46%)' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '0.75rem',
                border: '1px solid hsl(120 10% 88%)',
                backgroundColor: 'hsl(120 12% 99%)',
                fontSize: '0.875rem',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
            <ReferenceLine y={avgRec} stroke="hsl(122 39% 49%)" strokeDasharray="5 5" strokeOpacity={0.5} label={{ value: 'Meta', position: 'right', fontSize: 10, fill: 'hsl(120 5% 46%)' }} />
            <Bar dataKey="recommended" name="Recomendado" fill="hsl(122 39% 49%)" radius={[4, 4, 0, 0]} opacity={0.25} />
            <Bar dataKey="served" name="Servido" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={isOutlier(entry) ? 'hsl(36 70% 52%)' : 'hsl(122 39% 49%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
