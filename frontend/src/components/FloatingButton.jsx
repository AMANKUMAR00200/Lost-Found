import { Plus } from "lucide-react";

function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
      fixed
      bottom-5
      right-5
      md:bottom-8
      md:right-8

      w-14
      h-14
      md:w-16
      md:h-16

      rounded-full

      bg-green-600
      hover:bg-green-700

      text-white

      shadow-2xl

      flex
      items-center
      justify-center

      transition
      duration-300
      hover:scale-110
      z-50
      "
    >
      <Plus size={28} />
    </button>
  );
}

export default FloatingButton;