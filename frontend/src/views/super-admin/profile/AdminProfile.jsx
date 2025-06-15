import React, { useEffect, useState } from "react";
import { MdEdit, MdLock, MdSave, MdRefresh, MdHistory, MdSecurity, MdNotificationsActive, MdDevices, MdOutlineModeEdit, MdShield } from "react-icons/md";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminProfile = () => {
    const [editMode, setEditMode] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [currentTab, setCurrentTab] = useState("profile");
    const [profileImage, setProfileImage] = useState("/img/avatars/default.png");
    const [profileData, setProfileData] = useState({
        name: "John Doe",
        email: "admin@universitasteknologi.ac.id",
        role: "Super Admin",
        phone: "+62 812 3456 7890",
        department: "IT Department",
        lastLogin: "15 May 2025, 08:45",
        joinDate: "10 March 2022"
    });

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        });
    }, []);

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        setEditMode(false);
        // Simulate API call success
        setTimeout(() => {
            // Show success message (would be implemented with a toast notification system)
            alert("Profile updated successfully");
        }, 1000);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handlePasswordChange = (e) => {
        e.preventDefault();
        // In a real app, this would call an API to change the password
        setShowChangePassword(false);
        alert("Password changed successfully");
    };

    return (
        <div className="p-4 md:p-8">
            <div className="mb-8" data-aos="fade-down">
                <h1 className="text-3xl font-bold text-gray-800">Admin Profile</h1>
                <p className="text-gray-600">Manage your account information and security settings</p>
            </div>

            {/* Tabs */}
            <div className="mb-8 bg-white rounded-xl shadow-md overflow-hidden" data-aos="fade-up">
                <div className="flex overflow-x-auto">
                    <button
                        className={`px-6 py-4 text-sm font-medium ${currentTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setCurrentTab('profile')}
                    >
                        Profile
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium ${currentTab === 'security' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setCurrentTab('security')}
                    >
                        Security
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium ${currentTab === 'activity' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setCurrentTab('activity')}
                    >
                        Activity Log
                    </button>
                    <button
                        className={`px-6 py-4 text-sm font-medium ${currentTab === 'sessions' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setCurrentTab('sessions')}
                    >
                        Active Sessions
                    </button>
                </div>
            </div>

            {/* Profile Tab */}
            {currentTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
                    {/* Profile Image Card */}
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-32 h-32 rounded-full object-cover border-4 border-white shadow"
                                />
                                <label
                                    htmlFor="profile-image"
                                    className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors"
                                >
                                    <MdOutlineModeEdit className="text-white h-4 w-4" />
                                </label>
                                <input
                                    type="file"
                                    id="profile-image"
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            <h3 className="mt-4 text-lg font-semibold text-gray-800">{profileData.name}</h3>
                            <p className="text-sm text-gray-500">{profileData.role}</p>

                            <div className="w-full mt-6">
                                <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">Status</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">Joined</span>
                                    <span className="text-sm text-gray-800">{profileData.joinDate}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                    <span className="text-sm text-gray-500">Last Login</span>
                                    <span className="text-sm text-gray-800">{profileData.lastLogin}</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-t border-b border-gray-200">
                                    <span className="text-sm text-gray-500">Department</span>
                                    <span className="text-sm text-gray-800">{profileData.department}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Details Card */}
                    <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                            {!editMode && (
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                                >
                                    <MdEdit className="mr-1" /> Edit Profile
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleProfileUpdate}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 border rounded-md ${editMode ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" : "border-gray-200 bg-gray-50"}`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={profileData.email}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 border rounded-md ${editMode ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" : "border-gray-200 bg-gray-50"}`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="text"
                                        id="phone"
                                        name="phone"
                                        value={profileData.phone}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 border rounded-md ${editMode ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" : "border-gray-200 bg-gray-50"}`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        id="department"
                                        name="department"
                                        value={profileData.department}
                                        onChange={handleInputChange}
                                        disabled={!editMode}
                                        className={`w-full px-4 py-2 border rounded-md ${editMode ? "border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" : "border-gray-200 bg-gray-50"}`}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        value={profileData.role}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-200 rounded-md bg-gray-50"
                                    />
                                </div>
                            </div>

                            {editMode && (
                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setEditMode(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors"
                                    >
                                        <MdSave className="mr-2" /> Save Changes
                                    </button>
                                </div>
                            )}
                        </form>

                        <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-md font-medium text-gray-700 mb-4">Account Actions</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setShowChangePassword(true)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors"
                                >
                                    <MdLock className="mr-2" /> Change Password
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors">
                                    <MdSecurity className="mr-2" /> Two-Factor Authentication
                                </button>
                                <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors">
                                    <MdNotificationsActive className="mr-2" /> Notification Settings
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Security Tab */}
            {currentTab === 'security' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-aos="fade-up" data-aos-delay="100">
                    <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Settings</h2>

                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-md font-medium text-gray-800">Password</h3>
                                        <p className="text-sm text-gray-500">Update your password regularly to maintain security</p>
                                    </div>
                                    <button
                                        onClick={() => setShowChangePassword(true)}
                                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50"
                                    >
                                        Change Password
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <p>Last changed: 30 days ago</p>
                                    <p className="mt-1">Password strength: <span className="text-green-600 font-medium">Strong</span></p>
                                </div>
                            </div>

                            <div className="border-b border-gray-200 pb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-md font-medium text-gray-800">Two-Factor Authentication</h3>
                                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                    </div>
                                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs">Enabled</div>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <p>Authentication method: Google Authenticator</p>
                                    <p className="mt-1">Last verified: 5 days ago</p>
                                </div>
                                <div className="mt-4 flex space-x-3">
                                    <button className="text-sm text-blue-600 hover:text-blue-800">Reconfigure</button>
                                    <button className="text-sm text-gray-600 hover:text-gray-800">Disable</button>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-md font-medium text-gray-800">Login Sessions</h3>
                                        <p className="text-sm text-gray-500">Manage your active sessions</p>
                                    </div>
                                    <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                                        Manage Sessions
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700">
                                    <p>Active sessions: 2</p>
                                    <p className="mt-1">Current device: Chrome on Windows</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-6">Security Recommendations</h2>

                        <div className="space-y-4">
                            <div className="p-3 bg-green-50 border-l-4 border-green-500 rounded">
                                <div className="flex items-start">
                                    <MdShield className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                                    <div>
                                        <h4 className="text-sm font-medium text-green-800">Two-factor authentication enabled</h4>
                                        <p className="text-xs text-green-700 mt-0.5">Your account is protected with an extra layer of security.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded">
                                <div className="flex items-start">
                                    <MdLock className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                                    <div>
                                        <h4 className="text-sm font-medium text-yellow-800">Password age: 30 days</h4>
                                        <p className="text-xs text-yellow-700 mt-0.5">Consider updating your password regularly for better security.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                                <div className="flex items-start">
                                    <MdDevices className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                                    <div>
                                        <h4 className="text-sm font-medium text-blue-800">Review active sessions</h4>
                                        <p className="text-xs text-blue-700 mt-0.5">Check and terminate any unrecognized sessions from your account.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                    Security Check-up
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Activity Log Tab */}
            {currentTab === 'activity' && (
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Recent Account Activity</h2>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {[
                                    { action: "Login successful", ip: "192.168.1.45", location: "Jakarta, Indonesia", device: "Chrome on Windows", time: "Today, 08:45" },
                                    { action: "Changed password", ip: "192.168.1.45", location: "Jakarta, Indonesia", device: "Chrome on Windows", time: "30 days ago" },
                                    { action: "Updated profile information", ip: "192.168.1.45", location: "Jakarta, Indonesia", device: "Chrome on Windows", time: "45 days ago" },
                                    { action: "Enabled two-factor authentication", ip: "192.168.1.45", location: "Jakarta, Indonesia", device: "Chrome on Windows", time: "60 days ago" },
                                    { action: "Login successful", ip: "192.168.1.45", location: "Jakarta, Indonesia", device: "Chrome on Windows", time: "65 days ago" },
                                    { action: "Login failed (incorrect password)", ip: "203.0.113.45", location: "Unknown", device: "Safari on macOS", time: "65 days ago" },
                                    { action: "Account created", ip: "192.168.1.45", location: "Jakarta, Indonesia", device: "Chrome on Windows", time: "10 Mar 2022" },
                                ].map((activity, index) => (
                                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.action}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.ip}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.device}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                            <MdHistory className="mr-1" /> View Full History
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700 transition-colors">
                            <MdRefresh className="mr-1" /> Refresh Activity
                        </button>
                    </div>
                </div>
            )}

            {/* Active Sessions Tab */}
            {currentTab === 'sessions' && (
                <div className="bg-white rounded-xl shadow-md p-6" data-aos="fade-up" data-aos-delay="100">
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">Active Sessions</h2>

                    <div className="space-y-4">
                        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <MdDevices className="h-6 w-6 text-green-600 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-md font-medium text-gray-900">Chrome on Windows <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full ml-2">Current</span></h3>
                                        <p className="text-sm text-gray-600 mt-1">IP: 192.168.1.45 • Jakarta, Indonesia</p>
                                        <p className="text-xs text-gray-500 mt-1">Active now • Last activity: Just now</p>
                                    </div>
                                </div>
                                <button className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50" disabled>
                                    Terminate
                                </button>
                            </div>
                        </div>

                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start">
                                    <MdDevices className="h-6 w-6 text-gray-600 mr-4 mt-1" />
                                    <div>
                                        <h3 className="text-md font-medium text-gray-900">Android App</h3>
                                        <p className="text-sm text-gray-600 mt-1">IP: 36.85.123.45 • Jakarta, Indonesia</p>
                                        <p className="text-xs text-gray-500 mt-1">Active now • Last activity: 10 minutes ago</p>
                                    </div>
                                </div>
                                <button className="text-sm text-red-600 hover:text-red-800">
                                    Terminate
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                            Terminate All Other Sessions
                        </button>
                    </div>
                </div>
            )}

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-md w-full p-6" data-aos="zoom-in">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>

                        <form onSubmit={handlePasswordChange}>
                            <div className="mb-4">
                                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="current-password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Password must be at least 8 characters and include uppercase, lowercase, number, and special character
                                </p>
                            </div>

                            <div className="mb-6">
                                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowChangePassword(false)}
                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Update Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProfile;
