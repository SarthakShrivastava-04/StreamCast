"use client";

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export default function Faqs() {
  return (
    <section id="faqs" className="container mx-auto px-4 py-16 text-center">
  <h2 className="text-4xl sm:text-5xl font-bold text-white">
    Got <span className="text-[#37c96f]">Questions</span >? We've Got <span className="text-[#37c96f]">Answers</span>.
  </h2>
  <p className="text-gray-300 mt-3 text-lg">
    Everything you need to know about streaming effortlessly.
  </p>

  {/* FAQs Accordion */}
  <div className="mt-8 max-w-3xl mx-auto text-left">
    <Accordion type="single" collapsible className="space-y-3">
      {faqData.map(({ question, answer }, index) => (
        <AccordionItem key={index} value={`faq-${index}`}>
          <AccordionTrigger className="text-base font-medium text-left group">
            {question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-300 text-sm">
            {answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  </div>
</section>

  );
}

// FAQ Data
const faqData = [
  {
    question: "How do I start streaming with RTMP?",
    answer: "Simply paste your RTMP key from any platform, turn on your camera & mic, and you're live in seconds!",
  },
  {
    question: "Can I stream to multiple platforms at once?",
    answer: "Yes! Our system supports multi-streaming to platforms like YouTube, Facebook, and Twitch simultaneously.",
  },
  {
    question: "Do I need special software to go live?",
    answer: "No additional software is required. Our platform handles everything in the browser for a seamless experience.",
  },
  {
    question: "Is there a delay while streaming?",
    answer: "Our optimized servers ensure ultra-low latency streaming, reducing delay to just a few milliseconds.",
  },
];
