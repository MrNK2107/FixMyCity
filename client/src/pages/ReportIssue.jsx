import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function ReportIssue() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Pothole');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [files, setFiles] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('location', JSON.stringify({ lat: parseFloat(lat), lng: parseFloat(lng) }));
    files.forEach(file => formData.append('media', file));

    try {
      await axios.post('/api/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/issues');
    } catch (error) {
      alert(error.response?.data?.msg || 'Error creating issue');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl mb-4">Report an Issue</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Title</label>
          <input
            className="w-full px-3 py-2 border rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Description</label>
          <textarea
            className="w-full px-3 py-2 border rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Category</label>
          <select
            className="w-full px-3 py-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Pothole">Pothole</option>
            <option value="Garbage">Garbage</option>
            <option value="Water Leak">Water Leak</option>
            <option value="Street Light">Street Light</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className="mb-4 grid grid-cols-2 gap-2">
          <div>
            <label className="block mb-2">Latitude</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block mb-2">Longitude</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Photos/Videos</label>
          <input
            type="file"
            multiple
            className="w-full"
            onChange={(e) => setFiles([...e.target.files])}
          />
        </div>
        <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded">
          Submit Issue
        </button>
      </form>
    </div>
  );
}