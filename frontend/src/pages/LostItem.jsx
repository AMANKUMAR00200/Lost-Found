import MainLayout from "../layouts/MainLayout";
import AddItemForm from "../components/AddItemForm";

function LostItem() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <AddItemForm defaultType="lost" />
      </div>
    </MainLayout>
  );
}

export default LostItem;
