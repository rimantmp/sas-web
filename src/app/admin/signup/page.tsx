import { SignupForm, SignupClosed } from "@/components/admin/SignupForm";

export const metadata = { title: "Daftar Admin | SAS" };

export default function SignupPage() {
  const open = Boolean(process.env.ADMIN_SIGNUP_KEY);
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-16">
      {open ? <SignupForm /> : <SignupClosed />}
    </div>
  );
}
