function StatsCard({
  title,
  value,
  icon,
  color,
  subtitle,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {value}
          </h2>

          <p className="text-sm mt-3 text-gray-400">
            {subtitle}
          </p>

        </div>

        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${color}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}

export default StatsCard;