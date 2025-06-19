import React from "react";
import Card from "components/card";
import {
    MdSearch,
    MdFilter,
    MdTimer,
    MdCheckCircle,
    MdWarning,
    MdSort,
} from "react-icons/md";

const FilterSection = ({
    searchTerm,
    setSearchTerm,
    activeFilter,
    setActiveFilter,
    sortBy,
    setSortBy
}) => {
    const filterOptions = [
        { key: "all", label: "Semua", icon: MdFilter },
        { key: "active", label: "Aktif", icon: MdTimer },
        { key: "excellent", label: "Excellent", icon: MdCheckCircle },
        { key: "attention", label: "Perhatian", icon: MdWarning }
    ];

    const sortOptions = [
        { value: "name", label: "Urutkan: Nama" },
        { value: "attendance", label: "Urutkan: Kehadiran" },
        { value: "students", label: "Urutkan: Jumlah Mahasiswa" }
    ];

    return (
        <div className="mb-6" data-aos="fade-up">
            <Card extra="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search Bar */}
                    <div className="flex-1">
                        <div className="relative">
                            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Cari mata kuliah..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {filterOptions.map(filter => {
                            const IconComponent = filter.icon;
                            return (
                                <button
                                    key={filter.key}
                                    onClick={() => setActiveFilter(filter.key)}
                                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.key
                                            ? "bg-indigo-100 text-indigo-700"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <IconComponent className="mr-1 h-4 w-4" />
                                    {filter.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                        <select
                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <MdSort className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default FilterSection;
