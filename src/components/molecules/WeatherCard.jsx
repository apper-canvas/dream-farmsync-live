import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";

const WeatherCard = ({ data }) => {
  const getWeatherIcon = (condition) => {
    const iconMap = {
      sunny: "Sun",
      cloudy: "Cloud",
      rainy: "CloudRain",
      snowy: "Snowflake",
      stormy: "Zap"
    };
    return iconMap[condition] || "Sun";
  };

  const getWeatherGradient = (condition) => {
    const gradientMap = {
      sunny: "from-yellow-400 to-orange-500",
      cloudy: "from-gray-400 to-gray-600",
      rainy: "from-blue-400 to-blue-600",
      snowy: "from-blue-200 to-blue-400",
      stormy: "from-purple-500 to-indigo-600"
    };
    return gradientMap[condition] || "from-yellow-400 to-orange-500";
  };

  if (!data || !data.current) {
    return (
      <Card>
        <div className="text-center py-8">
          <ApperIcon name="CloudOff" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Weather data unavailable</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-display font-semibold text-gray-900">
              Current Weather
            </h3>
            <p className="text-sm text-gray-600">{data.location}</p>
          </div>
          
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getWeatherGradient(data.current.condition)} flex items-center justify-center`}>
            <ApperIcon name={getWeatherIcon(data.current.condition)} className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-3xl font-display font-bold text-gray-900">
            {data.current.temperature}°F
          </div>
          <div className="text-sm text-gray-600">
            <div>Feels like {data.current.feelsLike}°F</div>
            <div>Humidity {data.current.humidity}%</div>
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-6">
          {data.forecast.map((day, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-2 rounded-lg bg-gray-50"
            >
              <div className="text-xs text-gray-600 mb-2">{day.day}</div>
              <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${getWeatherGradient(day.condition)} flex items-center justify-center mx-auto mb-2`}>
                <ApperIcon name={getWeatherIcon(day.condition)} className="w-3 h-3 text-white" />
              </div>
              <div className="text-sm font-semibold text-gray-900">{day.high}°</div>
              <div className="text-xs text-gray-600">{day.low}°</div>
            </motion.div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;