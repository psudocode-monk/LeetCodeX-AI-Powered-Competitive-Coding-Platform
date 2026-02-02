import { useState, useEffect } from "react";
import axiosClient from "../utils/axiosClient";

const SubmissionHistory = ({ problemId }) => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(
          `/problem/submittedProblem/${problemId}`,
        );
        setSubmissions(response.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch submission history");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [problemId]);

  const getStatusColor = (status) => {
    switch (status) {
      case "accepted":
        return "badge-success";
      case "wrong":
        return "badge-error";
      case "error":
        return "badge-warning";
      case "pending":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  const formatMemory = (memory) => {
    if (memory < 1024) return `${memory} kB`;
    return `${(memory / 1024).toFixed(2)} MB`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error shadow-lg my-4">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">
        Submission History
      </h2>

      {submissions.length === 0 ? (
        <div className="rounded-xl border border-base-300 bg-base-100 p-6 text-center text-base-content/60">
          <p className="font-semibold">0 submissions available</p>
          <p className="text-sm mt-1">Solve the problem to see your history</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
            <table className="table w-full">
              <thead className="bg-base-200 text-sm">
                <tr>
                  <th className="w-12">#</th>
                  <th>Language</th>
                  <th>Status</th>
                  <th>Runtime</th>
                  <th>Memory</th>
                  <th>Test Cases</th>
                  <th>Submitted</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {submissions.map((sub, index) => (
                  <tr key={sub._id} className="hover:bg-base-200/60 transition">
                    <td className="font-mono text-sm">{index + 1}</td>

                    <td className="font-mono text-sm">{sub.language}</td>

                    <td>
                      <span
                        className={`badge badge-sm ${getStatusColor(sub.status)}`}
                      >
                        {sub.status.charAt(0).toUpperCase() +
                          sub.status.slice(1)}
                      </span>
                    </td>

                    <td className="font-mono text-sm">{sub.runtime}s</td>

                    <td className="font-mono text-sm">
                      {formatMemory(sub.memory)}
                    </td>

                    <td className="font-mono text-sm">
                      {sub.testCasesPassed}/{sub.testCasesTotal}
                    </td>

                    <td className="text-sm">{formatDate(sub.createdAt)}</td>

                    <td className="text-center">
                      <button
                        className="btn btn-xs btn-outline"
                        onClick={() => setSelectedSubmission(sub)}
                      >
                        View Code
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-xs text-base-content/60">
            Showing {submissions.length} submissions
          </p>
        </>
      )}

      {/* Modal */}
      {selectedSubmission && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl rounded-2xl">
            <h3 className="text-lg font-bold mb-4">
              Submission Details — {selectedSubmission.language}
            </h3>

            <div className="flex flex-wrap gap-2 mb-4">
              <span
                className={`badge ${getStatusColor(selectedSubmission.status)}`}
              >
                {selectedSubmission.status}
              </span>
              <span className="badge badge-outline">
                Runtime: {selectedSubmission.runtime}s
              </span>
              <span className="badge badge-outline">
                Memory: {formatMemory(selectedSubmission.memory)}
              </span>
              <span className="badge badge-outline">
                Passed: {selectedSubmission.testCasesPassed}/
                {selectedSubmission.testCasesTotal}
              </span>
            </div>

            {selectedSubmission.errorMessage && (
              <div className="rounded-xl bg-error/10 text-error text-sm p-3 mb-4">
                {selectedSubmission.errorMessage}
              </div>
            )}

            <pre className="bg-neutral text-neutral-content rounded-xl p-4 text-sm overflow-x-auto">
              <code>{selectedSubmission.code}</code>
            </pre>

            <div className="modal-action">
              <button
                className="btn btn-sm"
                onClick={() => setSelectedSubmission(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionHistory;
