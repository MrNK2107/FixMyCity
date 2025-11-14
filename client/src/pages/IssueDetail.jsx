import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function IssueDetail() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: issue, isLoading } = useQuery(['issue', id], () =>
    axios.get(`/api/issues/${id}`).then(res => res.data)
  );

  const cosignMutation = useMutation(
    (data) => axios.post(`/api/issues/${id}/cosign`, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['issue', id]);
        queryClient.invalidateQueries('issues');
      }
    }
  );

  const handleCosign = async () => {
    try {
      await cosignMutation.mutateAsync({ comment: '', evidenceURL: '' });
      alert('Issue co-signed!');
    } catch (error) {
      alert(error.response?.data?.msg || 'Failed to co-sign');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-4">{issue.title}</h1>
      <p className="mb-4">{issue.description}</p>
      <div className="mb-4">
        <strong>Category:</strong> {issue.category}
      </div>
      <div className="mb-4">
        <strong>Location:</strong> {issue.location.lat}, {issue.location.lng}
      </div>
      <div className="mb-4">
        <strong>Status:</strong>{' '}
        <span className={`px-2 py-1 rounded ${
          issue.status === 'Resolved' ? 'bg-green-200 text-green-800' :
          issue.status === 'In Progress' ? 'bg-yellow-200 text-yellow-800' :
          'bg-red-200 text-red-800'
        }`}>
          {issue.status}
        </span>
      </div>

      {issue.mediaURLs && (
        <div className="mb-4">
          <h3 className="mb-2">Media</h3>
          <div className="grid gap-4">
            {issue.mediaURLs.map((url, i) => (
              <img key={i} src={url} alt={`Issue media ${i}`} className="max-h-64" />
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={handleCosign}
        disabled={!user || issue.status === 'Resolved'}
        className="bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Co-Sign This Issue
      </button>

      {issue.proofBefore && (
        <div className="mt-8">
          <h3 className="text-xl mb-2">Resolution Proof</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="mb-1">Before</h4>
              <img src={issue.proofBefore} alt="Before repair" className="max-h-64" />
            </div>
            <div>
              <h4 className="mb-1">After</h4>
              <img src={issue.proofAfter} alt="After repair" className="max-h-64" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}