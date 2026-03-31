"use client";

import * as React from "react";
import { 
  InputOTP, 
  InputOTPGroup, 
  InputOTPSlot,
  OTPInputContext
} from "@/components/ui/input-otp";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LicensePlateInputProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

// Maps standard digits to Arabic Indic digits for UI display
const westernToArabicMap: Record<string, string> = {
  "0": "٠", "1": "١", "2": "٢", "3": "٣", "4": "٤",
  "5": "٥", "6": "٦", "7": "٧", "8": "٨", "9": "٩"
};

// Maps Arabic Indic digits back to standard digits for system storage
const arabicToWesternMap: Record<string, string> = {
  "٠": "0", "١": "1", "٢": "2", "٣": "3", "٤": "4",
  "٥": "5", "٦": "6", "٧": "7", "٨": "8", "٩": "9"
};

const isArabicLetter = (char: string) => /[\u0600-\u06FF]/.test(char) && !/[\u0660-\u0669]/.test(char);
const isArabicDigit = (char: string) => /[\u0660-\u0669]/.test(char);
const isWesternDigit = (char: string) => /\d/.test(char);

export function LicensePlateInput({
  value = "",
  onChange,
  disabled,
  className,
}: LicensePlateInputProps) {
  const [error, setError] = React.useState<string | null>(null);
  const [letters, setLetters] = React.useState("");
  const [numbers, setNumbers] = React.useState("");
  
  const numbersInputRef = React.useRef<HTMLInputElement>(null);
  const lettersInputRef = React.useRef<HTMLInputElement>(null);

  // Sync internal state with external value only if they differ
  React.useEffect(() => {
    const cleanValue = value.replace(/[-\s]/g, "").toUpperCase();
    // Split: letters are characters, numbers are digits
    const vLetters = cleanValue.replace(/\d/g, "");
    const vNumbers = cleanValue.replace(/[^\d]/g, "");
    
    if (vLetters !== letters) setLetters(vLetters);
    if (vNumbers !== numbers) setNumbers(vNumbers);
  }, [value, letters, numbers]);

  const handleLettersChange = (val: string) => {
    setError(null);
    const lastChar = val.slice(-1);
    
    if (lastChar && !isArabicLetter(lastChar)) {
      if (isWesternDigit(lastChar) || isArabicDigit(lastChar)) {
         // If user types a digit in letters section, and we already have some letters, 
         // maybe they want to jump to numbers?
         if (val.length > 1) {
            setNumbers(prev => (lastChar + prev).slice(0, 4));
            numbersInputRef.current?.focus();
            return;
         }
         setError("يرجى استخدام الحروف العربية في هذا القسم");
         return;
      }
      setError("يرجى الكتابة باللغة العربية فقط");
      return;
    }

    setLetters(val);
    const combined = val + numbers;
    onChange?.(combined);

    // Auto focus numbers if letters are full
    if (val.length === 3) {
      numbersInputRef.current?.focus();
    }
  };

  const handleNumbersChange = (val: string) => {
    setError(null);
    const lastChar = val.slice(-1);
    
    if (lastChar && !isWesternDigit(lastChar) && !isArabicDigit(lastChar)) {
      setError("يرجى إدخال أرقام فقط في هذا القسم");
      return;
    }

    // Standardize digits
    const standardizedNum = val.split("").map(c => arabicToWesternMap[c] || c).join("");
    setNumbers(standardizedNum);
    const combined = letters + standardizedNum;
    onChange?.(combined);
  };

  const handleNumbersKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && numbers === "") {
      lettersInputRef.current?.focus();
    }
  };

  return (
    <div className={cn("relative flex flex-col items-center gap-4 pt-10", className)} dir="rtl">
      <div className="absolute top-0 left-0 right-0 flex justify-center h-10 pointer-events-none">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="flex items-center gap-2 text-red-400 text-xs font-bold bg-popover/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-red-500/20 shadow-xl pointer-events-auto"
            >
              <AlertCircle className="size-3.5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center w-full">
        <div className="flex items-center justify-center gap-1 sm:gap-2 group/plate w-full">
          {/* Letters Group (2-3 Chars) */}
          <div className="flex flex-col items-center gap-1.5 sm:gap-2">
            <InputOTP
              ref={lettersInputRef}
              maxLength={3}
              value={letters}
              onChange={handleLettersChange}
              disabled={disabled}
              containerClassName="group"
            >
              <InputOTPGroup className="gap-1 sm:gap-1.5">
                {[0, 1, 2].map((i) => (
                  <LicenseSlot key={i} index={i} isLetterGroup forceValue={letters[i]} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">الحروف</span>
          </div>

          {/* Central Dash */}
          <div className="flex items-center justify-center pt-2">
            <div className="w-3 h-1 sm:w-5 sm:h-1.5 bg-muted rounded-full group-focus-within/plate:bg-emerald-500/50 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.1)]" />
          </div>

          {/* Numbers Group (3-4 Chars) */}
          <div dir="ltr" className="flex flex-col items-center gap-1.5 sm:gap-2">
            <InputOTP
              ref={numbersInputRef}
              maxLength={4}
              value={numbers}
              onChange={handleNumbersChange}
              onKeyDown={handleNumbersKeyDown}
              disabled={disabled}
              containerClassName="group"
            >
              <InputOTPGroup className="gap-1 sm:gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <LicenseSlot key={i} index={i} forceValue={numbers[i]} />
                ))}
              </InputOTPGroup>
            </InputOTP>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">الأرقام</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function LicenseSlot({ 
  index, 
  isLetterGroup, 
  forceValue 
}: { 
  index: number; 
  isLetterGroup?: boolean;
  forceValue?: string;
}) {
  const context = React.useContext(OTPInputContext);
  if (!context) return null;
  
  const slot = context.slots[index];
  if (!slot) return null;

  const char = forceValue || slot.char;

  return (
    <InputOTPSlot
      index={index}
      className={cn(
        "h-11 w-9 sm:h-16 sm:w-12 text-lg sm:text-2xl font-black border-2 border-border/30 bg-muted/30 transition-all",
        "rounded-2xl first:rounded-2xl last:rounded-2xl border-l-2 first:border-l-2",
        "data-[active=true]:border-emerald-500/60 data-[active=true]:ring-4 data-[active=true]:ring-emerald-500/10 data-[active=true]:scale-110 data-[active=true]:bg-card data-[active=true]:shadow-[0_0_20px_rgba(16,185,129,0.15)]",
        "group-hover:border-border/60",
        isLetterGroup ? "font-sans text-emerald-500/90" : "font-mono text-foreground"
      )}
    >
      {char ? (isLetterGroup ? char : (westernToArabicMap[char] || char)) : null}
    </InputOTPSlot>
  );
}
