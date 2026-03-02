import { CheckCircle2 } from "lucide-react";

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  buttonText: string;
}

interface PricingProps {
  plans: PricingPlan[];
  title: string;
  subtitle: string;
}

export default function Pricing({ plans, title, subtitle }: PricingProps) {
  return (
    <section id="pricing" className="scroll-mt-20 bg-gray-50 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
            {title}
          </h2>
          <p className="mt-4 text-gray-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-3xl border bg-white p-8 transition-all duration-300 ${
                plan.isPopular
                  ? "z-10 scale-105 border-blue-600 shadow-2xl"
                  : "border-gray-200 shadow-sm hover:shadow-md"
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold tracking-widest text-white uppercase">
                  Popular
                </span>
              )}

              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-extrabold text-gray-900">
                  {plan.price}
                </span>
                {plan.price.includes("$") && (
                  <span className="ml-1 text-gray-500">/mo</span>
                )}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-gray-600">
                {plan.description}
              </p>

              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-blue-600"
                    />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-10 w-full rounded-xl px-6 py-4 font-bold transition-all ${
                  plan.isPopular
                    ? "bg-blue-600 text-white shadow-lg hover:bg-blue-700"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
