import { useState } from "react";
import { X } from "lucide-react";

function GifImage({ url, alt }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="w-full h-32 overflow-hidden bg-[#363636] rounded-lg relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          Loading...
        </div>
      )}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center text-red-500">
          Error
        </div>
      )}
      <img
        src={url}
        alt={alt}
        className={`w-full h-full object-cover ${isLoading ? "hidden" : ""}`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

export default function GifList({ gifs, userRole, onDeleteGif }) {
  return (
    <div className="bg-[#292929] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-100">GIF List</h2>
      {Object.entries(gifs).map(([category, urls]) => (
        <div key={category} className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-300">
            {category}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {urls.map((url, index) => (
              <div key={`${category}-${index}`} className="relative">
                <GifImage url={url} alt={`GIF ${index + 1} in ${category}`} />
                {userRole === "admin" && (
                  <button
                    className="absolute top-1 right-1 bg-red-900 text-gray-200 rounded-full p-1 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-opacity-50"
                    onClick={() => onDeleteGif(category, url)}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
