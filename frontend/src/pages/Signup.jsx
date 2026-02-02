import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../authSlice";

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak"),
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-2xl">
        <div className="p-8 sm:p-10">
          <h2 className="text-center text-3xl font-bold tracking-tight mb-8">
            LeetCodeX - Register Now
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* First Name */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className={`input input-bordered w-full h-11 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.firstName ? "input-error" : ""
                }`}
                {...register("firstName")}
              />
              {errors.firstName && (
                <span className="text-error text-xs mt-1">
                  {errors.firstName.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className={`input input-bordered w-full h-11 focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.emailId ? "input-error" : ""
                }`}
                {...register("emailId")}
              />
              {errors.emailId && (
                <span className="text-error text-xs mt-1">
                  {errors.emailId.message}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label pb-1">
                <span className="label-text font-medium">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`input input-bordered w-full h-11 pr-11 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.password ? "input-error" : ""
                  }`}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200 transition"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-error text-xs mt-1">
                  {errors.password.message}
                </span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary w-full h-11 text-base font-semibold tracking-wide ${
                loading ? "loading btn-disabled" : ""
              }`}
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          {/* Redirect */}
          <div className="text-center mt-6">
            <span className="text-sm text-gray-400">
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-medium text-primary hover:underline"
              >
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
