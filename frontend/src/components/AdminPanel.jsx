import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosClient from "../utils/axiosClient";
import { useNavigate } from "react-router";

const problemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  difficulty: z.enum(["easy", "medium", "hard"]),
  tags: z.enum(["array", "linkedList", "graph", "dp"]),
  visibleTestCases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
        explanation: z.string(),
      }),
    )
    .min(1),
  hiddenTestCases: z
    .array(
      z.object({
        input: z.string(),
        output: z.string(),
      }),
    )
    .min(1),
  startCode: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        initialCode: z.string(),
      }),
    )
    .length(3),
  referenceSolution: z
    .array(
      z.object({
        language: z.enum(["C++", "Java", "JavaScript"]),
        completeCode: z.string(),
      }),
    )
    .length(3),
});

function AdminPanel() {
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(problemSchema),
    defaultValues: {
      startCode: [
        { language: "C++", initialCode: "" },
        { language: "Java", initialCode: "" },
        { language: "JavaScript", initialCode: "" },
      ],
      referenceSolution: [
        { language: "C++", completeCode: "" },
        { language: "Java", completeCode: "" },
        { language: "JavaScript", completeCode: "" },
      ],
    },
  });

  const {
    fields: visibleFields,
    append: addVisible,
    remove: removeVisible,
  } = useFieldArray({ control, name: "visibleTestCases" });

  const {
    fields: hiddenFields,
    append: addHidden,
    remove: removeHidden,
  } = useFieldArray({ control, name: "hiddenTestCases" });

  const onSubmit = async (data) => {
    await axiosClient.post("/problem/create", data);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-6xl mx-auto px-4 space-y-12">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Create Problem</h1>
          <p className="text-base-content/60 mt-2">
            Define the problem, test cases, and reference solutions
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
          {/* Basic Info */}
          <section className="bg-base-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Basic Information</h2>

            <div className="space-y-6">
              <input
                {...register("title")}
                placeholder="Problem title"
                className="input input-bordered h-12 w-full text-base"
              />

              <textarea
                {...register("description")}
                placeholder="Describe the problem clearly with constraints and examples"
                className="textarea textarea-bordered min-h-[220px] text-sm leading-relaxed"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  {...register("difficulty")}
                  className="select select-bordered h-12"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>

                <select
                  {...register("tags")}
                  className="select select-bordered h-12"
                >
                  <option value="array">Array</option>
                  <option value="linkedList">Linked List</option>
                  <option value="graph">Graph</option>
                  <option value="dp">DP</option>
                </select>
              </div>
            </div>
          </section>

          {/* Test Cases */}
          <section className="bg-base-100 rounded-3xl p-8 shadow-sm space-y-10">
            <h2 className="text-xl font-semibold">Test Cases</h2>

            {/* Visible */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Visible Test Cases</h3>
                <button
                  type="button"
                  onClick={() =>
                    addVisible({ input: "", output: "", explanation: "" })
                  }
                  className="btn btn-sm btn-primary"
                >
                  Add
                </button>
              </div>

              {visibleFields.map((_, i) => (
                <div key={i} className="bg-base-200 rounded-xl p-5 space-y-3">
                  <textarea
                    {...register(`visibleTestCases.${i}.input`)}
                    placeholder="Input"
                    className="textarea textarea-bordered"
                  />
                  <textarea
                    {...register(`visibleTestCases.${i}.output`)}
                    placeholder="Output"
                    className="textarea textarea-bordered"
                  />
                  <textarea
                    {...register(`visibleTestCases.${i}.explanation`)}
                    placeholder="Explanation"
                    className="textarea textarea-bordered"
                  />
                  <button
                    onClick={() => removeVisible(i)}
                    type="button"
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            {/* Hidden */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Hidden Test Cases</h3>
                <button
                  type="button"
                  onClick={() => addHidden({ input: "", output: "" })}
                  className="btn btn-sm btn-primary"
                >
                  Add
                </button>
              </div>

              {hiddenFields.map((_, i) => (
                <div key={i} className="bg-base-200 rounded-xl p-5 space-y-3">
                  <textarea
                    {...register(`hiddenTestCases.${i}.input`)}
                    placeholder="Input"
                    className="textarea textarea-bordered"
                  />
                  <textarea
                    {...register(`hiddenTestCases.${i}.output`)}
                    placeholder="Output"
                    className="textarea textarea-bordered"
                  />
                  <button
                    onClick={() => removeHidden(i)}
                    type="button"
                    className="btn btn-xs btn-error"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Code */}
          <section className="bg-base-100 rounded-3xl p-8 shadow-sm space-y-10">
            <h2 className="text-xl font-semibold">Code Templates</h2>

            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <h3 className="font-medium">
                  {i === 0 ? "C++" : i === 1 ? "Java" : "JavaScript"}
                </h3>

                <textarea
                  {...register(`startCode.${i}.initialCode`)}
                  placeholder="Starter code"
                  className="w-full font-mono text-sm bg-neutral text-neutral-content rounded-xl p-4 min-h-[160px]"
                />

                <textarea
                  {...register(`referenceSolution.${i}.completeCode`)}
                  placeholder="Reference solution"
                  className="w-full font-mono text-sm bg-neutral text-neutral-content rounded-xl p-4 min-h-[160px]"
                />
              </div>
            ))}
          </section>

          {/* Submit */}
          <button className="btn btn-primary h-14 w-full text-lg font-bold">
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminPanel;
