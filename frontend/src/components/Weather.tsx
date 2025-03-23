import { WiDaySunny, WiCloudy, WiRain, WiSnow } from "react-icons/wi";

interface WeatherProps {
  location: string;
  temperature: number;
  weather?: string;
  toolCallId: string;
}

export function Weather({
  location,
  temperature,
  weather = "Sunny",
  toolCallId,
}: WeatherProps) {
  const getWeatherIcon = () => {
    switch (weather.toLowerCase()) {
      case "sunny":
        return <WiDaySunny className="w-12 h-12 text-amber-400" />;
      case "cloudy":
        return <WiCloudy className="w-12 h-12 text-gray-400" />;
      case "rainy":
        return <WiRain className="w-12 h-12 text-blue-400" />;
      case "snow":
        return <WiSnow className="w-12 h-12 text-blue-200" />;
      default:
        return <WiDaySunny className="w-12 h-12 text-amber-400" />;
    }
  };

  return (
    <div
      key={toolCallId}
      className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg p-6 w-full max-w-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 capitalize">
            {location}
          </h2>
          <p className="text-gray-600 mt-1">Current Weather</p>
        </div>
        {getWeatherIcon()}
      </div>

      <div className="flex items-end">
        <div className="text-5xl font-bold text-gray-800">
          {temperature}
          <span className="text-3xl">°C</span>
        </div>
        <div className="ml-4 pb-2 text-gray-600 capitalize">{weather}</div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>Updated just now</span>
          <span>•</span>
          <span>Local time</span>
        </div>
      </div>
    </div>
  );
}
