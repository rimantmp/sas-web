import LoginForm from "@/components/admin/LoginForm";

export const metadata = { title: "Masuk Admin | SAS" };

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-16">
      <LoginForm />
    </div>
  );
}
