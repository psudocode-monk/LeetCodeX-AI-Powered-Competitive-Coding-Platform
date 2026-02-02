import { useEffect, useState } from "react";
import axiosClient from "../utils/axiosClient";
import { NavLink } from "react-router";

const AdminVideo = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const { data } = await axiosClient.get("/problem/getAllProblem");
      setProblems(data);
    } catch (err) {
      setError("Failed to fetch problems");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this problem?"))
      return;

    try {
      await axiosClient.delete(`/video/delete/${id}`);
      setProblems(problems.filter((problem) => problem._id !== id));
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 mt-6">
        <div className="alert alert-error rounded-xl shadow-sm">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
              />
            </svg>
            <span className="text-sm font-medium">
              {error.response?.data?.error || error}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-1">
          Video Upload & Delete
        </h1>
        <p className="text-sm text-base-content/60">
          Manage video solutions for problems
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100">
        <table className="table w-full">
          <thead className="bg-base-200 text-sm">
            <tr>
              <th className="w-12">#</th>
              <th>Title</th>
              <th className="w-32">Difficulty</th>
              <th className="w-40">Tags</th>
              <th className="w-40 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {problems.map((problem, index) => (
              <tr key={problem._id} className="hover:bg-base-200/60 transition">
                <td className="font-mono text-sm">{index + 1}</td>

                <td className="font-medium">{problem.title}</td>

                <td>
                  <span
                    className={`badge badge-sm ${
                      problem.difficulty === "Easy"
                        ? "badge-success"
                        : problem.difficulty === "Medium"
                          ? "badge-warning"
                          : "badge-error"
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </td>

                <td>
                  <span className="badge badge-outline badge-sm">
                    {problem.tags}
                  </span>
                </td>

                <td className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <NavLink
                      to={`/admin/upload/${problem._id}`}
                      className="btn btn-sm btn-primary"
                    >
                      Upload
                    </NavLink>
                    <button
                      onClick={() => handleDelete(problem._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {problems.length === 0 && (
          <div className="text-center py-16 text-base-content/60">
            <p className="font-semibold">0 problems available</p>
            <p className="text-sm mt-1">Nothing to manage</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminVideo;
