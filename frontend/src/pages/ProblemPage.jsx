import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router";
import axiosClient from "../utils/axiosClient";
import SubmissionHistory from "../components/SubmissionHistory";
import ChatAi from "../components/ChatAi";
import Editorial from "../components/Editorial";

const langMap = {
  cpp: "C++",
  java: "Java",
  javascript: "JavaScript",
};

const ProblemPage = () => {
  const [problem, setProblem] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [runResult, setRunResult] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [activeLeftTab, setActiveLeftTab] = useState("description");
  const [activeRightTab, setActiveRightTab] = useState("code");
  const editorRef = useRef(null);
  let { problemId } = useParams();

  const { handleSubmit } = useForm();

  useEffect(() => {
    const fetchProblem = async () => {
      setLoading(true);
      try {
        const response = await axiosClient.get(
          `/problem/problemById/${problemId}`,
        );

        const initialCode = response.data.startCode.find(
          (sc) => sc.language === langMap[selectedLanguage],
        ).initialCode;

        setProblem(response.data);

        setCode(initialCode);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching problem:", error);
        setLoading(false);
      }
    };

    fetchProblem();
  }, [problemId]);

  // Update code when language changes
  useEffect(() => {
    if (problem) {
      const initialCode = problem.startCode.find(
        (sc) => sc.language === langMap[selectedLanguage],
      ).initialCode;
      setCode(initialCode);
    }
  }, [selectedLanguage, problem]);

  const handleEditorChange = (value) => {
    setCode(value || "");
  };

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
  };

  const handleRun = async () => {
    setLoading(true);
    setRunResult(null);

    try {
      const response = await axiosClient.post(`/submission/run/${problemId}`, {
        code,
        language: selectedLanguage,
      });

      setRunResult(response.data);
      setLoading(false);
      setActiveRightTab("testcase");
    } catch (error) {
      console.error("Error running code:", error);
      setRunResult({
        success: false,
        error: "Internal server error",
      });
      setLoading(false);
      setActiveRightTab("testcase");
    }
  };

  const handleSubmitCode = async () => {
    setLoading(true);
    setSubmitResult(null);

    try {
      const response = await axiosClient.post(
        `/submission/submit/${problemId}`,
        {
          code: code,
          language: selectedLanguage,
        },
      );

      setSubmitResult(response.data);
      setLoading(false);
      setActiveRightTab("result");
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmitResult(null);
      setLoading(false);
      setActiveRightTab("result");
    }
  };

  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      default:
        return "javascript";
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "text-green-500";
      case "medium":
        return "text-yellow-500";
      case "hard":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading && !problem) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-base-200 text-base-content">
      {/* Left Panel */}
      <div className="w-1/2 flex flex-col border-r border-base-300 bg-base-100">
        {/* Left Tabs */}
        <div className="tabs tabs-bordered px-4 py-2 bg-base-100 sticky top-0 z-10">
          {[
            "description",
            "editorial",
            "solutions",
            "submissions",
            "chatAI",
          ].map((tab) => (
            <button
              key={tab}
              className={`tab text-sm font-medium ${
                activeLeftTab === tab
                  ? "tab-active text-primary"
                  : "text-base-content/60"
              }`}
              onClick={() => setActiveLeftTab(tab)}
            >
              {tab === "chatAI"
                ? "Chat AI"
                : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {problem && (
            <>
              {activeLeftTab === "description" && (
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                      {problem.title}
                    </h1>
                    <span
                      className={`badge badge-outline text-xs ${getDifficultyColor(problem.difficulty)}`}
                    >
                      {problem.difficulty.toUpperCase()}
                    </span>
                    <span className="badge badge-primary badge-outline text-xs">
                      {problem.tags}
                    </span>
                  </div>

                  <div className="text-sm leading-relaxed whitespace-pre-wrap text-base-content/80">
                    {problem.description}
                  </div>

                  <div className="mt-10 space-y-4">
                    <h3 className="text-lg font-semibold">Examples</h3>
                    {problem.visibleTestCases.map((example, index) => (
                      <div key={index} className="rounded-xl bg-base-200 p-4">
                        <h4 className="font-semibold mb-2">
                          Example {index + 1}
                        </h4>
                        <div className="font-mono text-xs space-y-1">
                          <p>
                            <strong>Input:</strong> {example.input}
                          </p>
                          <p>
                            <strong>Output:</strong> {example.output}
                          </p>
                          <p>
                            <strong>Explanation:</strong> {example.explanation}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeLeftTab === "editorial" && (
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Editorial</h2>
                  <Editorial {...problem} />
                </div>
              )}

              {activeLeftTab === "solutions" && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold">Solutions</h2>
                  {problem.referenceSolution?.map((solution, index) => (
                    <div
                      key={index}
                      className="border border-base-300 rounded-xl overflow-hidden"
                    >
                      <div className="bg-base-200 px-4 py-2 text-sm font-semibold">
                        {solution.language}
                      </div>
                      <pre className="bg-base-300 p-4 text-xs overflow-x-auto">
                        <code>{solution.completeCode}</code>
                      </pre>
                    </div>
                  )) || (
                    <p className="text-base-content/50 text-sm">
                      Solve the problem to unlock solutions.
                    </p>
                  )}
                </div>
              )}

              {activeLeftTab === "submissions" && (
                <SubmissionHistory problemId={problemId} />
              )}

              {activeLeftTab === "chatAI" && <ChatAi problem={problem} />}
            </>
          )}
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col bg-base-100">
        {/* Right Tabs */}
        <div className="tabs tabs-bordered px-4 py-2 bg-base-100 border-b border-base-300">
          {["code", "testcase", "result"].map((tab) => (
            <button
              key={tab}
              className={`tab text-sm font-medium ${
                activeRightTab === tab
                  ? "tab-active text-primary"
                  : "text-base-content/60"
              }`}
              onClick={() => setActiveRightTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Code Panel */}
        {activeRightTab === "code" && (
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-base-300">
              {["javascript", "java", "cpp"].map((lang) => (
                <button
                  key={lang}
                  className={`btn btn-xs ${
                    selectedLanguage === lang ? "btn-primary" : "btn-ghost"
                  }`}
                  onClick={() => handleLanguageChange(lang)}
                >
                  {lang === "cpp"
                    ? "C++"
                    : lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>

            <div className="flex-1">
              <Editor
                height="100%"
                language={getLanguageForMonaco(selectedLanguage)}
                value={code}
                onChange={handleEditorChange}
                onMount={handleEditorDidMount}
                theme="vs-dark"
                options={{ fontSize: 14, minimap: { enabled: false } }}
              />
            </div>

            <div className="px-4 py-3 border-t border-base-300 flex justify-end gap-2">
              <button
                className="btn btn-outline btn-sm"
                onClick={handleRun}
                disabled={loading}
              >
                Run
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSubmitCode}
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemPage;
