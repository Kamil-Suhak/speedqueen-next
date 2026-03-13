"use client";

import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { sendEmail } from "@/actions/sendEmail";
import StatusModal from "@/components/StatusModal";
import SectionBackground from "@/components/SectionBackground";
import { Locations } from "@/config/site-config";

interface ContactProps {
  content: {
    title: string;
    subtitle: string;
    form: {
      name: string;
      email: string;
      message: string;
      button: string;
      successTitle: string;
      successMessage: string;
      errorTitle: string;
      errorMessage: string;
      buttonClose: string;
    };
  };
  brandInfo: { email: string; phone: string; address: string[] };
  bgImage?: string;
}

export default function Contact({ content, brandInfo, bgImage }: ContactProps) {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [directionsUrl, setDirectionsUrl] = useState(Locations[1].url);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;

        let closest = Locations[0];
        let minDistance = Infinity;

        Locations.forEach((loc) => {
          const dist = Math.sqrt(
            Math.pow(loc.lat - userLat, 2) + Math.pow(loc.lng - userLng, 2)
          );
          if (dist < minDistance) {
            minDistance = dist;
            closest = loc;
          }
        });

        setDirectionsUrl(closest.url);
      });
    }
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    const result = await sendEmail(formData);
    setIsPending(false);

    if (result.success) {
      setIsSuccess(true);
    } else {
      setErrorModal({
        isOpen: true,
      });
    }
  }

  return (
    <section id="contact" className="relative scroll-mt-20 py-24 bg-white overflow-hidden" aria-labelledby="contact-heading">
      <SectionBackground imagePath={bgImage} />
      
      <StatusModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
        title={content.form.errorTitle}
        message={content.form.errorMessage}
        type="error"
        closeButtonText={content.form.buttonClose}
      />

      <div className="mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-2 relative z-10">
        <div>
          <h2 id="contact-heading" className="mb-6 text-4xl font-extrabold uppercase tracking-tight">{content.title}</h2>
          <div className="mb-8 h-1 w-16 bg-brand-red rounded-full" aria-hidden="true" />
          <p className="mb-10 text-lg text-gray-600 font-normal leading-relaxed">{content.subtitle}</p>
          
          <div className="space-y-6">
            <a href={`mailto:${brandInfo.email}`} className="flex items-center gap-5 group focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-4 rounded-xl p-1 w-fit">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors shadow-sm" aria-hidden="true">
                <Mail size={22} />
              </div>
              <span className="font-bold uppercase tracking-tight text-gray-900">{brandInfo.email}</span>
            </a>
            
            <a href={`tel:${brandInfo.phone}`} className="flex items-center gap-5 group focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-4 rounded-xl p-1 w-fit">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors shadow-sm" aria-hidden="true">
                <Phone size={22} />
              </div>
              <span className="font-bold uppercase tracking-tight text-gray-900">{brandInfo.phone}</span>
            </a>
            
            <a 
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 group focus:outline-none focus:ring-2 focus:ring-brand-red focus:ring-offset-4 rounded-xl p-1 overflow-hidden min-w-0 w-fit"
            >
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-white border border-slate-100 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors shadow-sm" aria-hidden="true">
                <MapPin size={22} />
              </div>
              <div className="relative overflow-hidden flex-1 min-w-0 max-w-full w-[230px] md:w-[310px] whitespace-nowrap">
                <div className="flex animate-marquee w-max">
                  <div className="flex items-center">
                    {brandInfo.address.map((addr, idx) => (
                      <div key={idx} className="flex items-center gap-4 pr-4">
                        <span className="font-bold uppercase tracking-tight text-gray-900">
                          {addr}
                        </span>
                        <div className="h-6 w-1.5 bg-brand-red" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center">
                    {brandInfo.address.map((addr, idx) => (
                      <div key={`copy-${idx}`} className="flex items-center gap-4 pr-4">
                        <span className="font-bold uppercase tracking-tight text-gray-900">
                          {addr}
                        </span>
                        <div className="h-6 w-1.5 bg-brand-red" aria-hidden="true" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="relative" aria-live="polite">
          {isSuccess ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white/90 backdrop-blur-sm p-12 text-center shadow-md">
              <CheckCircle size={64} className="mb-6 text-brand-red" aria-hidden="true" />
              <h3 className="mb-4 text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
                {content.form.successTitle}
              </h3>
              <p className="text-gray-600 font-normal text-lg">{content.form.successMessage}</p>
            </div>
          ) : (
            <form
              action={handleSubmit}
              className="space-y-4 rounded-3xl border border-slate-100 bg-white/90 backdrop-blur-sm p-10 shadow-sm"
              aria-label={content.title}
            >
              <div>
                <label htmlFor="senderName" className="sr-only">{content.form.name}</label>
                <input
                  id="senderName"
                  name="senderName"
                  required
                  className="w-full rounded-2xl border border-slate-200 p-5 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 font-medium transition-all"
                  placeholder={content.form.name}
                />
              </div>
              <div>
                <label htmlFor="senderEmail" className="sr-only">{content.form.email}</label>
                <input
                  id="senderEmail"
                  name="senderEmail"
                  type="email"
                  required
                  className="w-full rounded-2xl border border-slate-200 p-5 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 font-medium transition-all"
                  placeholder={content.form.email}
                />
              </div>
              <div>
                <label htmlFor="message" className="sr-only">{content.form.message}</label>
                <textarea
                  id="message"
                  name="message"
                  required
                  className="w-full rounded-2xl border border-slate-200 p-5 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 font-medium transition-all"
                  rows={4}
                  placeholder={content.form.message}
                />
              </div>
              <button
                disabled={isPending}
                className={`group flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-red py-5 font-bold text-white text-xl uppercase tracking-wider transition-all shadow-md ${isPending ? "cursor-not-allowed opacity-50" : "hover:bg-brand-red/90 hover:scale-[1.01] active:scale-[0.99]"} focus:ring-4 focus:ring-brand-red/20 outline-none`}
              >
                {isPending ? "Sending..." : content.form.button}
                {!isPending && (
                  <Send
                    size={22}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
                    aria-hidden="true"
                  />
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
