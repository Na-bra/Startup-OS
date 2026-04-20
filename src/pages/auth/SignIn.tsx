import { SignIn as ClerkSignIn } from '@clerk/clerk-react';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function SignIn() {
  return (
    <AuthLayout>
      <ClerkSignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/select-role"
      />
    </AuthLayout>
  );
}
