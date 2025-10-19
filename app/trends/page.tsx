import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchImagesWithAttribution } from "@/lib/data";
import {
  Calendar,
  Clock,
  Moon,
  Sun,
  Sunrise,
  Sunset,
  TrendingUp,
} from "lucide-react";

interface Attribution {
  species: string;
  confidence: number;
  model_version: string;
}

interface ImageData {
  id: string;
  taken_on: string;
  temperature: string;
  moon_phase: string | null;
  attributions: Attribution[];
}

export default async function TrendsPage() {
  const allImages = await fetchImagesWithAttribution();

  // Filter images with valid data
  const imagesWithData = allImages.filter(
    (img: ImageData) => img.attributions.length > 0 && img.taken_on
  );

  // Time of day analysis
  const hourCounts: Record<number, number> = {};
  const dayOfWeekCounts: Record<number, number> = {};
  const moonPhaseActivity: Record<string, number> = {};

  imagesWithData.forEach((img: ImageData) => {
    const date = new Date(img.taken_on);
    const hour = date.getHours();
    const dayOfWeek = date.getDay();

    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    dayOfWeekCounts[dayOfWeek] = (dayOfWeekCounts[dayOfWeek] || 0) + 1;

    if (img.moon_phase) {
      moonPhaseActivity[img.moon_phase] =
        (moonPhaseActivity[img.moon_phase] || 0) + 1;
    }
  });

  // Find peak times
  const peakHour = Object.entries(hourCounts).reduce(
    (max, [hour, count]) =>
      count > max.count ? { hour: parseInt(hour), count } : max,
    { hour: 0, count: 0 }
  );

  const peakDay = Object.entries(dayOfWeekCounts).reduce(
    (max, [day, count]) =>
      count > max.count ? { day: parseInt(day), count } : max,
    { day: 0, count: 0 }
  );

  // Time period breakdown
  const earlyMorning = Object.entries(hourCounts)
    .filter(([hour]) => parseInt(hour) >= 5 && parseInt(hour) < 9)
    .reduce((sum, [_, count]) => sum + count, 0);
  const midDay = Object.entries(hourCounts)
    .filter(([hour]) => parseInt(hour) >= 9 && parseInt(hour) < 17)
    .reduce((sum, [_, count]) => sum + count, 0);
  const evening = Object.entries(hourCounts)
    .filter(([hour]) => parseInt(hour) >= 17 && parseInt(hour) < 21)
    .reduce((sum, [_, count]) => sum + count, 0);
  const night = Object.entries(hourCounts)
    .filter(([hour]) => parseInt(hour) >= 21 || parseInt(hour) < 5)
    .reduce((sum, [_, count]) => sum + count, 0);

  const totalActivity = earlyMorning + midDay + evening + night;

  // Recent trends
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const last24h = imagesWithData.filter(
    (img: ImageData) => new Date(img.taken_on) > oneDayAgo
  ).length;
  const last7d = imagesWithData.filter(
    (img: ImageData) => new Date(img.taken_on) > oneWeekAgo
  ).length;
  const last30d = imagesWithData.filter(
    (img: ImageData) => new Date(img.taken_on) > oneMonthAgo
  ).length;

  // Day names
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Temperature trends
  const tempData = imagesWithData
    .filter(
      (img: ImageData) =>
        img.temperature !== null && img.temperature !== undefined
    )
    .map((img: ImageData) => parseFloat(img.temperature));
  const avgTemp =
    tempData.length > 0
      ? tempData.reduce((sum: number, t: number) => sum + t, 0) /
        tempData.length
      : null;
  const maxTemp = tempData.length > 0 ? Math.max(...tempData) : null;
  const minTemp = tempData.length > 0 ? Math.min(...tempData) : null;

  return (
    <div className="font-sans min-h-screen p-8 pb-20 gap-16 sm:px-20">
      <main className="flex flex-col gap-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            Activity Trends
          </h1>
          <p className="text-gray-600">
            Discover patterns in bird activity at your feeders
          </p>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Last 24 Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{last24h}</div>
              <p className="text-xs text-gray-500 mt-1">bird visits</p>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-gradient-to-br from-green-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Last 7 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{last7d}</div>
              <p className="text-xs text-gray-500 mt-1">bird visits</p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Last 30 Days
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">
                {last30d}
              </div>
              <p className="text-xs text-gray-500 mt-1">bird visits</p>
            </CardContent>
          </Card>
        </div>

        {/* Peak Activity Times */}
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
              ⭐ Peak Activity Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-700">
              Birds are most active around{" "}
              <span className="font-bold text-yellow-700">
                {peakHour.hour === 0
                  ? "12:00 AM"
                  : peakHour.hour < 12
                  ? `${peakHour.hour}:00 AM`
                  : peakHour.hour === 12
                  ? "12:00 PM"
                  : `${peakHour.hour - 12}:00 PM`}
              </span>{" "}
              with {peakHour.count} recorded visits
            </p>
            <p className="text-sm text-gray-700">
              The busiest day of the week is{" "}
              <span className="font-bold text-yellow-700">
                {dayNames[peakDay.day]}
              </span>{" "}
              with {peakDay.count} total visits
            </p>
          </CardContent>
        </Card>

        {/* Time of Day Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Activity by Time of Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex flex-col items-center p-6 rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50 to-white">
                <Sunrise className="h-8 w-8 text-orange-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  Early Morning
                </h3>
                <p className="text-xs text-gray-600 mb-2">5:00 AM - 9:00 AM</p>
                <div className="text-3xl font-bold text-orange-600">
                  {earlyMorning}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {totalActivity > 0
                    ? `${((earlyMorning / totalActivity) * 100).toFixed(0)}%`
                    : "0%"}
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-lg border border-yellow-200 bg-gradient-to-br from-yellow-50 to-white">
                <Sun className="h-8 w-8 text-yellow-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Midday</h3>
                <p className="text-xs text-gray-600 mb-2">9:00 AM - 5:00 PM</p>
                <div className="text-3xl font-bold text-yellow-600">
                  {midDay}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {totalActivity > 0
                    ? `${((midDay / totalActivity) * 100).toFixed(0)}%`
                    : "0%"}
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-white">
                <Sunset className="h-8 w-8 text-blue-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Evening</h3>
                <p className="text-xs text-gray-600 mb-2">5:00 PM - 9:00 PM</p>
                <div className="text-3xl font-bold text-blue-600">
                  {evening}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {totalActivity > 0
                    ? `${((evening / totalActivity) * 100).toFixed(0)}%`
                    : "0%"}
                </p>
              </div>

              <div className="flex flex-col items-center p-6 rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-white">
                <Moon className="h-8 w-8 text-purple-500 mb-3" />
                <h3 className="font-semibold text-gray-900 mb-1">Night</h3>
                <p className="text-xs text-gray-600 mb-2">9:00 PM - 5:00 AM</p>
                <div className="text-3xl font-bold text-purple-600">
                  {night}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {totalActivity > 0
                    ? `${((night / totalActivity) * 100).toFixed(0)}%`
                    : "0%"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Temperature Insights */}
        {avgTemp !== null && (
          <Card className="border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                🌡️ Temperature Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-gray-700">
                Average temperature during bird visits:{" "}
                <span className="font-bold text-orange-600">
                  {avgTemp.toFixed(1)}°F
                </span>
              </p>
              <p className="text-sm text-gray-700">
                Temperature range: {minTemp?.toFixed(1)}°F to{" "}
                {maxTemp?.toFixed(1)}°F
              </p>
            </CardContent>
          </Card>
        )}

        {/* Weekly Pattern */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Weekly Activity Pattern
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dayNames.map((day, index) => {
                const count = dayOfWeekCounts[index] || 0;
                const total = Object.values(dayOfWeekCounts).reduce(
                  (sum, c) => sum + c,
                  0
                );
                const percentage = total > 0 ? (count / total) * 100 : 0;

                return (
                  <div key={day} className="flex items-center gap-4">
                    <div className="w-24 text-sm font-medium text-gray-700">
                      {day}
                    </div>
                    <div className="flex-1">
                      <div className="h-8 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-end px-3"
                          style={{ width: `${percentage}%` }}
                        >
                          {percentage > 10 && (
                            <span className="text-xs font-semibold text-white">
                              {count}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="w-16 text-sm text-gray-600 text-right">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Moon Phase Activity */}
        {Object.keys(moonPhaseActivity).length > 0 && (
          <Card className="border-indigo-200 bg-gradient-to-r from-indigo-50 to-purple-50">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                🌙 Moon Phase Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(moonPhaseActivity)
                  .sort(([, a], [, b]) => b - a)
                  .map(([phase, count]) => (
                    <div
                      key={phase}
                      className="flex flex-col items-center p-4 rounded-lg bg-white border border-indigo-200"
                    >
                      <div className="text-2xl mb-2">🌙</div>
                      <div className="text-xs text-gray-600 mb-1 text-center">
                        {phase}
                      </div>
                      <div className="text-lg font-bold text-indigo-600">
                        {count}
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
