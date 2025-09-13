import React from 'react';
import {
    MdTrendingUp,
    MdTrendingDown,
    MdShowChart,
    MdBarChart,
    MdPieChart,
    MdInsights,
    MdCalendarToday,
    MdAccessTime,
    MdPeople
} from 'react-icons/md';

const AnalyticsCharts = ({ accessData, classDetails }) => {
    // Process data for charts
    const processAccessData = () => {
        if (!accessData || accessData.length === 0) {
            return {
                dailyAccess: [],
                hourlyDistribution: [],
                weeklyTrend: [],
                studentActivity: []
            };
        }

        // Group by date
        const dailyAccess = accessData.reduce((acc, log) => {
            const date = log.date;
            acc[date] = (acc[date] || 0) + 1;
            return acc;
        }, {});

        // Group by hour
        const hourlyDistribution = accessData.reduce((acc, log) => {
            const hour = new Date(log.time).getHours();
            acc[hour] = (acc[hour] || 0) + 1;
            return acc;
        }, {});

        // Weekly trend (last 7 days)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            return date.toISOString().split('T')[0];
        }).reverse();

        const weeklyTrend = last7Days.map(date => ({
            date,
            count: dailyAccess[date] || 0,
            day: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' })
        }));

        // Student activity (unique students per day)
        const studentActivity = Object.entries(dailyAccess).map(([date, count]) => ({
            date,
            count,
            day: new Date(date).toLocaleDateString('id-ID', { weekday: 'short' })
        }));

        return {
            dailyAccess: Object.entries(dailyAccess),
            hourlyDistribution: Object.entries(hourlyDistribution),
            weeklyTrend,
            studentActivity: studentActivity.slice(-7)
        };
    };

    const chartData = processAccessData();
    const maxWeeklyAccess = Math.max(...chartData.weeklyTrend.map(d => d.count), 1);
    const totalAccess = accessData?.length || 0;
    const uniqueStudents = accessData ? new Set(accessData.map(log => log.studentId)).size : 0;

    // Hourly distribution chart
    const HourlyChart = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const maxHourly = Math.max(...chartData.hourlyDistribution.map(([_, count]) => count), 1);

        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <MdShowChart className="w-6 h-6 mr-3 text-blue-600" />
                    Distribusi Akses per Jam
                </h3>
                
                <div className="flex items-end justify-between h-48 space-x-1">
                    {hours.map(hour => {
                        const count = chartData.hourlyDistribution.find(([h]) => parseInt(h) === hour)?.[1] || 0;
                        const height = maxHourly > 0 ? (count / maxHourly) * 100 : 0;
                        
                        return (
                            <div key={hour} className="flex flex-col items-center flex-1">
                                <div 
                                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer"
                                    style={{ height: `${height}%`, minHeight: height > 0 ? '4px' : '0px' }}
                                    title={`${hour}:00 - ${count} akses`}
                                ></div>
                                <span className="text-xs text-slate-600 mt-2 transform -rotate-45">{hour}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Weekly trend chart
    const WeeklyTrendChart = () => {
        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <MdTrendingUp className="w-6 h-6 mr-3 text-emerald-600" />
                    Tren Akses Mingguan
                </h3>
                
                <div className="flex items-end justify-between h-48 space-x-2">
                    {chartData.weeklyTrend.map((day, index) => {
                        const height = maxWeeklyAccess > 0 ? (day.count / maxWeeklyAccess) * 100 : 0;
                        const isToday = day.date === new Date().toISOString().split('T')[0];
                        
                        return (
                            <div key={day.date} className="flex flex-col items-center flex-1">
                                <div 
                                    className={`w-full rounded-t-lg transition-all hover:scale-105 cursor-pointer ${
                                        isToday 
                                            ? 'bg-gradient-to-t from-emerald-500 to-emerald-400' 
                                            : 'bg-gradient-to-t from-slate-400 to-slate-300'
                                    }`}
                                    style={{ height: `${height}%`, minHeight: height > 0 ? '8px' : '0px' }}
                                    title={`${day.day} - ${day.count} akses`}
                                ></div>
                                <div className="text-center mt-2">
                                    <p className="text-xs font-semibold text-slate-700">{day.day}</p>
                                    <p className="text-xs text-slate-500">{day.count}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Quick stats cards
    const StatsCards = () => {
        const avgDailyAccess = chartData.weeklyTrend.length > 0 
            ? Math.round(chartData.weeklyTrend.reduce((sum, day) => sum + day.count, 0) / chartData.weeklyTrend.length)
            : 0;

        const todayAccess = chartData.weeklyTrend.find(day => 
            day.date === new Date().toISOString().split('T')[0]
        )?.count || 0;

        const trend = chartData.weeklyTrend.length >= 2 
            ? todayAccess - chartData.weeklyTrend[chartData.weeklyTrend.length - 2].count
            : 0;

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <MdBarChart className="w-8 h-8 text-blue-200" />
                        <span className="text-3xl font-bold">{totalAccess}</span>
                    </div>
                    <p className="text-blue-100">Total Akses (7 hari)</p>
                </div>

                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <MdPeople className="w-8 h-8 text-emerald-200" />
                        <span className="text-3xl font-bold">{uniqueStudents}</span>
                    </div>
                    <p className="text-emerald-100">Mahasiswa Aktif</p>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <MdCalendarToday className="w-8 h-8 text-purple-200" />
                        <span className="text-3xl font-bold">{avgDailyAccess}</span>
                    </div>
                    <p className="text-purple-100">Rata-rata Harian</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 text-white">
                    <div className="flex items-center justify-between mb-2">
                        {trend >= 0 ? (
                            <MdTrendingUp className="w-8 h-8 text-orange-200" />
                        ) : (
                            <MdTrendingDown className="w-8 h-8 text-orange-200" />
                        )}
                        <span className="text-3xl font-bold">{todayAccess}</span>
                    </div>
                    <p className="text-orange-100">Akses Hari Ini</p>
                    <div className="flex items-center mt-1">
                        <span className="text-xs text-orange-200">
                            {trend >= 0 ? '+' : ''}{trend} dari kemarin
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Peak hours analysis
    const PeakHoursAnalysis = () => {
        const sortedHours = chartData.hourlyDistribution
            .map(([hour, count]) => ({ hour: parseInt(hour), count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);

        return (
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                    <MdAccessTime className="w-6 h-6 mr-3 text-orange-600" />
                    Jam Tersibuk
                </h3>
                
                <div className="space-y-4">
                    {sortedHours.map((item, index) => (
                        <div key={item.hour} className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 text-white font-bold ${
                                    index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    index === 1 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                    'bg-gradient-to-r from-red-500 to-red-600'
                                }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-800">{item.hour}:00 - {item.hour + 1}:00</p>
                                    <p className="text-sm text-slate-600">{item.count} akses</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full ${
                                            index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                            index === 1 ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                                            'bg-gradient-to-r from-red-500 to-red-600'
                                        }`}
                                        style={{ width: `${(item.count / (sortedHours[0]?.count || 1)) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8">
            {/* Stats Overview */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <MdInsights className="w-8 h-8 mr-3 text-blue-600" />
                    Analytics Dashboard
                </h2>
                <StatsCards />
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <WeeklyTrendChart />
                <PeakHoursAnalysis />
            </div>

            {/* Hourly Distribution */}
            <HourlyChart />

            {/* Summary Insights */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                    <MdPieChart className="w-6 h-6 mr-3" />
                    Ringkasan Insights
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white/20 rounded-xl p-4">
                        <p className="font-semibold mb-1">Pola Akses</p>
                        <p className="text-indigo-100">
                            {chartData.hourlyDistribution.length > 0 
                                ? `Paling aktif pada jam ${chartData.hourlyDistribution.sort((a, b) => b[1] - a[1])[0]?.[0] || '9'}:00`
                                : 'Belum ada data akses'
                            }
                        </p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4">
                        <p className="font-semibold mb-1">Tingkat Aktivitas</p>
                        <p className="text-indigo-100">
                            {classDetails?.enrolled_students && uniqueStudents > 0
                                ? `${Math.round((uniqueStudents / classDetails.enrolled_students) * 100)}% mahasiswa aktif`
                                : 'Data mahasiswa tidak tersedia'
                            }
                        </p>
                    </div>
                    <div className="bg-white/20 rounded-xl p-4">
                        <p className="font-semibold mb-1">Tren Mingguan</p>
                        <p className="text-indigo-100">
                            {chartData.weeklyTrend.length >= 2
                                ? (chartData.weeklyTrend[chartData.weeklyTrend.length - 1].count >= 
                                   chartData.weeklyTrend[chartData.weeklyTrend.length - 2].count
                                   ? 'Meningkat' : 'Menurun')
                                : 'Stabil'
                            }
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsCharts;