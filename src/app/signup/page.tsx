import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Créer un compte — locpilote",
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
