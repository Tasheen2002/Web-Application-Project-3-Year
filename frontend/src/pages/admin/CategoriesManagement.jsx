import { useQuery, useMutation, useQueryClient } from "react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { adminAPI } from "../../services/api";

const CategoriesManagement = () => {
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");

  const { data: categories, isLoading } = useQuery(
    "adminCategories",
    () => adminAPI.getAllCategories(),
    {
      select: (res) => res.data.categories,
    }
  );

  const createCategoryMutation = useMutation(
    (name) => adminAPI.createCategory({ name }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("adminCategories");
        setNewCategory("");
        toast.success("Category created");
      },
      onError: (err) =>
        toast.error(err.response?.data?.message || "Error creating category"),
    }
  );

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    createCategoryMutation.mutate(newCategory.trim());
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <form onSubmit={handleCreate} className="flex gap-2 mb-6">
        <input
          className="input-field flex-1"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
        />
        <button
          className="btn-primary"
          type="submit"
          disabled={createCategoryMutation.isLoading}
        >
          {createCategoryMutation.isLoading ? "Adding..." : "Add"}
        </button>
      </form>
      <div>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul className="divide-y">
            {categories?.map((cat) => (
              <li key={cat._id} className="py-2">
                {cat.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CategoriesManagement;
