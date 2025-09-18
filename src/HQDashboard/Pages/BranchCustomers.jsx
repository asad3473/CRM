import React, { useState } from "react";
import { Download, Plus, Search, X, Table as TableIcon, LayoutGrid, Star, Phone, Mail, Globe, Tag, Car } from "lucide-react";

export default function BranchCustomers() {
  const [search, setSearch] = useState("");
  const [view, setView] = useState("cards");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [viewCustomer, setViewCustomer] = useState(null);
  const customersPerPage = 6;

  const [customers, setCustomers] = useState([
    { id: 1, name: "Ali Hassan", phone: "0501234567", email: "ali@example.com", language: "Arabic", tags: ["VIP"], cars: ["Toyota Corolla 2020"], serviceHistory: ["Oil Change - Jan 2025"], feedback: { rating: 5, comment: "Great service!" } },
    { id: 2, name: "Sarah Ahmed", phone: "0502345678", email: "sarah@example.com", language: "English", tags: ["Loyal"], cars: ["Honda Civic 2019"], serviceHistory: ["Tire Replacement - Dec 2024"], feedback: { rating: 4, comment: "Very satisfied!" } },
    { id: 3, name: "Omar Khan", phone: "0503456789", email: "omar@example.com", language: "Urdu", tags: ["New"], cars: ["Hyundai Elantra 2021"], serviceHistory: ["Brake Check - Nov 2024"], feedback: { rating: 3, comment: "Good but can improve." } },
    { id: 4, name: "Fatima Noor", phone: "0504567890", email: "fatima@example.com", language: "English", tags: ["VIP", "Loyal"], cars: ["Kia Sportage 2022"], serviceHistory: ["Engine Check - Oct 2024"], feedback: { rating: 5, comment: "Excellent service!" } },
    { id: 5, name: "Mohammed Ali", phone: "0505678901", email: "mohammed@example.com", language: "Arabic", tags: ["Regular"], cars: ["Nissan Altima 2020"], serviceHistory: ["Battery Change - Sep 2024"], feedback: { rating: 4, comment: "Reliable service." } },
    { id: 6, name: "Aisha Siddiqui", phone: "0506789012", email: "aisha@example.com", language: "English", tags: ["Premium"], cars: ["Tesla Model 3 2023"], serviceHistory: ["Software Update - Aug 2024"], feedback: { rating: 5, comment: "Amazing experience!" } },
    { id: 7, name: "Hassan Raza", phone: "0507890123", email: "hassan@example.com", language: "Urdu", tags: ["New"], cars: ["Ford Explorer 2018"], serviceHistory: ["AC Service - Jul 2024"], feedback: { rating: 3, comment: "Satisfactory." } },
  ]);

  const [newCustomer, setNewCustomer] = useState({
    name: "", phone: "", email: "", language: "English", tags: [], cars: [], serviceHistory: [], feedback: { rating: 0, comment: "" }
  });

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    c.phone.includes(search) || 
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / customersPerPage);
  const startIndex = (currentPage - 1) * customersPerPage;
  const currentCustomers = filtered.slice(startIndex, startIndex + customersPerPage);

  const exportList = (type) => alert(`Exporting customers as ${type}`);

  const handleSaveCustomer = () => {
    if (!newCustomer.name || !newCustomer.phone || !newCustomer.email) {
      alert("⚠ Please fill all required fields!");
      return;
    }

    if (editMode) {
      setCustomers(customers.map(c => c.id === newCustomer.id ? newCustomer : c));
    } else {
      setCustomers([...customers, { ...newCustomer, id: Date.now() }]);
    }

    setNewCustomer({ name: "", phone: "", email: "", language: "English", tags: [], cars: [], serviceHistory: [], feedback: { rating: 0, comment: "" } });
    setShowModal(false);
    setEditMode(false);
  };

  const handleEdit = (customer) => {
    setNewCustomer(customer);
    setEditMode(true);
    setShowModal(true);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
    ));
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Customers Management</h1>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} customers found</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => exportList("Excel")} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
            <Download className="w-4 h-4" /> Excel
          </button>
          <button onClick={() => exportList("PDF")} className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button onClick={() => { setShowModal(true); setEditMode(false); }} className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">
            <Plus className="w-4 h-4" /> Add
          </button>
          <button onClick={() => setView(view === "cards" ? "table" : "cards")} className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition">
            {view === "cards" ? <TableIcon className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
            {view === "cards" ? "Table" : "Cards"}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          type="text"
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
        />
      </div>

      {/* View Modes */}
      {view === "cards" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {currentCustomers.map(c => (
            <div key={c.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-gray-800 text-lg">{c.name}</h3>
                <div className="flex gap-1">{renderStars(c.feedback.rating)}</div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{c.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{c.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span>{c.language}</span>
                </div>
                {c.tags.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Car className="w-3.5 h-3.5" />
                  <span>{c.cars.length} car(s)</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(c)} className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                    Edit
                  </button>
                  <button onClick={() => setViewCustomer(c)} className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-gray-600 font-medium">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Language</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-4 text-center">Cars</th>
                <th className="py-3 px-4 text-center">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {currentCustomers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-800">{c.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-gray-600">{c.phone}</div>
                    <div className="text-gray-500 text-xs">{c.email}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">{c.language}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {c.tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs">{tag}</span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">{c.cars.length}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center">{renderStars(c.feedback.rating)}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(c)} className="text-xs px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                        Edit
                      </button>
                      <button onClick={() => setViewCustomer(c)} className="text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(p => p - 1)}
            className="p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-8 h-8 rounded-lg text-sm ${currentPage === i + 1 ? "bg-indigo-600 text-white" : "border hover:bg-gray-100"}`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(p => p + 1)}
            className="p-2 rounded-lg border disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {editMode ? "Edit Customer" : "Add New Customer"}
            </h2>
            <div className="space-y-3">
              {["name", "phone", "email"].map(field => (
                <input
                  key={field}
                  type={field === "email" ? "email" : "text"}
                  placeholder={field === "name" ? "Full Name" : field === "phone" ? "Phone Number" : "Email Address"}
                  value={newCustomer[field]}
                  onChange={e => setNewCustomer({ ...newCustomer, [field]: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              ))}
              <select
                value={newCustomer.language}
                onChange={e => setNewCustomer({ ...newCustomer, language: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option>English</option>
                <option>Arabic</option>
                <option>Urdu</option>
              </select>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                Cancel
              </button>
              <button onClick={handleSaveCustomer} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                {editMode ? "Update" : "Add"} Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-5 relative">
            <button onClick={() => setViewCustomer(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Personal Information</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-500">Name</div>
                    <div className="font-medium">{viewCustomer.name}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Language</div>
                    <div className="font-medium">{viewCustomer.language}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Phone</div>
                    <div className="font-medium">{viewCustomer.phone}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-500">Email</div>
                    <div className="font-medium">{viewCustomer.email}</div>
                  </div>
                </div>
              </div>
              
              {viewCustomer.tags.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-1">Tags</h3>
                  <div className="flex flex-wrap gap-1">
                    {viewCustomer.tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Cars</h3>
                <ul className="text-sm space-y-1">
                  {viewCustomer.cars.map((car, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <Car className="w-4 h-4 text-gray-400" />
                      <span>{car}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Service History</h3>
                <ul className="text-sm space-y-1">
                  {viewCustomer.serviceHistory.map((service, i) => (
                    <li key={i} className="text-gray-600">{service}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Feedback</h3>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">{renderStars(viewCustomer.feedback.rating)}</div>
                  <span className="text-sm text-gray-600">({viewCustomer.feedback.rating}/5)</span>
                </div>
                <p className="text-sm text-gray-700">{viewCustomer.feedback.comment}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}