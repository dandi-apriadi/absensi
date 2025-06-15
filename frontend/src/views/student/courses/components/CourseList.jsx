import React from "react";
import { MdVisibility, MdSchedule, MdPeople } from "react-icons/md";

const CourseList = ({ courses }) => {
    return (
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-up">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Daftar Mata Kuliah</h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Kode</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Mata Kuliah</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Dosen</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">SKS</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Jadwal</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-700">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course, index) => (
                            <tr
                                key={course.id}
                                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                <td className="py-4 px-4">
                                    <span className="font-medium text-gray-900">{course.code}</span>
                                </td>
                                <td className="py-4 px-4">
                                    <div>
                                        <p className="font-medium text-gray-900">{course.course}</p>
                                        <p className="text-sm text-gray-600">{course.room}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="text-gray-700">{course.lecturer}</span>
                                </td>
                                <td className="py-4 px-4">
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                                        {course.credits} SKS
                                    </span>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="text-sm">
                                        <p className="font-medium text-gray-900">{course.day}</p>
                                        <p className="text-gray-600">{course.time}</p>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-colors flex items-center">
                                        <MdVisibility className="h-4 w-4 mr-1" />
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseList;
