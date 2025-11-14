import { useQuery } from 'react-query';
import axios from 'axios';

export default function Dashboard() {
  const { data, isLoading } = useQuery('dashboard', () =>
    axios.get('/api/dashboard/stats').then(res => res.data)
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6">City Service Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-blue-100 p-6 rounded shadow">
          <h3 className="text-xl mb-2">Total Issues</h3>
          <p className="text-3xl font-bold">{data.totalIssues}</p>
        </div>
        <div className="bg-green-100 p-6 rounded shadow">
          <h3 className="text-xl mb-2">Resolved</h3>
          <p className="text-3xl font-bold">{data.resolved}</p>
        </div>
        <div className="bg-red-100 p-6 rounded shadow">
          <h3 className="text-xl mb-2">Pending</h3>
          <p className="text-3xl font-bold">{data.pending}</p>
        </div>
      </div>
      <div className="mt-8 bg-gray-100 p-6 rounded shadow">
        <h3 className="text-xl mb-2">Average Response Time</h3>
        <p className="text-3xl font-bold">{data.avgResponseTime.toFixed(1)} days</p>
      </div>
    </div>
  );
}