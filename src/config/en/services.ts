import { Clock, ThermometerSun, Zap, Sparkles } from "lucide-react";

export const servicesEn = {
  head: {
    title: "Our Services",
    subtitle:
      "Expert solutions for all your laundry needs in Krakow. Utilizing professional industrial equipment and premium detergents.",
  },
  items: [
    {
      title: "Washing",
      description: "Our facilities utilize eco-friendly wet cleaning, the safest method for your garments and the environment. A standard cycle averages 30 minutes.",
      icon: Sparkles,
    },
    {
      title: "Drying",
      description: "We provide high-efficiency drying using advanced heat pump technology, ensuring a delicate process that prevents creasing and shrinkage.",
      icon: ThermometerSun,
    },
    {
      title: "Automatic Dosing",
      description: "Professional grade detergents are automatically dispensed for cycles 1-5. !!Note: Cycles 6 and 7 require your own detergents.!!",
      icon: Zap,
    },
    {
      title: "Loyalty Card",
      description: "Our SQ loyalty program offers exclusive discounts on all machines, providing a more cost-effective solution for frequent users.",
      icon: Clock,
    },
  ],
};

export default servicesEn;
