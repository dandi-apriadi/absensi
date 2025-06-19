import React, { useState } from "react";
import {
    MdSchedule,
    MdRoom,
    MdPerson,
    MdAccessTime,
    MdCode,
    MdSchool,
    MdViewList,
    MdViewModule
} from "react-icons/md";

const CourseList = ({ courses }) => {
    const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
    const [sortBy, setSortBy] = useState('day');
    const [sortOrder, setSortOrder] = useState('asc');

    // Sort courses based on selected criteria
    const sortedCourses = [...courses].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];

        // Special handling for day sorting
        if (sortBy === 'day') {
            const dayOrder = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];
            aValue = dayOrder.indexOf(a.day);
            bValue = dayOrder.indexOf(b.day);
        }

        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const getColorClasses = (color) => {
        const colors = {
            blue: 'bg-blue-100 text-blue-800 border-blue-200',
            green: 'bg-green-100 text-green-800 border-green-200',
            purple: 'bg-purple-100 text-purple-800 border-purple-200',
            red: 'bg-red-100 text-red-800 border-red-200',
            yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
        return colors[color] || colors.blue;
    };

    const getSortIcon = (field) => {
        if (sortBy !== field) return '↕️';
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        Daftar Mata Kuliah
                    </h2>
                    <p className="text-gray-600">
                        Total {courses.length} mata kuliah semester ini
                    </p>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'table'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <MdViewList className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-all duration-200 ${viewMode === 'grid'
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-800'
                                }`}
                        >
                            <MdViewModule className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th
                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('code')}
                                >
                                    Kode {getSortIcon('code')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('course')}
                                >
                                    Mata Kuliah {getSortIcon('course')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('day')}
                                >
                                    Hari {getSortIcon('day')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('time')}
                                >
                                    Waktu {getSortIcon('time')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('lecturer')}
                                >
                                    Dosen {getSortIcon('lecturer')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('room')}
                                >
                                    Ruangan {getSortIcon('room')}
                                </th>
                                <th
                                    className="text-left py-3 px-4 font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                                    onClick={() => handleSort('credits')}
                                >
                                    SKS {getSortIcon('credits')}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCourses.map((course, index) => (
                                <tr
                                    key={course.id}
                                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                                >
                                    <td className="py-4 px-4">
                                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorClasses(course.color)}`}>
                                            {course.code}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="font-medium text-gray-800">
                                            {course.course}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="text-gray-600">{course.day}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center text-gray-600">
                                            <MdAccessTime className="h-4 w-4 mr-1" />
                                            {course.time}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center text-gray-600">
                                            <MdPerson className="h-4 w-4 mr-1" />
                                            {course.lecturer}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center text-gray-600">
                                            <MdRoom className="h-4 w-4 mr-1" />
                                            {course.room}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-md text-xs font-medium">
                                            {course.credits} SKS
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedCourses.map((course, index) => (
                        <div
                            key={course.id}
                            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getColorClasses(course.color)}`}>
                                    {course.code}
                                </span>
                                <span className="text-xs text-gray-500">{course.day}</span>
                            </div>

                            <h3 className="font-semibold text-gray-800 mb-2">
                                {course.course}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <MdAccessTime className="h-4 w-4 mr-2" />
                                    {course.time}
                                </div>
                                <div className="flex items-center">
                                    <MdRoom className="h-4 w-4 mr-2" />
                                    {course.room}
                                </div>
                                <div className="flex items-center">
                                    <MdPerson className="h-4 w-4 mr-2" />
                                    {course.lecturer}
                                </div>
                                <div className="flex items-center">
                                    <MdSchool className="h-4 w-4 mr-2" />
                                    {course.credits} SKS
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Summary Stats */}
            <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {courses.length}
                        </div>
                        <div className="text-sm text-gray-600">Total Mata Kuliah</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {courses.reduce((sum, course) => sum + course.credits, 0)}
                        </div>
                        <div className="text-sm text-gray-600">Total SKS</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">
                            {new Set(courses.map(course => course.day)).size}
                        </div>
                        <div className="text-sm text-gray-600">Hari Kuliah</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {new Set(courses.map(course => course.lecturer)).size}
                        </div>
                        <div className="text-sm text-gray-600">Dosen</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseList;
