import { Link } from 'react-router-dom';

export default function IssueCard({ issue }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-xl font-bold">{issue.title}</h3>
      <p className="text-gray-600">{issue.description.substring(0, 100)}...</p>
      <div className="flex justify-between items-center mt-4">
        <span className={`px-2 py-1 rounded ${
          issue.status === 'Resolved' ? 'bg-green-200 text-green-800' :
          issue.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
          'bg-red-200 text-red-800'
        }`}>
          {issue.status}
        </span>
        <Link 
          to={`/issue/${issue._id}`}
          className="text-blue-800 hover:underline"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}