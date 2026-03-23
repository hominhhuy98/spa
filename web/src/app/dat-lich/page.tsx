'use client';

import { useState } from 'react';

export default function DatLich() {
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', date: '', notes: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', service: '', date: '', notes: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary text-center mb-8">Đặt Lịch Khám Trực Tuyến</h1>
      <div className="bg-white p-8 rounded-xl shadow-lg">
        {status === 'success' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6 text-center">
            Đăng ký thành công! Bệnh viện sẽ liên hệ với bạn trong vòng 2 giờ.
          </div>
        )}
        {status === 'error' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-center">
            Có lỗi xảy ra, vui lòng thử lại sau!
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Họ và Tên</label>
              <input required type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                     value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
              <input required type="tel" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                     value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">Dịch vụ quan tâm</label>
              <select required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                <option value="">-- Chọn dịch vụ --</option>
                <option value="Da liễu">Khám Da liễu</option>
                <option value="Spa">Chăm sóc Thẩm mỹ (Spa)</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Ngày dự kiến</label>
              <input required type="date" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none" 
                     value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ghi chú thêm</label>
            <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary outline-none h-32" 
                      value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
          </div>
          <button type="submit" disabled={status === 'loading'} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">
            {status === 'loading' ? 'Đang gửi...' : 'Gửi Đăng Ký'}
          </button>
        </form>
      </div>
    </div>
  );
}
