import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Connexion — locpilote",
  description: "Connectez-vous à votre tableau de bord locpilote pour suivre vos revenus Airbnb et Booking.com.",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="login" />
    </Suspense>
  );
}
