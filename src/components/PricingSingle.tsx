import { CheckCircle2, ArrowRight } from "lucide-react";

interface PricingSingleProps {
  content: {
    name: string;
    price: string;
    description: string;
    features: string[];
    buttonText: string;
  };
}

export default function PricingSingle({ content }: PricingSingleProps) {
  return (
    <section id="pricing" className="scroll-mt-20 bg-white py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex flex-col items-stretch overflow-hidden rounded-3xl border border-gray-200 bg-gray-50 lg:flex-row">
          {/* LEFT SIDE */}
          <div className="flex-1 p-8 lg:p-12">
            <div className="mb-6 inline-block rounded-full bg-blue-600 px-4 py-1 text-xs font-bold tracking-widest text-white uppercase">
              {/* Note: You could also pass this label through the dict if needed */}
              Best Value
            </div>

            <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
              {content.name}
            </h2>
            <p className="mb-8 max-w-xl text-lg text-gray-600">
              {content.description}
            </p>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
              {content.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-700">
                  <CheckCircle2 size={20} className="shrink-0 text-blue-600" />
                  <span className="font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex flex-col items-center justify-center bg-gray-100 p-8 text-center lg:w-96 lg:p-12">
            <div className="mb-4">
              <span className="text-5xl font-extrabold text-gray-900">
                {content.price}
              </span>
            </div>

            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-blue-700">
              {content.buttonText}
              <ArrowRight
                size={20}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
