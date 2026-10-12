import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button, CheckIcon, Input } from "../../components/ui";
import AuthLayout from "./AuthLayout";
import { validateEmail } from "./validate";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [sent, setSent] = useState(false);
  const error = touched ? validateEmail(email) : undefined;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!validateEmail(email)) setSent(true);
  };

  return (
    <AuthLayout headline="Lost your way?" tagline="It happens to the best travellers. We'll send you a link to get back on course.">
      {sent ? (
        <div role="status">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-ocean-100 text-navy"><CheckIcon size={22} /></span>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight">Check your inbox</h2>
          <p className="mt-2 text-sm text-navy/60">If an account exists for <strong className="text-navy">{email}</strong>, a reset link is on its way. It can take a minute or two.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button href="#/login">Back to log in</Button>
            <Button variant="ghost" onClick={() => setSent(false)}>Use a different email</Button>
          </div>
        </div>
      ) : (
        <>
          <h2 className="text-3xl font-extrabold tracking-tight">Forgot password?</h2>
          <p className="mt-2 text-sm text-navy/60">Enter the email you signed up with and we'll send a reset link.</p>
          <form noValidate onSubmit={submit} className="mt-8 space-y-4">
            <Input label="Email" type="email" autoComplete="email" placeholder="you@email.com" value={email} error={error} onChange={(e) => setEmail(e.target.value)} onBlur={() => setTouched(true)} />
            <Button type="submit" size="lg" className="w-full">Send reset link</Button>
          </form>
          <p className="mt-6 text-center text-sm text-navy/60">Remembered it? <Link to="/login" className="font-bold text-navy underline-offset-2 hover:underline">Log in</Link></p>
        </>
      )}
    </AuthLayout>
  );
}
