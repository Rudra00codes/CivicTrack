import { useParams } from "react-router-dom";

const IssueDetail = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Issue Details</h1>
      <p>Issue ID: {id}</p>
    </div>
  );
};

export default IssueDetail;
