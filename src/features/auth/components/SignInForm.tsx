"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SocialProviderButton } from "./SocialProviderButton";
import { AuthSeparator } from "./AuthSeparator";
import { CredentialsSignIn } from "./CredentialsSignIn";

interface SignInFormProps {
  onSwitch: () => void;
}

export function SignInForm({ onSwitch }: SignInFormProps) {
  const [isSocialLoading, setIsSocialLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsSocialLoading(true);
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <>
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-3xl font-black tracking-tight text-foreground bg-clip-text text-transparent bg-gradient-to-l from-emerald-600 to-emerald-600 dark:from-emerald-400 dark:to-emerald-400">
          تـسـجيـل الـدخول
        </CardTitle>
      </CardHeader>
      
      <CardContent className="px-6 md:px-10 pb-8 space-y-8">
        <SocialProviderButton 
          provider="google" 
          onClick={handleGoogleSignIn} 
          isLoading={isSocialLoading}
        >
          متابعة بواسطة جوجل
        </SocialProviderButton>

        <AuthSeparator />

        <CredentialsSignIn />
      </CardContent>

      <CardFooter className="flex flex-col items-center gap-4 py-6 border-t border-border/40 bg-zinc-50/30 dark:bg-zinc-900/30">
        <Button 
          variant="link" 
          onClick={onSwitch} 
          className="text-muted-foreground hover:text-emerald-500 transition-colors font-bold text-base cursor-pointer"
        >
          ماعندكش حساب؟ سجل حساب جديد بالضغط هنا
        </Button>
      </CardFooter>
    </>
  );
}
