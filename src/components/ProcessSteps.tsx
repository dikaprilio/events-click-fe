'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    title: 'Consultation',
    description: 'Brainstorm your event vision with our experts. You will get free consultation and survey.',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80',
    detailTitle: 'Consultation',
    detailDescription: 'Arrange a personal consultation with us. We unlock strategies to achieve your goals, together!',
  },
  {
    id: 2,
    title: 'Creative Planning',
    description: 'Highlight the importance of creating a narrative for the event experience.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1200&q=80',
    detailTitle: 'Creative Planning',
    detailDescription: 'Craft a blueprint for your event. An unforgettable experience is tailored just for you and, coming for you.',
  },
  {
    id: 3,
    title: 'Production',
    description: "We'll handle everything from booking venues to managing logistics.",
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    detailTitle: 'Production',
    detailDescription: 'Execute a successful event by ensuring every detail into strong and actionable plan, polished to perfection.',
  },
  {
    id: 4,
    title: 'Event Day!',
    description: 'Relax and enjoy your perfectly executed event.',
    image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    detailTitle: 'Event Day!',
    detailDescription: "It's D-day! Enjoy and be mindful as your event should always be in the spotlight. Leave the rest to us, cheers!",
  },
];

export default function ProcessSteps() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4 animate-fade-in-up">
            Seamless Event Planning with{' '}
            <span className="text-primary">Eventsclick</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto animate-fade-in-up [animation-delay:0.1s]">
            Eventsclick goes beyond creating events—we craft unforgettable experiences.
            <br className="hidden md:block" />
            Our easy steps ensure your event is planned smoothly and efficiently.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left: Step Cards */}
          <div className="lg:col-span-4 space-y-3">
            {steps.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                className={`w-full text-left p-5 rounded-xl transition-all duration-300 group ${
                  activeStep === index
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-secondary/80 dark:bg-zinc-800/80 text-foreground hover:bg-secondary dark:hover:bg-zinc-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={`text-sm font-bold uppercase tracking-wider ${
                      activeStep === index ? 'text-accent-foreground/70' : 'text-muted-foreground'
                    }`}
                  >
                    Step {step.id}
                  </span>
                  <div className="flex-1">
                    <h3
                      className={`font-bold text-lg mb-1 ${
                        activeStep === index ? 'text-accent-foreground' : 'text-foreground'
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`text-sm leading-relaxed ${
                        activeStep === index ? 'text-accent-foreground/80' : 'text-muted-foreground'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right: Image & Details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Image Container */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-secondary">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    activeStep === index ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Detail Content */}
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`transition-all duration-500 ${
                    activeStep === index
                      ? 'opacity-100 transform translate-y-0'
                      : 'opacity-0 transform translate-y-4 absolute pointer-events-none'
                  }`}
                >
                  {activeStep === index && (
                    <>
                      <h3 className="text-3xl font-bold font-display text-foreground mb-2">
                        {step.detailTitle}
                      </h3>
                      <p className="text-muted-foreground text-lg mb-6">
                        {step.detailDescription}
                      </p>
                    </>
                  )}
                </div>
              ))}

              {/* CTA Button */}
              <Link
                href="/contact"
                className="inline-flex items-center justify-center w-full md:w-auto px-8 py-4 rounded-lg border-2 border-accent text-accent font-semibold text-lg hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                Talk to us!
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
