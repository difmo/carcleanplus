import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaSpinner, FaExclamationTriangle, FaEnvelope, FaCalendarAlt } from 'react-icons/fa';
import { fetchWithAuth } from '../../../utils/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await fetchWithAuth('/api/admin/contacts');
      setContacts(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    return contacts.filter((contact) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.email?.toLowerCase().includes(searchLower) ||
        contact.phone?.includes(searchLower) ||
        contact.subject?.toLowerCase().includes(searchLower) ||
        contact.message?.toLowerCase().includes(searchLower)
      );
    });
  }, [contacts, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Customer Inquiries</h1>
          <p className="text-gray-500 text-sm mt-1">View messages received from the Contact Us form</p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0052cc] focus:border-transparent text-sm w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 flex flex-col overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-400">
            <FaSpinner className="animate-spin text-4xl mb-4 text-[#0052cc]" />
            <p className="font-medium">Loading inquiries...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-red-500">
            <FaExclamationTriangle className="text-4xl mb-4" />
            <p className="font-bold text-lg">{error}</p>
            <button 
              onClick={fetchContacts}
              className="mt-4 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 py-20 text-gray-400">
            <FaEnvelope className="text-5xl mb-4 text-gray-300" />
            <p className="font-bold text-lg text-gray-600">No messages found</p>
            <p className="text-sm mt-1">Try adjusting your search.</p>
          </div>
        ) : (
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 font-bold">
                  <th className="p-3 pl-4">Date</th>
                  <th className="p-3">Sender Details</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3 w-1/3">Message</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredContacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3 pl-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 text-[12px] flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(contact.createdAt)}
                      </div>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <div className="font-bold text-gray-900 text-[13px]">{contact.name}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{contact.email}</div>
                      <div className="text-[11px] text-gray-500 mt-0.5">{contact.phone}</div>
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-[#0052cc] text-[13px]">{contact.subject}</div>
                    </td>
                    <td className="p-3">
                      <div className="text-[12px] text-gray-700 leading-relaxed max-w-sm">
                        {contact.message}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
