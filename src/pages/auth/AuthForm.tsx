import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button, EyeIcon, EyeOffIcon, Input, useToast } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";
import AuthLayout from "./AuthLayout";
import SocialButtons from "./SocialButtons";
import {
  loginSchema,
  signupSchema,
  passwordScore,
  type LoginFormData,
  type SignupFormData,
} from "./schemas";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      toast.show({
        title: "Welcome back!",
        description: "Successfully signed in.",
        tone: "success",
      });
      const destination =
        (location.state as { from?: { pathname?: string } })?.from?.pathname || "/home";
      navigate(destination, { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Invalid email or password";
      setServerError(message);
      toast.show({
        title: "Login failed",
        description: message,
        tone: "error",
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-extrabold tracking-tight">Log in</h2>
      <p className="mt-2 text-sm text-navy/60">
        Welcome back. Pick up your trips where you left them.
      </p>

      <div className="mt-8">
        <SocialButtons />
      </div>

      <div
        className="my-6 flex items-center gap-4 text-xs font-semibold text-navy/50"
        role="separator"
      >
        <span className="h-px flex-1 bg-navy/10" />
        or with email
        <span className="h-px flex-1 bg-navy/10" />
      </div>

      {serverError && (
        <div
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="login-pw" className="text-xs font-bold">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-navy underline-offset-2 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="login-pw"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Your password"
            error={errors.password?.message}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="-mr-1 grid h-7 w-7 place-items-center rounded-full text-navy/60 hover:bg-navy/5 hover:text-navy"
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            }
            {...register("password")}
          />
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in…" : "Log in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-navy/60">
        New to Travel Plan?{" "}
        <Link
          to="/signup"
          className="font-bold text-navy underline-offset-2 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </>
  );
}

function SignupForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const { signup } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const passwordValue = watch("password", "");
  const score = passwordScore(passwordValue);

  const onSubmit = async (data: SignupFormData) => {
    setServerError(null);
    try {
      await signup(data);
      toast.show({
        title: "Account created!",
        description: "Welcome to Travel Plan.",
        tone: "success",
      });
      navigate("/onboarding", { replace: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create account";
      setServerError(message);
      toast.show({
        title: "Signup failed",
        description: message,
        tone: "error",
      });
    }
  };

  return (
    <>
      <h2 className="text-3xl font-extrabold tracking-tight">Create your account</h2>
      <p className="mt-2 text-sm text-navy/60">
        Free to use. Plan solo or with your whole crew.
      </p>

      <div className="mt-8">
        <SocialButtons />
      </div>

      <div
        className="my-6 flex items-center gap-4 text-xs font-semibold text-navy/50"
        role="separator"
      >
        <span className="h-px flex-1 bg-navy/10" />
        or with email
        <span className="h-px flex-1 bg-navy/10" />
      </div>

      {serverError && (
        <div
          className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
          role="alert"
        >
          {serverError}
        </div>
      )}

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Name"
          autoComplete="name"
          placeholder="Mia Laurent"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label htmlFor="signup-pw" className="text-xs font-bold">
              Password
            </label>
          </div>
          <Input
            id="signup-pw"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="8+ characters, with a number"
            error={errors.password?.message}
            hint={
              errors.password?.message
                ? undefined
                : "At least 8 characters and one number"
            }
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-pressed={showPassword}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="-mr-1 grid h-7 w-7 place-items-center rounded-full text-navy/60 hover:bg-navy/5 hover:text-navy"
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            }
            {...register("password")}
          />
          {passwordValue && (
            <div className="mt-2 flex gap-1" aria-hidden="true">
              {[1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className={`h-1 flex-1 rounded-full transition ${
                    i <= score
                      ? score < 3
                        ? "bg-amber-400"
                        : "bg-ocean-500"
                      : "bg-navy/10"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-4 text-xs text-navy/50">
        By creating an account you agree to our{" "}
        <a href="#/help" className="underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#/help" className="underline">
          Privacy policy
        </a>
        .
      </p>

      <p className="mt-6 text-center text-sm text-navy/60">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-bold text-navy underline-offset-2 hover:underline"
        >
          Log in
        </Link>
      </p>
    </>
  );
}

export function Login() {
  return (
    <AuthLayout
      headline="Welcome back"
      tagline="Your itineraries, maps and bookings are right where you left them."
    >
      <LoginForm />
    </AuthLayout>
  );
}

export function Signup() {
  return (
    <AuthLayout
      headline="Start exploring"
      tagline="Plan every trip in one place and share it with the people coming along."
    >
      <SignupForm />
    </AuthLayout>
  );
}
