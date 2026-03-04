"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { sendEmail } from "@/actions/sendEmail";
import StatusModal from "@/components/StatusModal";
import { sectionBackgroundStyle } from "@/lib/background-manager";

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
  brandInfo: { email: string; phone: string; address: string };
  bgImage?: string;
}

export default function Contact({ content, brandInfo, bgImage }: ContactProps) {
  const [isPending, setIsPending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
  });

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
    <section id="contact" className="scroll-mt-20 py-24" style={sectionBackgroundStyle(bgImage)}>
      <StatusModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
        title={content.form.errorTitle}
        message={content.form.errorMessage}
        type="error"
        closeButtonText={content.form.buttonClose}
      />

      <div className="mx-auto grid max-w-7xl gap-16 px-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-6 text-4xl font-extrabold uppercase tracking-tight">{content.title}</h2>
          <div className="mb-8 h-1 w-16 bg-brand-red rounded-full" />
          <p className="mb-10 text-lg text-gray-600 font-normal leading-relaxed">{content.subtitle}</p>
          <div className="space-y-6">
            <div className="flex items-center gap-5 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors shadow-sm">
                <Mail size={22} />
              </div>
              <span className="font-bold uppercase tracking-tight text-gray-900">{brandInfo.email}</span>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-brand-red group-hover:bg-brand-red group-hover:text-white transition-colors shadow-sm">
                <Phone size={22} />
              </div>
              <span className="font-bold uppercase tracking-tight text-gray-900">{brandInfo.phone}</span>
            </div>
            <div className="flex items-center gap-5 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border border-slate-100 text-zinc-600 group-hover:bg-zinc-900 group-hover:text-white transition-colors shadow-sm">
                <MapPin size={22} />
              </div>
              <span className="font-bold uppercase tracking-tight text-gray-900">{brandInfo.address}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {isSuccess ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-slate-100 bg-white/90 backdrop-blur-sm p-12 text-center shadow-md">
              <CheckCircle size={64} className="mb-6 text-brand-red" />
              <h3 className="mb-4 text-3xl font-extrabold text-gray-900 uppercase tracking-tight">
                {content.form.successTitle}
              </h3>
              <p className="text-gray-600 font-normal text-lg">{content.form.successMessage}</p>
            </div>
          ) : (
            <form
              action={handleSubmit}
              className="space-y-4 rounded-3xl border border-slate-100 bg-white/90 backdrop-blur-sm p-10 shadow-sm"
            >
              <input
                name="senderName"
                required
                className="w-full rounded-2xl border border-slate-200 p-5 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 font-medium transition-all"
                placeholder={content.form.name}
              />
              <input
                name="senderEmail"
                type="email"
                required
                className="w-full rounded-2xl border border-slate-200 p-5 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 font-medium transition-all"
                placeholder={content.form.email}
              />
              <textarea
                name="message"
                required
                className="w-full rounded-2xl border border-slate-200 p-5 outline-none focus:border-brand-red focus:ring-4 focus:ring-brand-red/5 font-medium transition-all"
                rows={4}
                placeholder={content.form.message}
              />
              <button
                disabled={isPending}
                className={`group flex w-full items-center justify-center gap-3 rounded-2xl bg-brand-red py-5 font-bold text-white text-xl uppercase tracking-wider transition-all shadow-md ${isPending ? "cursor-not-allowed opacity-50" : "hover:bg-brand-red/90 hover:scale-[1.01] active:scale-[0.99]"}`}
              >
                {isPending ? "Sending..." : content.form.button}
                {!isPending && (
                  <Send
                    size={22}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
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
