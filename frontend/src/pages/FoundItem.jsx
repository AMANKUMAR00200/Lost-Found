import MainLayout from "../layouts/MainLayout";
import AddItemForm from "../components/AddItemForm";

function FoundItem() {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto py-8 px-4">
        <AddItemForm defaultType="found" />
      </div>
    </MainLayout>
  );
}

export default FoundItem;