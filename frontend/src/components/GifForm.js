import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

export default function GifForm({ onAddGif, categories, userRole }) {
  const [urls, setUrls] = useState([""]);
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  useEffect(() => {
    if (categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories]);

  const handleUrlChange = (index, value) => {
    const newUrls = [...urls];
    newUrls[index] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    setUrls([...urls, ""]);
  };

  const removeUrlField = (index) => {
    const newUrls = urls.filter((_, i) => i !== index);
    setUrls(newUrls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalCategory = category === "custom" ? customCategory : category;
    const urlList = urls.filter((url) => url.trim() !== "");

    if (urlList.length === 0) {
      alert("Please enter at least one valid URL.");
      return;
    }

    await onAddGif({ urls: urlList, category: finalCategory });
    setUrls([""]);
    setCustomCategory("");
    if (categories.length > 0) {
      setCategory(categories[0]);
    } else {
      setCategory("");
    }
  };

  return (
    <div className="relative">
      {userRole === "user" && (
        <div className="absolute inset-0 bg-black bg-opacity-20 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-10">
          <div className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-full transform -rotate-12">
            Coming Soon
          </div>
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-[#292929] p-6 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            GIF URLs
          </label>
          {urls.map((url, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(index, e.target.value)}
                placeholder="Enter GIF URL"
                className="flex-grow px-3 py-2 bg-[#363636] border border-[#1c1c1c] rounded-l-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                required
              />
              {urls.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeUrlField(index)}
                  className="px-3 py-2 bg-red-900 text-gray-200 rounded-r-md hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addUrlField}
            className="mt-2 px-3 py-2 bg-[#363636] text-gray-200 rounded-md hover:bg-[#292929] focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50 flex items-center"
          >
            <Plus size={18} className="mr-1" /> Add URL
          </button>
        </div>
        <div className="mb-4">
          <label
            htmlFor="category-select"
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Category
          </label>
          <select
            id="category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
            <option value="custom">Custom Category</option>
          </select>
        </div>
        {category === "custom" && (
          <div className="mb-4">
            <label
              htmlFor="custom-category"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Custom Category
            </label>
            <input
              id="custom-category"
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="Enter custom category"
              className="w-full px-3 py-2 bg-[#363636] border border-[#1c1c1c] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-[#363636] hover:bg-[#292929] text-gray-200 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out focus:ring-2 focus:ring-yellow-500"
        >
          Add GIFs
        </button>
      </form>
    </div>
  );
}
