import { SignUp as ClerkSignUp } from '@clerk/clerk-react';
import { AuthLayout } from '@/components/layout/AuthLayout';

export default function SignUp() {
  return (
    <AuthLayout>
      <ClerkSignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        afterSignUpUrl="/select-role"
      />
    </AuthLayout>
  );
}
