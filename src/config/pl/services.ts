import { Armchair, ThermometerSun, Zap, Sparkles } from "lucide-react";

export const servicesPl = {
  head: {
    title: "Nasze Usługi",
    subtitle:
      "Kompleksowe rozwiązania dla wszystkich potrzeb pralniczych w Krakowie. Dysponujemy profesjonalnym sprzętem przemysłowym i najwyższej jakości środkami czystości.",
  },
  items: [
    {
      title: "Pranie",
      description: "Stosujemy technologię [[prania wodnego]], która jest najbezpieczniejsza dla tkanin, użytkowników i środowiska. Średni czas cyklu wynosi [[30 minut]].",
      icon: Sparkles,
    },
    {
      title: "Suszenie",
      description: "Zapewniamy delikatne i [[wydajne suszenie]] przy użyciu innowacyjnych pomp ciepła, co eliminuje ryzyko gniecenia i kurczenia się odzieży.",
      icon: ThermometerSun,
    },
    {
      title: "Automatyczne Dozowanie",
      description: "[[Profesjonalne środki piorące]] są dozowane automatycznie w programach 1-5. !!Uwaga: Programy 6, 7 wymagają użycia własnych detergentów.!!",
      icon: Zap,
    },
    {
      title: "Dodatki",
      description: "Poczekaj na swoje pranie na naszych [[wygodnych kanapach]]. Skorzystaj z zaawansowanego [[ozonatora]] (przy Al. Słowackiego) oraz ze [[stołu do prasowania]] (przy ul. Pawiej).",
      icon: Armchair,
    },
  ],
};

export default servicesPl;
