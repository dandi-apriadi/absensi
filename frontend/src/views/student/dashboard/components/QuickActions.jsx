import React from "react";
import { MdQrCode, MdFace, MdLocalHospital, MdFileDownload } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
    const navigate = useNavigate();

    const actions = [
        {
            title: "Generate QR Code",
            subtitle: "Absensi Manual",
            icon: MdQrCode,
            color: "from-blue-500 to-blue-600",
            path: "/student/qr-code"
        },
        {
            title: "Registrasi Wajah",
            subtitle: "Update Dataset",
            icon: MdFace,
            color: "from-purple-500 to-purple-600",
            path: "/student/face-registration"
        },
        {
            title: "Ajukan Izin",
            subtitle: "Sakit/Izin",
            icon: MdLocalHospital,
            color: "from-red-500 to-red-600",
            path: "/student/leave-requests"
        },
        {
            title: "Download Laporan",
            subtitle: "Kehadiran",
            icon: MdFileDownload,
            color: "from-green-500 to-green-600",
            path: "/student/my-attendance/attendance-report"
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-lg p-6" data-aos="fade-left" data-aos-delay="200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Aksi Cepat</h3>
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(action.path)}
                        className="w-full p-4 rounded-xl bg-gradient-to-r hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                        style={{
                            background: `linear-gradient(135deg, ${action.color.split(' ')[0].replace('from-', '#')} 0%, ${action.color.split(' ')[1].replace('to-', '#')} 100%)`
                        }}
                    >
                        <div className="flex items-center text-white">
                            <action.icon className="h-8 w-8 mr-4 group-hover:scale-110 transition-transform" />
                            <div className="text-left">
                                <p className="font-semibold">{action.title}</p>
                                <p className="text-sm opacity-90">{action.subtitle}</p>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;
