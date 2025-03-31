import { SignUp } from "@clerk/nextjs";
import { SignUpConsent } from "@/components/SignUpConsent";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md p-6">
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white dark:bg-gray-800 shadow-xl",
              formButtonPrimary: "bg-secondary hover:bg-secondary/90",
            },
          }}
        />
        <div className="mt-6 bg-white dark:bg-gray-800 shadow-xl p-6 rounded-lg">
          <SignUpConsent />
        </div>
      </div>
    </div>
  );
} 