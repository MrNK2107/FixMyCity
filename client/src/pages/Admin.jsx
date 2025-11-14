import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Admin() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: issues, isLoading } = useQuery('issues', () =>
    axios.get('/api/issues').then(res => res.data)
  );

  const resolveMutation = useMutation(
    (formData) => axios.post(`/api/issues/${formData.id}/resolve`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('issues');
      }
    }
  );

  const handleResolve = async (id, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    resolveMutation.mutateAsync({ id, formData });
  };

  if (isLoading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return <div>Access Denied</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6">Admin Panel</h1>
      <div className="grid gap-6">
        {issues
          .filter(issue => issue.status !== 'Resolved')
          .map(issue => (
            <div key={issue._id} className="bg-white p-4 rounded shadow">
              <h3 className="text-xl mb-2">{issue.title}</h3>
              <p>{issue.description}</p>
              <form onSubmit={(e) => handleResolve(issue._id, e)} className="mt-4">
                <div className="mb-4">
                  <label className="block mb-2">Before Photo</label>
                  <input type="file" name="proofBefore" required />
                </div>
                <div className="mb-4">
                  <label className="block mb-2">After Photo</label>
                  <input type="file" name="proofAfter" required />
                </div>
                <button 
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Mark as Resolved
                </button>
              </form>
            </div>
          ))}
      </div>
    </div>
  );
}