import { Suspense } from "react";
import { AuthForm } from "@/components/auth/AuthForm";

export const metadata = {
  title: "Créer un compte — locpilote",
  description: "Créez votre compte gratuit locpilote et commencez à suivre votre bénéfice net Airbnb & Booking.com en quelques minutes.",
};

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
