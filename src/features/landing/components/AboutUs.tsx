"use client";

import { Phone, MapPin, Mail, Facebook, Instagram, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AboutUs() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 order-2 lg:order-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold font-heading uppercase tracking-widest">
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                ??? ????
              </div>
              <h2 className="text-4xl md:text-6xl font-bold font-heading text-primary leading-tight">
                ?? ????? ????
                <br />
                <span className="text-accent underline decoration-accent/30 underline-offset-8">???? ??????? ???? ????????</span>
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed font-sans max-w-xl">
                ???? ????? ?? ??? ???????? ??? ????? ???????? ???? ????? ???? ????? ????? ????? ??? ??? ??????.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: MapPin, title: "???????", detail: "?????? ?????? - ???? 10" },
                { icon: Phone, title: "???????", detail: "012 2809 3434 | 010 2447 9427" },
                { icon: Mail, title: "??????", detail: "info@thedrivecenter.com" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold font-heading text-sm text-muted-foreground">{item.title}</h4>
                    <p className="font-bold font-sans text-lg">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4 pt-4">
              {[Facebook, Instagram, Twitter].map((Icon, idx) => (
                <Button key={idx} variant="outline" size="icon" className="w-12 h-12 rounded-full border-slate-200 dark:border-slate-800 hover:bg-accent hover:text-white hover:border-accent transition-all duration-300">
                  <Icon className="w-5 h-5" />
                </Button>
              ))}
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary to-accent opacity-20" />
              <div className="absolute inset-0 flex items-center justify-center text-accent/20">
                <span className="text-[200px] font-bold">DC</span>
              </div>
              <div className="absolute bottom-8 left-8 right-8 glass-card p-8 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-2xl font-bold font-heading mb-2">??? ?????</h4>
                <p className="text-sm opacity-80 font-sans leading-relaxed">???? ???? ?? ????? ????? ????? ??????? ????? ?????.</p>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-[radial-gradient(#0369A1_2px,transparent_2px)] [background-size:16px_16px] opacity-30" />
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[radial-gradient(#0369A1_2px,transparent_2px)] [background-size:16px_16px] opacity-30" />
          </div>
        </div>
      </div>
    </section>
  );
}
