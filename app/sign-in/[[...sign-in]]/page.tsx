import { SignIn } from "@clerk/nextjs";

import { AuthLayout } from "@/components/auth/auth-layout";

export default function SignInPage() {
  return (
    <AuthLayout>
      <SignIn fallbackRedirectUrl="/editor" signUpUrl="/sign-up" />
    </AuthLayout>
  );
}
