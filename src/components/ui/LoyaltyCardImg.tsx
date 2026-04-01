import Image from "next/image";

interface LoyaltyCardImgProps {
  className?: string;
}

export default function LoyaltyCardImg({ className = "" }: LoyaltyCardImgProps) {
  return (
    <div className={`relative group perspective-1000 ${className}`}>
      <div className="relative overflow-hidden rounded-[18px] border-[3px] border-zinc-900/90 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-zinc-900/20 active:scale-[0.98]">
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-white/20 via-transparent to-black/10 pointer-events-none" />
        
        <div className="absolute -inset-full z-10 bg-gradient-to-tr from-transparent via-white/5 to-transparent rotate-45 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none" />

        <Image
          src="/images/karta_stalego_klienta_speedqueen_krakow.png"
          alt="Karta Stałego Klienta Speed Queen Kraków"
          width={600}
          height={380}
          className="w-full h-auto object-cover block"
          priority
        />
        
        <div className="absolute inset-0 rounded-[15px] ring-1 ring-inset ring-white/20 pointer-events-none" />
      </div>
      
    </div>
  );
}

