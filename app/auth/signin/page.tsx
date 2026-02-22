import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default function SignInPage() {
  // Resolved on the server — env vars never sent to the client bundle
  const providers = {
    google: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
  };

  return (
    <Suspense>
      <SignInForm providers={providers} />
    </Suspense>
  );
}
