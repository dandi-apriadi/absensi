// Debug script to check current day and schedule matching
const currentDate = new Date();
console.log('Current date:', currentDate);
console.log('Current day (English):', currentDate.toLocaleDateString('en-US', { weekday: 'long' }));
console.log('Current day (Indonesian):', currentDate.toLocaleDateString('id-ID', { weekday: 'long' }));
console.log('Current time:', currentDate.toTimeString().slice(0, 5));

// Schedule from database
const schedule = '[{"day":"Senin","start_time":"23:00","end_time":"23:59"}]';
const parsedSchedule = JSON.parse(schedule);
console.log('Database schedule:', parsedSchedule);

// Day mapping
const dayMapping = {
    'Monday': 'Senin',
    'Tuesday': 'Selasa', 
    'Wednesday': 'Rabu',
    'Thursday': 'Kamis',
    'Friday': 'Jumat',
    'Saturday': 'Sabtu',
    'Sunday': 'Minggu'
};

const currentDayEn = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
const currentDayId = dayMapping[currentDayEn];
console.log('Current day mapped to Indonesian:', currentDayId);

// Check if today matches schedule
const todaySchedule = parsedSchedule.filter(slot => slot.day === currentDayId);
console.log('Today\'s schedule:', todaySchedule);