import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlusCircle } from "react-icons/fa";
import api from "../services/api";
import CameraCapture from "../components/CameraCapture";

function AddItemForm({
  refreshItems,
  defaultType = "lost",
}) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    type: "lost",
    title: "",
    description: "",
    location: "",
    image_url: "",
    lost_found_date: "",
    lost_found_time: "",
    contact_number: "",
    reward: "",
  });

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =======================
  // Image Handler
  // =======================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleCameraCapture = (file) => {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(form.contact_number)) {
      alert("Enter a valid 10-digit mobile number");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    if (form.lost_found_date > today) {
      alert("Future date is not allowed");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      let image_url = "";

     if (image) {

  console.log("Image State:", image);

  const formData = new FormData();

  formData.append("image", image);

  console.log("FormData Image:", formData.get("image"));

  console.log("Token:", token);

  const uploadRes = await api.post("/upload", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  console.log("Upload Response:", uploadRes.data);

  image_url = uploadRes.data.imageUrl;
}

      await api.post(
        "/items",
        {
          ...form,
          image_url,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(
        form.type === "lost"
          ? "Lost Item Reported Successfully"
          : "Found Item Reported Successfully",
      );

      setForm({
        type: defaultType,
        title: "",
        description: "",
        location: "",
        image_url: "",
        lost_found_date: "",
        lost_found_time: "",
        contact_number: "",
        reward: "",
      });

      setImage(null);
      setPreview("");

      if (refreshItems) {
        refreshItems();
      }

      setTimeout(() => {
        navigate("/home");
      }, 800);
    } catch (err) {
      console.log(err);
      console.log(err.response);
      console.log(err.response?.data);

      alert(JSON.stringify(err.response?.data));
    }
  };

  return (
    <div
      className="
    w-full
    max-w-5xl
    mx-auto
    bg-white
    rounded-3xl
    shadow-xl
    border
    border-gray-100
    overflow-hidden
    "
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <FaPlusCircle className="text-4xl" />
          Report Item
        </h2>

        <p className="mt-2 text-blue-100">
          Report a lost or found item to help others.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
  p-4
  sm:p-6
  md:p-8
  space-y-7
"
      >

        {/* ================= Image Upload ================= */}

        <div
          className="
rounded-3xl
border-2
border-dashed
border-blue-200
bg-blue-50
p-5
md:p-8
"
        >
          <h3 className="text-lg font-semibold mb-4">📷 Upload Item Image</h3>

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="
  w-full
  h-60
  md:h-80
  rounded-2xl
  object-cover
  shadow-lg
"
            />
          ) : (
            <div
              className="
h-60
md:h-80
rounded-2xl
border
border-dashed
bg-white
flex
items-center
justify-center
"
            >
              <span className="text-gray-400">No Image Selected</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Camera */}

            <CameraCapture onCapture={handleCameraCapture} />

            {/* Gallery */}

            <label className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl text-center cursor-pointer font-semibold">
              🖼 Gallery
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImage}
              />
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Item Name</label>

          <input
            name="title"
            placeholder="Example: iPhone 15, Wallet, Charger..."
            value={form.title}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 p-4 text-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold text-gray-700">Description</label>

          <textarea
            rows="5"
            name="description"
            placeholder="Describe color, brand, model, unique marks..."
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="font-semibold">Location</label>

          <input
            name="location"
            placeholder="Example: Library, Block A, Cafeteria..."
            value={form.location}
            onChange={handleChange}
            className="w-full rounded-2xl border border-gray-300 p-4 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="font-semibold">Date</label>

            <input
              type="date"
              name="lost_found_date"
              value={form.lost_found_date}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
              className="mt-2 w-full rounded-2xl border border-gray-300 p-4"
            />
          </div>

          <div>
            <label className="font-semibold">Time</label>

            <input
              type="time"
              name="lost_found_time"
              value={form.lost_found_time}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-gray-300 p-4"
            />
          </div>
        </div>

        <div>
          <label className="font-semibold">Mobile Number</label>

          <input
            type="tel"
            name="contact_number"
            placeholder="9876543210"
            value={form.contact_number}
            onChange={handleChange}
            maxLength={10}
            pattern="[6-9]{1}[0-9]{9}"
            className="mt-2 w-full rounded-2xl border border-gray-300 p-4 text-lg"
          />
        </div>

        {form.type === "lost" && (
          <div>
            <label className="font-semibold">Reward (Optional)</label>

            <input
              type="number"
              name="reward"
              placeholder="₹ 1000"
              value={form.reward}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-gray-300 p-4"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`

fixed
bottom-20
left-4
right-4

md:static

rounded-2xl

p-5

text-lg

font-bold

text-white

shadow-xl

transition-all

${
  loading
    ? "bg-gray-400"
    : form.type === "lost"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-600 hover:bg-green-700"
}

`}
        >
          {loading
            ? "⏳ Posting..."
            : form.type === "lost"
              ? "🔴 Report Lost Item"
              : "🟢 Report Found Item"}
        </button>
      </form>
    </div>
  );
}

export default AddItemForm;
