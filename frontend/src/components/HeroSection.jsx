import { useNavigate } from "react-router-dom";

function HeroSection({ user }) {
  const navigate = useNavigate();

  const goToReport = (type) => {
    navigate(`/dashboard?type=${type}`);

    setTimeout(() => {
      document.getElementById("report-item")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-3xl p-5 md:p-8 text-white shadow-lg mb-8">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div>
          <p className="text-green-100 text-lg">Welcome Back 👋</p>

          <h1 className="text-2xl md:text-4xl font-bold mt-2">
            {user?.name || "User"}
          </h1>

          <p className="mt-3 text-green-100">
            Help people recover their lost belongings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
          <button
            onClick={() => goToReport("lost")}
            className="bg-white text-green-700 px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            ➕ Report Lost
          </button>

          <button
            onClick={() => goToReport("found")}
            className="bg-green-900 text-white px-6 py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            📦 Report Found
          </button>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
