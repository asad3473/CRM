import React, { useState } from 'react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    companyName: "Nerou Automotive",
    language: "english",
    timezone: "Asia/Riyadh",
    dateFormat: "dd/mm/yyyy",
    timeFormat: "12h",
    
    // Notification Settings
    emailNotifications: true,
    whatsappNotifications: true,
    reminder24h: true,
    reminder1h: true,
    serviceComplete: true,
    feedbackRequest: true,
    
    // Branch Settings
    branches: [
      { id: 1, name: "Main Branch", address: "123 King Fahd Rd, Riyadh", phone: "+966112345678", manager: "Ahmed Al-Saud", active: true },
      { id: 2, name: "Downtown Branch", address: "456 Olaya St, Riyadh", phone: "+966112345679", manager: "Mohammed Khan", active: true },
      { id: 3, name: "West Branch", address: "789 Tahlia St, Riyadh", phone: "+966112345680", manager: "Sarah Johnson", active: false }
    ],
    
    // User Management
    users: [
      { id: 1, name: "Omar Ahmed", email: "omar@nerou-auto.com", role: "admin", branch: "All Branches", active: true },
      { id: 2, name: "Khalid Hassan", email: "khalid@nerou-auto.com", role: "manager", branch: "Main Branch", active: true },
      { id: 3, name: "Lina Mohammed", email: "lina@nerou-auto.com", role: "advisor", branch: "Downtown Branch", active: true }
    ],
    
    // Integration Settings
    whatsappIntegration: true,
    whatsappProvider: "twilio",
    twilioSID: "",
    twilioToken: "",
    emailIntegration: true,
    emailProvider: "sendgrid",
    sendgridKey: "",
    googleBusinessIntegration: false,
    googleBusinessKey: "",
    
    // Service Types
    services: [
      { id: 1, name: "Oil Change", duration: 30, price: 150, category: "Maintenance", active: true },
      { id: 2, name: "Brake Service", duration: 60, price: 300, category: "Repair", active: true },
      { id: 3, name: "Tire Rotation", duration: 45, price: 100, category: "Maintenance", active: true },
      { id: 4, name: "Engine Diagnostic", duration: 90, price: 250, category: "Diagnostic", active: true }
    ]
  });

  const [newBranch, setNewBranch] = useState({ name: "", address: "", phone: "", manager: "", active: true });
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "advisor", branch: "", password: "" });
  const [newService, setNewService] = useState({ name: "", duration: 30, price: 0, category: "Maintenance", active: true });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleArrayChange = (arrayName, index, field, value) => {
    setSettings(prev => {
      const updatedArray = [...prev[arrayName]];
      updatedArray[index] = {
        ...updatedArray[index],
        [field]: value
      };
      return {
        ...prev,
        [arrayName]: updatedArray
      };
    });
  };

  const addNewItem = (arrayName, newItem, resetFunction) => {
    if (newItem.name && newItem.name.trim() !== "") {
      setSettings(prev => ({
        ...prev,
        [arrayName]: [...prev[arrayName], { ...newItem, id: Date.now() }]
      }));
      resetFunction({ name: "", address: "", phone: "", manager: "", active: true });
    }
  };

  const removeItem = (arrayName, id) => {
    setSettings(prev => ({
      ...prev,
      [arrayName]: prev[arrayName].filter(item => item.id !== id)
    }));
  };

  const toggleItemStatus = (arrayName, id) => {
    setSettings(prev => {
      const updatedArray = prev[arrayName].map(item => 
        item.id === id ? { ...item, active: !item.active } : item
      );
      return {
        ...prev,
        [arrayName]: updatedArray
      };
    });
  };

  const TabButton = ({ name, label, icon }) => (
    <button
      onClick={() => setActiveTab(name)}
      className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
        activeTab === name 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      <span className="mr-2">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">CRM Settings</h1>
          <p className="text-gray-600">Configure your automotive CRM system</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-6">
              <div className="space-y-2">
                <TabButton name="general" label="General" icon="⚙️" />
                <TabButton name="branches" label="Branches" icon="🏢" />
                <TabButton name="users" label="User Management" icon="👥" />
                <TabButton name="services" label="Services" icon="🔧" />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={settings.companyName}
                        onChange={(e) => handleInputChange('general', 'companyName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleInputChange('general', 'language', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="english">English</option>
                        <option value="arabic">Arabic</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => handleInputChange('general', 'timezone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                        <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                        <option value="Europe/London">Europe/London (GMT+1)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                      <select
                        value={settings.dateFormat}
                        onChange={(e) => handleInputChange('general', 'dateFormat', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                        <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                        <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Notification Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">Email Notifications</h3>
                        <p className="text-sm text-gray-600">Send notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-800">WhatsApp Notifications</h3>
                        <p className="text-sm text-gray-600">Send notifications via WhatsApp</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.whatsappNotifications}
                          onChange={(e) => handleInputChange('notifications', 'whatsappNotifications', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4 mt-4">
                      <h3 className="font-medium text-gray-800 mb-3">Notification Triggers</h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">24h before appointment</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.reminder24h}
                              onChange={(e) => handleInputChange('notifications', 'reminder24h', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">1h before appointment</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.reminder1h}
                              onChange={(e) => handleInputChange('notifications', 'reminder1h', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Service completion</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.serviceComplete}
                              onChange={(e) => handleInputChange('notifications', 'serviceComplete', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700">Feedback request</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={settings.feedbackRequest}
                              onChange={(e) => handleInputChange('notifications', 'feedbackRequest', e.target.checked)}
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Branch Management */}
              {activeTab === 'branches' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Branch Management</h2>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Add New Branch</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Branch Name"
                        value={newBranch.name}
                        onChange={(e) => setNewBranch({...newBranch, name: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={newBranch.address}
                        onChange={(e) => setNewBranch({...newBranch, address: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Phone Number"
                        value={newBranch.phone}
                        onChange={(e) => setNewBranch({...newBranch, phone: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="text"
                        placeholder="Manager Name"
                        value={newBranch.manager}
                        onChange={(e) => setNewBranch({...newBranch, manager: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => addNewItem('branches', newBranch, setNewBranch)}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add Branch
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {settings.branches.map((branch, index) => (
                      <div key={branch.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{branch.name}</h3>
                            <p className="text-sm text-gray-600">{branch.address}</p>
                            <p className="text-sm text-gray-600">{branch.phone}</p>
                            <p className="text-sm text-gray-600">Manager: {branch.manager}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={branch.active}
                                onChange={() => toggleItemStatus('branches', branch.id)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                            </label>
                            <button
                              onClick={() => removeItem('branches', branch.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Management */}
              {activeTab === 'users' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Add New User</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newUser.name}
                        onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={newUser.role}
                        onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="advisor">Service Advisor</option>
                        <option value="manager">Branch Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                      <select
                        value={newUser.branch}
                        onChange={(e) => setNewUser({...newUser, branch: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select Branch</option>
                        {settings.branches.filter(b => b.active).map(branch => (
                          <option key={branch.id} value={branch.name}>{branch.name}</option>
                        ))}
                      </select>
                      <input
                        type="password"
                        placeholder="Password"
                        value={newUser.password}
                        onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <button
                      onClick={() => addNewItem('users', newUser, setNewUser)}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add User
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left p-3">Name</th>
                          <th className="text-left p-3">Email</th>
                          <th className="text-left p-3">Role</th>
                          <th className="text-left p-3">Branch</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.users.map((user) => (
                          <tr key={user.id} className="border-b border-gray-200">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="p-3">{user.branch}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                user.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">✏️</button>
                                <button 
                                  onClick={() => toggleItemStatus('users', user.id)}
                                  className="p-1 text-gray-500 hover:bg-gray-50 rounded"
                                >
                                  {user.active ? '⏸️' : '▶️'}
                                </button>
                                <button 
                                  onClick={() => removeItem('users', user.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Integration Settings</h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800">WhatsApp Integration</h3>
                          <p className="text-sm text-gray-600">Send notifications via WhatsApp</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.whatsappIntegration}
                            onChange={(e) => handleInputChange('integrations', 'whatsappIntegration', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      {settings.whatsappIntegration && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                            <select
                              value={settings.whatsappProvider}
                              onChange={(e) => handleInputChange('integrations', 'whatsappProvider', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                              <option value="twilio">Twilio</option>
                              <option value="meta">Meta</option>
                              <option value="360dialog">360Dialog</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Account SID</label>
                            <input
                              type="text"
                              value={settings.twilioSID}
                              onChange={(e) => handleInputChange('integrations', 'twilioSID', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="Enter your Twilio SID"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Auth Token</label>
                            <input
                              type="password"
                              value={settings.twilioToken}
                              onChange={(e) => handleInputChange('integrations', 'twilioToken', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="Enter your Twilio Token"
                            />
                          </div>
                          
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            Test Connection
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800">Email Integration</h3>
                          <p className="text-sm text-gray-600">Send notifications via Email</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.emailIntegration}
                            onChange={(e) => handleInputChange('integrations', 'emailIntegration', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      {settings.emailIntegration && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                            <select
                              value={settings.emailProvider}
                              onChange={(e) => handleInputChange('integrations', 'emailProvider', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                              <option value="sendgrid">SendGrid</option>
                              <option value="smtp">SMTP</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                            <input
                              type="password"
                              value={settings.sendgridKey}
                              onChange={(e) => handleInputChange('integrations', 'sendgridKey', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="Enter your SendGrid API Key"
                            />
                          </div>
                          
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            Test Connection
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800">Google Business Integration</h3>
                          <p className="text-sm text-gray-600">Manage reviews and business profile</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.googleBusinessIntegration}
                            onChange={(e) => handleInputChange('integrations', 'googleBusinessIntegration', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                        </label>
                      </div>
                      
                      {settings.googleBusinessIntegration && (
                        <div className="mt-4 space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                            <input
                              type="password"
                              value={settings.googleBusinessKey}
                              onChange={(e) => handleInputChange('integrations', 'googleBusinessKey', e.target.value)}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                              placeholder="Enter your Google Business API Key"
                            />
                          </div>
                          
                          <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                            Connect Google Business
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Service Management */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Service Management</h2>
                  
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-blue-800 mb-2">Add New Service</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Service Name"
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      />
                      <select
                        value={newService.category}
                        onChange={(e) => setNewService({...newService, category: e.target.value})}
                        className="p-2 border border-gray-300 rounded-lg"
                      >
                        <option value="Maintenance">Maintenance</option>
                        <option value="Repair">Repair</option>
                        <option value="Diagnostic">Diagnostic</option>
                        <option value="Bodywork">Bodywork</option>
                      </select>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Duration (minutes)"
                          value={newService.duration}
                          onChange={(e) => setNewService({...newService, duration: parseInt(e.target.value)})}
                          className="p-2 border border-gray-300 rounded-lg w-full"
                        />
                        <span className="absolute right-3 top-2 text-gray-500">min</span>
                      </div>
                      <div className="relative">
                        <input
                          type="number"
                          placeholder="Price"
                          value={newService.price}
                          onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                          className="p-2 border border-gray-300 rounded-lg w-full"
                        />
                        <span className="absolute right-3 top-2 text-gray-500">SAR</span>
                      </div>
                    </div>
                    <button
                      onClick={() => addNewItem('services', newService, setNewService)}
                      className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Add Service
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="text-left p-3">Service Name</th>
                          <th className="text-left p-3">Category</th>
                          <th className="text-left p-3">Duration</th>
                          <th className="text-left p-3">Price</th>
                          <th className="text-left p-3">Status</th>
                          <th className="text-left p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.services.map((service) => (
                          <tr key={service.id} className="border-b border-gray-200">
                            <td className="p-3 font-medium">{service.name}</td>
                            <td className="p-3">
                              <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                                {service.category}
                              </span>
                            </td>
                            <td className="p-3">{service.duration} min</td>
                            <td className="p-3">{service.price} SAR</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                service.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {service.active ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex space-x-2">
                                <button className="p-1 text-blue-500 hover:bg-blue-50 rounded">✏️</button>
                                <button 
                                  onClick={() => toggleItemStatus('services', service.id)}
                                  className="p-1 text-gray-500 hover:bg-gray-50 rounded"
                                >
                                  {service.active ? '⏸️' : '▶️'}
                                </button>
                                <button 
                                  onClick={() => removeItem('services', service.id)}
                                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Backup & Restore */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Backup & Restore</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-medium text-blue-800 mb-3">Backup Data</h3>
                      <p className="text-sm text-blue-700 mb-4">Create a backup of your CRM data including customers, appointments, and settings.</p>
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Customer data</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Appointment history</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">Service records</span>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" className="mr-2" defaultChecked />
                          <span className="text-sm">System settings</span>
                        </div>
                      </div>
                      <button className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Download Backup
                      </button>
                    </div>
                    
                    <div className="p-5 bg-green-50 rounded-lg border border-green-200">
                      <h3 className="font-medium text-green-800 mb-3">Restore Data</h3>
                      <p className="text-sm text-green-700 mb-4">Restore your CRM from a previous backup file.</p>
                      <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center mb-4">
                        <p className="text-sm text-green-600">Drag & drop backup file here or</p>
                        <label htmlFor="backup-file" className="cursor-pointer text-green-500 font-medium">
                          Browse files
                        </label>
                        <input type="file" id="backup-file" className="hidden" />
                      </div>
                      <button className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        Restore Backup
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3">Auto Backup Settings</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-700">Enable automatic backups</p>
                        <p className="text-xs text-gray-500">System will automatically create backups at specified intervals</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                      </label>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Backup Frequency</label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                          <option>Daily</option>
                          <option>Weekly</option>
                          <option>Monthly</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Retention Period</label>
                        <select className="w-full p-2 border border-gray-300 rounded-lg">
                          <option>7 days</option>
                          <option>30 days</option>
                          <option>90 days</option>
                          <option>1 year</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;