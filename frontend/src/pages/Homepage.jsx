import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import axiosClient from "../utils/axiosClient";
import { logoutUser } from "../authSlice";

function Homepage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [filters, setFilters] = useState({
    difficulty: "all",
    tag: "all",
    status: "all",
  });

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/getAllProblem");
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      }
    };

    const fetchSolvedProblems = async () => {
      try {
        const { data } = await axiosClient.get("/problem/problemSolvedByUser");
        setSolvedProblems(data);
      } catch (error) {
        console.error("Error fetching solved problems:", error);
      }
    };

    fetchProblems();
    if (user) fetchSolvedProblems();
  }, [user]);

  const handleLogout = () => {
    dispatch(logoutUser());
    setSolvedProblems([]);
  };

  const filteredProblems = problems.filter((problem) => {
    const difficultyMatch =
      filters.difficulty === "all" || problem.difficulty === filters.difficulty;
    const tagMatch = filters.tag === "all" || problem.tags === filters.tag;
    const statusMatch =
      filters.status === "all" ||
      solvedProblems.some((sp) => sp._id === problem._id);
    return difficultyMatch && tagMatch && statusMatch;
  });

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-base-100 border-b border-base-300 px-4">
        <div className="navbar max-w-7xl mx-auto">
          <div className="flex-1">
            <NavLink
              to="/"
              className="text-xl font-bold tracking-tight hover:text-primary"
            >
              LeetCodeX - AI Powered Competetive Coding Platform
            </NavLink>
          </div>

          <div className="flex-none gap-3">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                className="btn btn-ghost btn-sm rounded-full px-4"
              >
                {user?.firstName}
              </div>
              <ul className="mt-2 p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-xl w-44">
                {user.role == "admin" && (
                  <li>
                    <NavLink to="/admin">Admin</NavLink>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="text-error">
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <select
            className="select select-bordered select-sm w-full sm:w-auto"
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="all">All Problems</option>
            <option value="solved">Solved</option>
          </select>

          <select
            className="select select-bordered select-sm w-full sm:w-auto"
            value={filters.difficulty}
            onChange={(e) =>
              setFilters({ ...filters, difficulty: e.target.value })
            }
          >
            <option value="all">Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <select
            className="select select-bordered select-sm w-full sm:w-auto"
            value={filters.tag}
            onChange={(e) => setFilters({ ...filters, tag: e.target.value })}
          >
            <option value="all">Tag</option>
            <option value="array">Array</option>
            <option value="linkedList">Linked List</option>
            <option value="graph">Graph</option>
            <option value="dp">DP</option>
          </select>
        </div>

        {filteredProblems.length === 0 && (
          <div className="text-center py-16 text-base-content/60">
            <p className="text-lg font-semibold">0 problems available</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        )}

        {/* Problems */}
        <div className="grid gap-3">
          {filteredProblems.map((problem) => (
            <div
              key={problem._id}
              className="bg-base-100 rounded-xl border border-base-300 hover:border-primary transition"
            >
              <div className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <NavLink
                    to={`/problem/${problem._id}`}
                    className="text-lg font-semibold hover:text-primary"
                  >
                    {problem.title}
                  </NavLink>

                  <div className="flex gap-2">
                    <div
                      className={`badge badge-sm ${getDifficultyBadgeColor(
                        problem.difficulty,
                      )}`}
                    >
                      {problem.difficulty}
                    </div>
                    <div className="badge badge-sm badge-outline">
                      {problem.tags}
                    </div>
                  </div>
                </div>

                {solvedProblems.some((sp) => sp._id === problem._id) && (
                  <div className="badge badge-success gap-1 self-start sm:self-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Solved
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const getDifficultyBadgeColor = (difficulty) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "badge-success";
    case "medium":
      return "badge-warning";
    case "hard":
      return "badge-error";
    default:
      return "badge-neutral";
  }
};

export default Homepage;
