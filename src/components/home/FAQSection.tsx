import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { withTimeout } from "@/lib/with-timeout";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

const fallbackFaqs: FAQ[] = [
  { id: "faq-1", question: "Do you offer same-day appointments?", answer: "Yes, we try to accommodate urgent dental issues and same-day visits whenever possible.", category: "Appointments" },
  { id: "faq-2", question: "Is teeth whitening safe?", answer: "Professional whitening is safe when done under dental supervision and customized for your smile.", category: "Cosmetic" },
  { id: "faq-3", question: "How often should I get a dental checkup?", answer: "Most patients should visit every 6 months, though your dentist may recommend a different schedule.", category: "General" },
  { id: "faq-4", question: "Do you provide implant consultations?", answer: "Yes, we offer implant evaluations and personalized treatment planning for missing teeth.", category: "Implants" },
];

const FAQSection = () => {
  const { data: faqs = fallbackFaqs, isLoading } = useQuery({
    queryKey: ["faqs-preview"],
    queryFn: async () => {
      try {
        const { data, error } = await withTimeout(
          supabase
            .from("faqs")
            .select("*")
            .eq("is_active", true)
            .order("display_order", { ascending: true })
            .limit(6),
          4000,
          "FAQ request timed out"
        );

        if (error || !data?.length) return fallbackFaqs;
        return data as FAQ[];
      } catch {
        return fallbackFaqs;
      }
    },
  });

  if (isLoading) {
    return (
      <section className="section-padding bg-secondary">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-secondary">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <HelpCircle className="w-7 h-7 text-primary" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Find answers to common questions about our services.</p>
          </div>

          <Accordion type="single" collapsible className="space-y-3 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="bg-card rounded-xl border border-border/50 px-6 shadow-soft data-[state=open]:shadow-medium transition-shadow">
                <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-10 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <p className="text-muted-foreground mb-4">Still have questions?</p>
            <Link to="/contact">
              <Button variant="outline" className="gap-2"><MessageCircle className="w-4 h-4" />Contact Us</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
