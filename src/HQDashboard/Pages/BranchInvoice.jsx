import React, { useState } from "react";

export default function InvoiceForm() {
  const [items, setItems] = useState([{ desc: "Labor", qty: 1, price: 100 }]);
  const [tax, setTax] = useState(5);
  const [discount, setDiscount] = useState(0);
  const [job, setJob] = useState("");
  const [notes, setNotes] = useState("");

  const subtotal = items.reduce((sum, item) => sum + (item.qty * item.price), 0);
  const total = subtotal + (subtotal * tax / 100) - (subtotal * discount / 100);

  const addItem = () => setItems([...items, { desc: "", qty: 1, price: 0 }]);
  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-lg">
      <header className="text-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Invoice Manager</h1>
        <p className="text-gray-500">Professional Billing System</p>
      </header>

      <div className="flex border-b mb-6">
        <button className="px-6 py-3 font-medium text-indigo-600 border-b-2 border-indigo-600">+ New Invoice</button>
        <button className="px-6 py-3 font-medium text-gray-500">□ Invoices</button>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Invoice # DXB-01-INV-0001</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job</label>
            <select className="w-full p-2 border border-gray-300 rounded-lg" value={job} onChange={(e) => setJob(e.target.value)}>
              <option>Select a job</option>
              <option>Project Alpha</option>
              <option>Project Beta</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional..." className="w-full p-2 border border-gray-300 rounded-lg" />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Adjustments</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tax %</label>
            <div className="flex gap-2">
              <input type="number" value={tax} onChange={(e) => setTax(Number(e.target.value))} className="flex-1 p-2 border border-gray-300 rounded-lg" />
              {[0, 5, 10].map(rate => (
                <button key={rate} onClick={() => setTax(rate)} className={`px-3 py-2 rounded-lg ${tax === rate ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}>
                  {rate}%
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label>
            <div className="flex gap-2">
              <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="flex-1 p-2 border border-gray-300 rounded-lg" />
              {[0, 5, 10].map(rate => (
                <button key={rate} onClick={() => setDiscount(rate)} className={`px-3 py-2 rounded-lg ${discount === rate ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'}`}>
                  {rate}%
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold text-gray-800 mb-3">Items</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-600">
            <div className="col-span-6">Item</div>
            <div className="col-span-2">Qty</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 rounded-lg">
              <input value={item.desc} onChange={(e) => updateItem(index, 'desc', e.target.value)} className="col-span-6 p-2 border border-gray-300 rounded" placeholder="Description" />
              <input type="number" value={item.qty} onChange={(e) => updateItem(index, 'qty', Number(e.target.value))} className="col-span-2 p-2 border border-gray-300 rounded" />
              <input type="number" value={item.price} onChange={(e) => updateItem(index, 'price', Number(e.target.value))} className="col-span-2 p-2 border border-gray-300 rounded" />
              <div className="col-span-2 text-right font-medium">${(item.qty * item.price).toFixed(2)}</div>
              <button onClick={() => removeItem(index)} className="col-span-12 text-sm text-red-600 hover:text-red-800 text-center">Remove</button>
            </div>
          ))}
          
          <button onClick={addItem} className="flex items-center text-indigo-600 hover:text-indigo-800 mt-2 text-sm">
            <span className="text-lg mr-1">+</span> Add Item
          </button>
        </div>
      </div>

      <div className="bg-indigo-50 p-4 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Total Amount</h3>
          <span className="text-xl font-bold text-indigo-700">${total.toFixed(2)}</span>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg">Clear</button>
          <button className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Preview PDF</button>
          <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">Save (Ctrl+S)</button>
        </div>
      </div>
    </div>
  );
}