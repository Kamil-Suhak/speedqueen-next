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
          <h2 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
            {head.title}
          </h2>
          <div className="mx-auto mt-4 h-1.5 w-24 bg-brand-red rounded-full" />
          <p className="mt-6 text-lg text-gray-600 font-medium">
            {head.subtitle}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="group rounded-3xl border-2 border-transparent bg-white p-8 shadow-sm transition-all hover:border-brand-red/10 hover:shadow-xl"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-red-light text-brand-red transition-colors group-hover:bg-brand-red group-hover:text-white shadow-inner">
                <item.icon size={28} />
              </div>
              <h3 className="mb-3 text-xl font-black uppercase tracking-tight text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
