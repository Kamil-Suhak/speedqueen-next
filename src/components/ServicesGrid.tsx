import { LucideIcon } from "lucide-react";

interface ServiceItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ServicesProps {
  head: { title: string; subtitle: string };
  items: ServiceItem[];
}

export default function ServicesGrid({ head, items }: ServicesProps) {
  return (
    <section id="services" className="scroll-mt-20 bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-900">{head.title}</h2>
          <p className="mt-4 text-gray-600">{head.subtitle}</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <item.icon size={24} />
              </div>
              <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
