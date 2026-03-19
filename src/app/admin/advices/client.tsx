"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createAdvice, updateAdvice, deleteAdvice } from "./actions";
import { Sparkles, Plus, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";

interface Advice {
  id: string;
  content: string;
  isActive: boolean | null;
}

interface AdvicesClientProps {
  initialAdvices: Advice[];
}

export function AdvicesClient({ initialAdvices }: AdvicesClientProps) {
  const [advices] = useState(initialAdvices);
  const [newContent, setNewContent] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleAdd() {
    if (!newContent.trim()) return;
    startTransition(async () => {
      const result = await createAdvice(newContent);
      if (result.success) {
        toast.success("تم إضافة النصيحة بنجاح");
        setNewContent("");
        window.location.reload(); // Refresh to get the latest DB state
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleToggle(advice: Advice) {
    startTransition(async () => {
      const result = await updateAdvice(advice.id, advice.content, !advice.isActive);
      if (result.success) {
        toast.success("تم تحديث حالة النصيحة");
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("هل أنت متأكد من حذف هذه النصيحة؟")) return;
    startTransition(async () => {
      const result = await deleteAdvice(id);
      if (result.success) {
        toast.success("تم حذف النصيحة");
        window.location.reload();
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-3xl font-black font-cairo text-zinc-900 dark:text-white">إدارة النصائح (نصيحة اليوم)</h1>
        <p className="text-muted-foreground mt-2 font-medium">تحكم في النصائح والتعليمات الفنية التي تظهر عشوائياً لزوار المركز</p>
      </div>

      <Card className="border-border/50 bg-card/50 backdrop-blur-md shadow-xl rounded-4xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" />
            إضافة نصيحة جديدة
          </CardTitle>
          <CardDescription>اكتب نصيحة فنية قصيرة ومفيدة</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Input 
                value={newContent} 
                onChange={(e) => setNewContent(e.target.value)}
                placeholder="مثال: ظبط الزوايا لازم كل 3 شهور..."
                className="bg-muted/30 border-border/50 rounded-2xl h-14 px-6"
              />
            </div>
            <Button 
              onClick={handleAdd} 
              disabled={isPending || !newContent}
              className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
            >
              {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "إضافة"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {advices.map((advice) => (
          <Card key={advice.id} className="border-border/50 bg-card/50 backdrop-blur-md hover:border-emerald-500/30 transition-all rounded-3xl group">
            <CardContent className="p-6 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className={`p-3 rounded-2xl ${advice.isActive ? "bg-emerald-500/10" : "bg-muted"}`}>
                  <Sparkles className={`w-5 h-5 ${advice.isActive ? "text-emerald-500" : "text-muted-foreground"}`} />
                </div>
                <p className={`font-bold text-lg leading-relaxed ${!advice.isActive && "text-muted-foreground line-through"}`}>
                  {advice.content}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={`rounded-xl h-12 w-12 ${advice.isActive ? "text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10" : "text-zinc-400 hover:text-zinc-500 hover:bg-zinc-500/10"}`}
                  onClick={() => handleToggle(advice)}
                >
                  {advice.isActive ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-xl h-12 w-12 text-destructive hover:bg-destructive/10"
                  onClick={() => handleDelete(advice.id)}
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {advices.length === 0 && (
          <div className="py-20 text-center space-y-4 bg-muted/20 border-2 border-dashed border-border/50 rounded-4xl">
            <div className="bg-muted p-4 rounded-full w-fit mx-auto">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">لا توجد نصائح حالياً. ابدأ بإضافة نصيحة جديدة!</p>
          </div>
        )}
      </div>
    </div>
  );
}
