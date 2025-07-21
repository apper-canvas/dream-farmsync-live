import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";

import Header from "@/components/organisms/Header";
import WeatherCard from "@/components/molecules/WeatherCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";

import { useWeather } from "@/hooks/useWeather";

const Weather = () => {
  const { onMenuClick } = useOutletContext();
  const { weather, loading, error } = useWeather();

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  const getWeatherAdvice = (weather) => {
    if (!weather?.current) return [];
    
    const advice = [];
    const temp = weather.current.temperature;
    const condition = weather.current.condition;
    const humidity = weather.current.humidity;

    if (temp > 85) {
      advice.push({
        type: "warning",
        icon: "Thermometer",
        title: "High Temperature Alert",
        message: "Consider increasing irrigation frequency and providing shade for sensitive crops."
      });
    }

    if (temp < 40) {
      advice.push({
        type: "danger",
        icon: "Snowflake",
        title: "Frost Warning",
        message: "Protect vulnerable plants from frost damage. Consider covering crops overnight."
      });
    }

    if (condition === "rainy") {
      advice.push({
        type: "info",
        icon: "CloudRain",
        title: "Rain Expected",
        message: "Good time to reduce irrigation. Check for proper drainage in low-lying areas."
      });
    }

    if (humidity > 80) {
      advice.push({
        type: "warning",
        icon: "Droplets",
        title: "High Humidity",
        message: "Monitor for fungal diseases. Ensure good air circulation around plants."
      });
    }

    if (condition === "sunny" && temp >= 70 && temp <= 80) {
      advice.push({
        type: "success",
        icon: "Sun",
        title: "Perfect Growing Conditions",
        message: "Ideal weather for most agricultural activities. Great time for fieldwork!"
      });
    }

    return advice;
  };

  const getTaskRecommendations = (weather) => {
    if (!weather?.forecast) return [];

    const recommendations = [];
    const forecast = weather.forecast.slice(0, 3);

    forecast.forEach((day, index) => {
      if (day.condition === "sunny" && day.high >= 65) {
        recommendations.push({
          day: day.day,
          task: "Ideal for harvesting",
          reason: "Clear skies and good temperatures"
        });
      }

      if (day.condition === "rainy") {
        recommendations.push({
          day: day.day,
          task: "Indoor maintenance tasks",
          reason: "Expected rainfall - avoid outdoor work"
        });
      }

      if (day.condition === "cloudy" && day.precipitation < 30) {
        recommendations.push({
          day: day.day,
          task: "Good for planting",
          reason: "Mild conditions with low rain chance"
        });
      }
    });

    return recommendations;
  };

  const advice = getWeatherAdvice(weather);
  const recommendations = getTaskRecommendations(weather);

  const getAdviceColor = (type) => {
    switch (type) {
      case "success": return "border-green-200 bg-green-50 text-green-800";
      case "warning": return "border-yellow-200 bg-yellow-50 text-yellow-800";
      case "danger": return "border-red-200 bg-red-50 text-red-800";
      case "info": return "border-blue-200 bg-blue-50 text-blue-800";
      default: return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        title="Weather Information" 
        subtitle="Current conditions and forecasts for your farming area"
        onMenuClick={onMenuClick}
        showMenu
      />
      
      <div className="p-6 space-y-8">
        {/* Current Weather */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <WeatherCard data={weather} />
          </div>

          {/* Weather Stats */}
          <Card>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
              Today's Details
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Thermometer" className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="text-sm text-blue-700">Temperature</div>
                    <div className="text-lg font-bold text-blue-900">
                      {weather?.current?.temperature}°F
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-teal-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Droplets" className="w-6 h-6 text-teal-600" />
                  <div>
                    <div className="text-sm text-teal-700">Humidity</div>
                    <div className="text-lg font-bold text-teal-900">
                      {weather?.current?.humidity}%
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Eye" className="w-6 h-6 text-orange-600" />
                  <div>
                    <div className="text-sm text-orange-700">Feels Like</div>
                    <div className="text-lg font-bold text-orange-900">
                      {weather?.current?.feelsLike}°F
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Cloud" className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="text-sm text-green-700">Condition</div>
                    <div className="text-lg font-bold text-green-900 capitalize">
                      {weather?.current?.condition}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Weather Advice */}
        {advice.length > 0 && (
          <Card>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
              Agricultural Recommendations
            </h2>
            
            <div className="space-y-4">
              {advice.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${getAdviceColor(item.type)}`}
                >
                  <div className="flex items-start space-x-3">
                    <ApperIcon name={item.icon} className="w-6 h-6 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm">{item.message}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}

        {/* Task Recommendations */}
        {recommendations.length > 0 && (
          <Card>
            <h2 className="text-xl font-display font-bold text-gray-900 mb-6">
              Recommended Tasks by Day
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="font-semibold text-gray-900 mb-2">
                    {rec.day}
                  </div>
                  <div className="text-primary-600 font-medium mb-1">
                    {rec.task}
                  </div>
                  <div className="text-sm text-gray-600">
                    {rec.reason}
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Weather;