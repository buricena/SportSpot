"use client";

import { useState } from "react";
import styles from "./faq.module.css";
import { ChevronDown } from "lucide-react";

const FAQ_DATA = [
  {
    question: "What is SportSpot?",
    answer:
      "SportSpot is a platform for discovering, creating, and joining local non-professional sports events.",
  },
  {
    question: "Do I need an account to join events?",
    answer:
      "Yes. You must be logged in to join or create events. This helps us track participants and results.",
  },
  {
    question: "How do I create an event?",
    answer:
      "Go to the Events page and click on the “Add Event” button. Fill in the required details and publish your event.",
  },
  {
    question: "Can I leave an event after joining?",
    answer:
      "Yes. You can leave an event at any time before it starts by clicking the Leave button on the event page.",
  },
  {
    question: "What happens if an event is full?",
    answer:
      "If the maximum number of participants is reached, new users will no longer be able to join the event.",
  },
  {
    question: "Who can delete an event?",
    answer:
      "Only the event organizer can delete an event.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1>Frequently Asked Questions</h1>
        <p>
          Here you can find answers to the most common questions about using
          SportSpot.
        </p>
      </header>

      <section className={styles.faqList}>
        {FAQ_DATA.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className={`${styles.faqItem} ${
                isOpen ? styles.open : ""
              }`}
            >
              <button
                className={styles.question}
                onClick={() =>
                  setOpenIndex(isOpen ? null : index)
                }
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={18}
                  className={styles.icon}
                />
              </button>

              {isOpen && (
                <div className={styles.answer}>
                  <p>{item.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </section>
    </main>
  );
}