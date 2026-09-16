import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQS = [
  {
    question: "How does checkout work?",
    answer:
      "You review your bag on our site, then complete payment through Shopify's secure checkout — the same infrastructure trusted by thousands of stores.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive an email with tracking details, and you can always check the latest status from your account's order history.",
  },
  {
    question: "What is your returns policy?",
    answer:
      "Reach out to our client care team with your order number and we'll guide you through the return or exchange process.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit and debit cards through our secure checkout.",
  },
];

export function FaqSection() {
  return (
    <section className="border-t border-border py-16">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <div className="mb-8 text-center">
          <p className="eyebrow">Good to know</p>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl">Frequently Asked Questions</h2>
        </div>
        <Accordion type="single" collapsible>
          {FAQS.map((faq) => (
            <AccordionItem key={faq.question} value={faq.question}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
