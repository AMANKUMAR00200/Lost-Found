import { Search } from "lucide-react";

function SearchFilter({
  search,
  setSearch,
  type,
  setType,
  sort,
  setSort,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-5 mb-6">

      <div className="grid md:grid-cols-4 gap-4">

        {/* Search */}

        <div className="relative">

          <Search
            className="absolute left-3 top-3 text-gray-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search Item..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border rounded-xl py-3 pl-10 pr-4"
          />

        </div>

        {/* Lost / Found */}

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option value="">All Items</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>

        {/* Sort */}

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
        </select>

        <button
          onClick={() => {
            setSearch("");
            setType("");
            setSort("newest");
          }}
          className="bg-red-500 text-white rounded-xl"
        >
          Clear
        </button>

      </div>

    </div>
  );
}

export default SearchFilter;