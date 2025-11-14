import { useQuery } from 'react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
import IssueCard from '../components/IssueCard';

export default function Issues() {
  const { data: issues, isLoading, error } = useQuery('issues', () =>
    axios.get('/api/issues').then(res => res.data)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl mb-6">City Issues</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {issues.map(issue => (
          <IssueCard key={issue._id} issue={issue} />
        ))}
      </div>
    </div>
  );
}