import { Suspense } from "react";
import { SuccessClient } from "./success-client";

export const metadata = {
  title: "Paiement confirmé — locpilote",
};

export default function SuccessPage() {
  return (
    <Suspense fallback={null}>
      <SuccessClient />
    </Suspense>
  );
}
