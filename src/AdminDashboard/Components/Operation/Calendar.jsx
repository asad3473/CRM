import React, { useState, useEffect } from 'react';

const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [view, setView] = useState('month');
    const [isAnimating, setIsAnimating] = useState(false);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [newAppointment, setNewAppointment] = useState({
        customer: '',
        service: '',
        branch: 'Main Branch',
        date: new Date(),
        time: '10:00',
        notes: ''
    });
    const [branches] = useState(['Main Branch', 'Downtown Branch', 'West Branch', 'East Branch']);
    const [services] = useState(['Oil Change', 'Brake Service', 'Tire Rotation', 'Engine Diagnostic', 'Battery Replacement', 'AC Service']);

    // Sample appointments data
    const [appointments, setAppointments] = useState([
        { id: 1, date: new Date(2023, 8, 15, 10, 0), customer: 'Ahmed Hassan', service: 'Oil Change', branch: 'Main Branch', status: 'confirmed' },
        { id: 2, date: new Date(2023, 8, 15, 14, 30), customer: 'Mohammed Ali', service: 'Brake Service', branch: 'Downtown Branch', status: 'confirmed' },
        { id: 3, date: new Date(2023, 8, 17, 9, 0), customer: 'Sarah Omar', service: 'Tire Rotation', branch: 'Main Branch', status: 'completed' },
        { id: 4, date: new Date(2023, 8, 18, 11, 0), customer: 'John David', service: 'Engine Diagnostic', branch: 'West Branch', status: 'pending' },
    ]);

    // Filter appointments by status
    const filteredAppointments = (status) => {
        return appointments.filter(app =>
            app.date.getDate() === selectedDate.getDate() &&
            app.date.getMonth() === selectedDate.getMonth() &&
            app.date.getFullYear() === selectedDate.getFullYear() &&
            app.status === status
        );
    };

    const navigateDate = (direction) => {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        if (view === 'month') {
            const newDate = new Date(currentDate);
            newDate.setMonth(currentDate.getMonth() + direction);
            setCurrentDate(newDate);
        } else {
            const newDate = new Date(currentDate);
            newDate.setDate(currentDate.getDate() + (direction * 7));
            setCurrentDate(newDate);
        }
    };

    const goToToday = () => {
        setIsAnimating(true);
        const today = new Date();
        setCurrentDate(today);
        setSelectedDate(today);
        setTimeout(() => setIsAnimating(false), 300);
    };

    const toggleView = () => {
        setIsAnimating(true);
        setTimeout(() => {
            setView(view === 'month' ? 'week' : 'month');
            setIsAnimating(false);
        }, 300);
    };

    const handleAddAppointment = () => {
        // Create a new date object with the selected date and time
        const [hours, minutes] = newAppointment.time.split(':');
        const appointmentDate = new Date(newAppointment.date);
        appointmentDate.setHours(parseInt(hours), parseInt(minutes));

        const newAppt = {
            id: appointments.length + 1,
            date: appointmentDate,
            customer: newAppointment.customer,
            service: newAppointment.service,
            branch: newAppointment.branch,
            status: 'pending',
            notes: newAppointment.notes
        };

        setAppointments([...appointments, newAppt]);
        setShowAppointmentModal(false);
        setNewAppointment({
            customer: '',
            service: '',
            branch: 'Main Branch',
            date: new Date(),
            time: '10:00',
            notes: ''
        });
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        return { firstDay, lastDay, daysInMonth, startingDay };
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderMonthView = () => {
        const { daysInMonth, startingDay } = getDaysInMonth(currentDate);
        const days = [];

        // Add empty cells for starting day
        for (let i = 0; i < startingDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-24 p-1"></div>);
        }

        // Add day cells
        for (let i = 1; i <= daysInMonth; i++) {
            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dayAppointments = appointments.filter(app =>
                app.date.getDate() === i &&
                app.date.getMonth() === currentDate.getMonth() &&
                app.date.getFullYear() === currentDate.getFullYear()
            );

            const isSelected = selectedDate.getDate() === i &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear();

            const isToday = new Date().getDate() === i &&
                new Date().getMonth() === currentDate.getMonth() &&
                new Date().getFullYear() === currentDate.getFullYear();

            days.push(
                <div
                    key={`day-${i}`}
                    className={`h-24 p-1 border border-gray-200 rounded-lg transition-all duration-300 ease-in-out cursor-pointer
            ${isSelected ? 'bg-blue-100 border-blue-300 scale-105 shadow-md' : 'hover:bg-gray-50'}
            ${isToday ? 'border-2 border-blue-400' : ''}`}
                    onClick={() => setSelectedDate(dayDate)}
                >
                    <div className="flex justify-between items-center">
                        <span className={`font-medium ${isSelected ? 'text-blue-700' : isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                            {i}
                        </span>
                        {isToday && <span className="h-2 w-2 rounded-full bg-blue-500"></span>}
                        {dayAppointments.length > 0 && !isToday && (
                            <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                    </div>
                    <div className="mt-1 space-y-1 overflow-hidden">
                        {dayAppointments.slice(0, 2).map(app => (
                            <div key={app.id} className={`text-xs ${getStatusColor(app.status)} rounded px-1 py-0.5 truncate`}>
                                {app.service}
                            </div>
                        ))}
                        {dayAppointments.length > 2 && (
                            <div className="text-xs text-gray-500">+{dayAppointments.length - 2} more</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const renderWeekView = () => {
        const days = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const dayDate = new Date(startOfWeek);
            dayDate.setDate(startOfWeek.getDate() + i);

            const dayAppointments = appointments.filter(app =>
                app.date.getDate() === dayDate.getDate() &&
                app.date.getMonth() === dayDate.getMonth() &&
                app.date.getFullYear() === dayDate.getFullYear()
            );

            const isSelected = selectedDate.getDate() === dayDate.getDate() &&
                selectedDate.getMonth() === dayDate.getMonth() &&
                selectedDate.getFullYear() === dayDate.getFullYear();

            const isToday = new Date().getDate() === dayDate.getDate() &&
                new Date().getMonth() === dayDate.getMonth() &&
                new Date().getFullYear() === dayDate.getFullYear();

            days.push(
                <div
                    key={`weekday-${i}`}
                    className={`min-w-[130px] border rounded-lg transition-all duration-300 ease-in-out cursor-pointer
            ${isSelected ? 'bg-blue-100 border-blue-300 scale-105 shadow-md' : 'hover:bg-gray-50'}
            ${isToday ? 'border-2 border-blue-400' : 'border-gray-200'}`}
                    onClick={() => setSelectedDate(dayDate)}
                >
                    <div className={`p-2 text-center border-b rounded-t-lg ${isToday ? 'bg-blue-50' : 'bg-gray-50'}`}>
                        <div className="font-medium text-gray-600">{dayDate.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className={`text-lg font-bold ${isSelected ? 'text-blue-700' : isToday ? 'text-blue-600' : 'text-gray-800'}`}>
                            {dayDate.getDate()}
                        </div>
                    </div>
                    <div className="p-2 space-y-2">
                        {dayAppointments.map(app => (
                            <div key={app.id} className="p-2 bg-white rounded border border-gray-200 shadow-sm">
                                <div className="text-xs font-medium text-blue-600">
                                    {app.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                </div>
                                <div className="text-sm font-semibold truncate">{app.service}</div>
                                <div className="text-xs text-gray-500 truncate">{app.customer}</div>
                                <div className={`text-xs mt-1 inline-block px-1 rounded ${getStatusColor(app.status)}`}>
                                    {app.status}
                                </div>
                            </div>
                        ))}
                        {dayAppointments.length === 0 && (
                            <div className="text-center text-gray-400 text-sm py-4">No appointments</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const AppointmentModal = () => (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-800">Schedule New Appointment</h3>
                        <button
                            onClick={() => setShowAppointmentModal(false)}
                            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                            <input
                                type="text"
                                value={newAppointment.customer}
                                onChange={(e) => setNewAppointment({ ...newAppointment, customer: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Enter customer name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
                            <select
                                value={newAppointment.service}
                                onChange={(e) => setNewAppointment({ ...newAppointment, service: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            >
                                <option value="">Select a service</option>
                                {services.map(service => (
                                    <option key={service} value={service}>{service}</option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input
                                    type="date"
                                    value={newAppointment.date.toISOString().split('T')[0]}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, date: new Date(e.target.value) })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input
                                    type="time"
                                    value={newAppointment.time}
                                    onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                            <select
                                value={newAppointment.branch}
                                onChange={(e) => setNewAppointment({ ...newAppointment, branch: e.target.value })}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                            >
                                {branches.map(branch => (
                                    <option key={branch} value={branch}>{branch}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                            <textarea
                                value={newAppointment.notes}
                                onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })}
                                rows={3}
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Additional notes about the appointment"
                            />
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <button
                            onClick={() => setShowAppointmentModal(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddAppointment}
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 flex items-center"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Schedule Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 max-w-full overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Service Appointments</h2>
                    <p className="text-gray-600 text-sm mt-1">Manage your branch appointments and schedules</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-sm flex items-center"
                        onClick={goToToday}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        Today
                    </button>

                    <button
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        onClick={() => navigateDate(-1)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <span className="font-semibold text-gray-700 min-w-[160px] text-center">
                        {view === 'month'
                            ? currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                            : `Week of ${formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - currentDate.getDay()))}`
                        }
                    </span>

                    <button
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
                        onClick={() => navigateDate(1)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <button
                        className="px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 text-sm flex items-center"
                        onClick={toggleView}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        {view === 'month' ? 'Week View' : 'Month View'}
                    </button>


                </div>
            </div>
            <div className=' flex justify-end'>
                <button
                    className="px-4 py-2 rounded-lg bg-[#1C0B7E] text-white hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center shadow-md hover:shadow-lg"
                    onClick={() => setShowAppointmentModal(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Appointment
                </button>
            </div>
            <div className={`mb-8 transition-opacity duration-300 ${isAnimating ? 'opacity-70' : 'opacity-100'}`}>
                {view === 'month' ? (
                    <>
                        <div className="grid grid-cols-7 gap-2 mb-2">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center font-medium text-gray-500 py-2">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">
                            {renderMonthView()}
                        </div>
                    </>
                ) : (
                    <div className="overflow-x-auto">
                        <div className="flex gap-4 min-w-max">
                            {renderWeekView()}
                        </div>
                    </div>
                )}
            </div>

            <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Appointments on {formatDate(selectedDate)}</h3>
                    <div className="text-sm text-gray-500">
                        {appointments.filter(app =>
                            app.date.getDate() === selectedDate.getDate() &&
                            app.date.getMonth() === selectedDate.getMonth() &&
                            app.date.getFullYear() === selectedDate.getFullYear()
                        ).length} total appointments
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Pending Appointments */}
                    <div className=" p-4 rounded-lg border border-[#1C0B7E]">
                        <div className="flex items-center mb-3">
                            <div className="h-3 w-3 bg-[#1C0B7E] rounded-full mr-2"></div>
                            <h4 className="font-semibold text-black">Pending</h4>
                            <span className="ml-auto  text-black text-xs font-medium px-2 py-0.5 rounded-full">
                                {filteredAppointments('pending').length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {filteredAppointments('pending').length === 0 ? (
                                <p className="text-black text-sm">No pending appointments</p>
                            ) : (
                                filteredAppointments('pending').map(app => (
                                    <div key={app.id} className="bg-white p-3 rounded border border-yellow-100 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium text-gray-800">{app.customer}</div>
                                                <div className="text-sm text-gray-600">{app.service}</div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700">
                                                {app.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">{app.branch}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Confirmed Appointments */}
                    <div className="bg-black/10 text-white p-4 rounded-lg border border-blue-200">
                        <div className="flex items-center mb-3">
                            <div className="h-3 w-3 rounded-full bg-[#1C0B7E] mr-2"></div>
                            <h4 className="font-semibold text-black">Confirmed</h4>
                            <span className="ml-auto bg-blue-100 text-black text-xs font-medium px-2 py-0.5 rounded-full">
                                {filteredAppointments('confirmed').length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {filteredAppointments('confirmed').length === 0 ? (
                                <p className="text-black text-sm">No confirmed appointments</p>
                            ) : (
                                filteredAppointments('confirmed').map(app => (
                                    <div key={app.id} className="bg-white p-3 rounded border border-blue-100 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium text-gray-800">{app.customer}</div>
                                                <div className="text-sm text-gray-600">{app.service}</div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700">
                                                {app.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">{app.branch}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Completed Appointments */}
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="flex items-center mb-3">
                            <div className="h-3 w-3 rounded-full bg-green-500 mr-2"></div>
                            <h4 className="font-semibold text-green-800">Completed</h4>
                            <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                                {filteredAppointments('completed').length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {filteredAppointments('completed').length === 0 ? (
                                <p className="text-green-700 text-sm">No completed appointments</p>
                            ) : (
                                filteredAppointments('completed').map(app => (
                                    <div key={app.id} className="bg-white p-3 rounded border border-green-100 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="font-medium text-gray-800">{app.customer}</div>
                                                <div className="text-sm text-gray-600">{app.service}</div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-700">
                                                {app.date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-2">{app.branch}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {showAppointmentModal && <AppointmentModal />}
        </div>
    );
};

export default Calendar;