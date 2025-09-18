import React, { useState, useMemo } from 'react';

const SecurityDashboard = () => {
  const [role, setRole] = useState('BranchManager');
  const [branch, setBranch] = useState('DXB-01');
  const [piiMask, setPiiMask] = useState(true);
  const [phone, setPhone] = useState('+971501234567');
  const [vin, setVIN] = useState('JHMCM56557C404453');
  const [customer, setCustomer] = useState('Omar');
  const [car, setCar] = useState('Civic 2021');
  const [activeTab, setActiveTab] = useState('access');

  // Sample data
  const rows = [
    { id: 'WO-101', type: 'WorkOrder', customer: 'Omar', car: 'Civic 2021', status: 'In Progress', branch_id: 'DXB-01' },
    { id: 'WO-102', type: 'WorkOrder', customer: 'Lina', car: 'Corolla 2019', status: 'Closed', branch_id: 'DXB-02' },
    { id: 'INV-5502', type: 'Invoice', customer: 'Ahmed', car: 'Camry 2020', status: 'Unpaid', branch_id: 'DXB-01' },
  ];

  // Validation functions
  const isE164 = p => /^\+[1-9]\d{7,14}$/.test(p);
  const isVIN = v => /^[A-HJ-NPR-Z0-9]{17}$/i.test(v);
  const phoneOK = isE164(phone);
  const vinOK = isVIN(vin);
  const linkOK = !!(car && customer);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 p-4 md:p-6">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1C0B7E] to-indigo-900 text-white rounded-2xl shadow-lg p-4 md:p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Security Dashboard</h1>
            <p className="text-indigo-200">Role-based access control & audit logging</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              className="bg-indigo-700 border border-indigo-600 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            >
              <option value="BranchManager">BranchManager</option>
              <option value="HQ">HQ</option>
            </select>
            <select 
              value={branch} 
              onChange={(e) => setBranch(e.target.value)}
              className="bg-indigo-700 border border-indigo-600 text-white rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-400"
            >
              <option value="DXB-01">DXB-01</option>
              <option value="DXB-02">DXB-02</option>
            </select>
            <label className="flex items-center bg-indigo-700 border border-indigo-600 text-white rounded-lg px-3 py-2 text-sm">
              <input 
                type="checkbox" 
                checked={piiMask} 
                onChange={(e) => setPiiMask(e.target.checked)} 
                className="mr-2 rounded focus:ring-indigo-400"
              />
              Mask PII
            </label>
            <button className="bg-white text-[#1C0B7E] font-medium rounded-lg px-4 py-2 text-sm hover:bg-indigo-50 transition-all flex items-center">
              <span className="mr-2">📊</span> Export CSV
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center hover:shadow-lg transition-shadow">
          <div className="bg-indigo-100 p-3 rounded-xl mr-4">
            <span className="text-[#1C0B7E] text-2xl">🛡️</span>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Active Sessions</h3>
            <p className="text-2xl font-bold text-[#1C0B7E]">42</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center hover:shadow-lg transition-shadow">
          <div className="bg-green-100 p-3 rounded-xl mr-4">
            <span className="text-green-700 text-2xl">✅</span>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Verified Today</h3>
            <p className="text-2xl font-bold text-green-700">18</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-md p-5 flex items-center hover:shadow-lg transition-shadow">
          <div className="bg-amber-100 p-3 rounded-xl mr-4">
            <span className="text-amber-700 text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-gray-500 text-sm">Pending Actions</h3>
            <p className="text-2xl font-bold text-amber-700">5</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Access Control Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="font-semibold text-gray-800 text-lg">Row-Level Access Control</h2>
              <p className="text-sm text-gray-500">JWT: {role} @ {branch}</p>
            </div>
            <div className="p-1">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-indigo-50 text-[#1C0B7E] text-sm">
                      <th className="text-left py-3 px-4 rounded-l-xl">ID</th>
                      <th className="text-left py-3 px-4">Type</th>
                      <th className="text-left py-3 px-4">Customer</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Branch</th>
                      <th className="text-right py-3 px-4 rounded-r-xl">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((row, index) => (
                      <tr key={index} className="hover:bg-indigo-50 transition-colors">
                        <td className="py-3 px-4 font-medium">{row.id}</td>
                        <td className="py-3 px-4">{row.type}</td>
                        <td className="py-3 px-4">{row.customer}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            row.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                            row.status === 'Closed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">{row.branch_id}</td>
                        <td className="py-3 px-4">
                          <div className="flex justify-end space-x-2">
                            <button className="bg-indigo-100 text-[#1C0B7E] rounded-lg px-3 py-1 text-xs hover:bg-indigo-200 transition-colors">
                              Close
                            </button>
                            <button className="bg-[#1C0B7E] text-white rounded-lg px-3 py-1 text-xs hover:bg-indigo-800 transition-colors">
                              Send
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Validation Card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="border-b border-gray-100 px-6 py-4 bg-gradient-to-r from-indigo-50 to-white">
              <h2 className="font-semibold text-gray-800 text-lg">Data Validation & Integrity</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1C0B7E] focus:border-[#1C0B7E] transition-all"
                  />
                  <div className="mt-2">
                    {phoneOK ? (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Valid E.164 format
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600 text-sm">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Invalid format
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">VIN Number</label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVIN(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1C0B7E] focus:border-[#1C0B7E] transition-all"
                  />
                  <div className="mt-2">
                    {vinOK ? (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Valid VIN
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600 text-sm">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        {vin.length}/17 characters
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={customer}
                    onChange={(e) => setCustomer(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1C0B7E] focus:border-[#1C0B7E] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Model</label>
                  <input
                    type="text"
                    value={car}
                    onChange={(e) => setCar(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#1C0B7E] focus:border-[#1C0B7E] transition-all"
                  />
                  <div className="mt-2">
                    {linkOK ? (
                      <span className="inline-flex items-center text-green-600 text-sm">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        Customer-vehicle linked
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-red-600 text-sm">
                        <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                        Link required
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button className="bg-[#1C0B7E] text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-800 transition-colors shadow-md hover:shadow-lg">
                  Save Record
                </button>
                <button className="border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  Resolve Alert
                </button>
              </div>
            </div>
          </div>

          {/* Access Restricted Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start hover:shadow-md transition-shadow">
            <div className="bg-amber-100 p-2 rounded-lg mr-4">
              <span className="text-amber-700 text-xl">🔒</span>
            </div>
            <div>
              <h3 className="font-medium text-amber-800">Access Restricted</h3>
              <p className="text-amber-700 text-sm mt-1">You don't have permission to view this resource.</p>
              <button className="mt-3 text-amber-700 text-sm font-medium hover:text-amber-800 transition-colors">
                Request Access →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityDashboard;