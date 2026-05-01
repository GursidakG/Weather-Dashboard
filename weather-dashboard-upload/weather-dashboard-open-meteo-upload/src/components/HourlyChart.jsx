import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { formatHour } from "../utils/formatters";

export default function HourlyChart({ forecast, unit }) {
  const data =
    forecast?.hourly?.slice(0, 24).filter((_, index) => index % 3 === 0).map((entry) => ({
      time: formatHour(entry.time),
      temp: Math.round(entry.temperature),
      feels: Math.round(entry.feelslike ?? entry.temperature),
    })) || [];

  return (
    <section className="panel chart-panel fade-in">
      <div className="section-heading">
        <p className="eyebrow">Hourly outlook</p>
        <h2>Next 24 hours</h2>
      </div>

      <div className="chart-wrap">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 12, right: 10, bottom: 0, left: -18 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.10)" vertical={false} />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.72)", fontSize: 12 }}
              />
              <YAxis
                unit={unit === "metric" ? "°C" : "°F"}
                axisLine={false}
                tickLine={false}
                tick={{ fill: "rgba(255,255,255,0.72)", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  background: "rgba(8, 15, 28, 0.92)",
                  border: "1px solid rgba(255,255,255,0.14)",
                  borderRadius: "8px",
                  color: "#fff",
                }}
                labelStyle={{ color: "#cfe5ff" }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                name="Temperature"
                stroke="#ffd166"
                strokeWidth={3}
                dot={{ r: 4, fill: "#ffd166", stroke: "#111827", strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="feels"
                name="Feels like"
                stroke="#7dd3fc"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="empty-state">Hourly forecast data is unavailable right now.</p>
        )}
      </div>
    </section>
  );
}
