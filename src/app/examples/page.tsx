import Link from 'next/link';
import { Sparkles, Image, FileText, ArrowRight } from 'lucide-react';

const examples = [
  {
    id: 'promo',
    name: 'Promo / Campaign',
    description: 'Perfect for service packages, special offers, and pricing pages with bold CTAs.',
    icon: Sparkles,
    href: '/examples/promo',
    previewGradient: 'from-violet-500 to-fuchsia-500',
  },
  {
    id: 'gallery',
    name: 'Gallery Showcase',
    description: 'Ideal for event portfolios, past project showcases, and immersive photo galleries.',
    icon: Image,
    href: '/examples/gallery',
    previewGradient: 'from-primary to-primary-dark',
  },
  {
    id: 'simple',
    name: 'Editorial Article',
    description: 'Clean, readable long-form content with a magazine-style layout and hero image.',
    icon: FileText,
    href: '/examples/simple',
    previewGradient: 'from-emerald-500 to-teal-500',
  },
];

export const metadata = {
  title: 'Template Examples | EventsClick',
  description: 'Preview live examples of our page builder templates before creating your own.',
};

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="inline-block text-primary text-sm font-bold uppercase tracking-wider mb-3">
            Page Builder
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-5">
            Template Examples
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Not sure which template fits your content best? Browse these live examples to see exactly how each layout looks and feels.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {examples.map((example) => {
            const Icon = example.icon;
            return (
              <Link
                key={example.id}
                href={example.href}
                className="group relative rounded-3xl border border-border/60 bg-card overflow-hidden hover:shadow-glow transition-all duration-300 hover:-translate-y-1"
              >
                {/* Preview stripe */}
                <div className={`h-40 bg-gradient-to-br ${example.previewGradient} relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-card to-transparent" />
                </div>

                <div className="p-6 md:p-8">
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {example.name}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                    {example.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm">
                    View Live Example
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Ready to build your own page?
          </p>
          <Link
            href="/admin/pages/new"
            className="inline-flex items-center gap-2 mt-3 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:bg-primary-dark transition-colors"
          >
            Create a Page
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
