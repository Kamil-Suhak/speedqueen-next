"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle, Smartphone, Globe } from "lucide-react";
import { sendEmail } from "@/actions/sendEmail";
import StatusModal from "@/components/StatusModal";
import SectionBackground from "@/components/SectionBackground";
import { motion } from "framer-motion";

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

export default function ContactAlt({ content, brandInfo, bgImage }: ContactProps) {
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
    <section id="contact" className="relative scroll-mt-20 py-32 bg-zinc-50 overflow-hidden" aria-labelledby="contact-heading">
      <SectionBackground imagePath={bgImage} />
      
      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <StatusModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal((prev) => ({ ...prev, isOpen: false }))}
        title={content.form.errorTitle}
        message={content.form.errorMessage}
        type="error"
        closeButtonText={content.form.buttonClose}
      />

      <div className="mx-auto max-w-7xl px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Panel: Information Dashboard */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-2/5 flex flex-col"
          >
            <div className="bg-zinc-900 text-white p-12 rounded-[40px] flex-1 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8">
                <Smartphone className="text-brand-red opacity-20" size={120} />
              </div>

              <div className="relative z-10">
                <h2 id="contact-heading" className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
                  {content.title}
                </h2>
                <div className="w-20 h-2 bg-brand-red mb-10" />
                <p className="text-xl text-zinc-400 font-medium leading-tight mb-16 max-w-sm">
                  {content.subtitle}
                </p>

                <div className="space-y-8">
                  <ContactInfoItem 
                    icon={<Mail size={24} />} 
                    label="Electronic Mail" 
                    value={brandInfo.email} 
                    href={`mailto:${brandInfo.email}`}
                  />
                  <ContactInfoItem 
                    icon={<Phone size={24} />} 
                    label="Voice Line" 
                    value={brandInfo.phone} 
                    href={`tel:${brandInfo.phone}`}
                  />
                  <ContactInfoItem 
                    icon={<MapPin size={24} />} 
                    label="Physical Hub" 
                    value={brandInfo.address} 
                  />
                </div>
              </div>

              {/* Bottom decorative bar */}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-brand-red" />
            </div>
          </motion.div>

          {/* Right Panel: The Interactive Terminal */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-3/5"
            aria-live="polite"
          >
            <div className="relative h-full">
              {/* Outer decorative frame */}
              <div className="absolute inset-0 border-4 border-zinc-900 rounded-[40px] translate-x-3 translate-y-3 pointer-events-none" />
              
              <div className={`h-full bg-white border-4 border-zinc-900 rounded-[40px] p-8 md:p-12 shadow-sm transition-all duration-500 ${isSuccess ? 'bg-zinc-50' : ''}`}>
                {isSuccess ? (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }} 
                      className="w-32 h-32 rounded-full bg-brand-red flex items-center justify-center mb-8"
                    >
                      <CheckCircle size={64} className="text-white" />
                    </motion.div>
                    <h3 className="text-4xl font-black text-zinc-900 uppercase tracking-tighter mb-4">
                      {content.form.successTitle}
                    </h3>
                    <p className="text-xl text-zinc-500 font-bold max-w-sm">
                      {content.form.successMessage}
                    </p>
                  </div>
                ) : (
                  <form action={handleSubmit} className="space-y-8" aria-label={content.title}>
                    <div className="grid md:grid-cols-2 gap-8">
                      <TerminalInput 
                        id="senderName" 
                        name="senderName" 
                        label={content.form.name} 
                        required 
                      />
                      <TerminalInput 
                        id="senderEmail" 
                        name="senderEmail" 
                        type="email" 
                        label={content.form.email} 
                        required 
                      />
                    </div>
                    <TerminalTextarea 
                      id="message" 
                      name="message" 
                      label={content.form.message} 
                      required 
                      rows={5} 
                    />
                    
                    <button
                      disabled={isPending}
                      className={`group relative flex w-full items-center justify-center gap-4 bg-zinc-900 py-6 px-10 rounded-2xl font-black text-white text-2xl uppercase tracking-[0.1em] transition-all hover:bg-brand-red hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
                    >
                      <span className="relative z-10">{isPending ? "transmitting..." : content.form.button}</span>
                      {!isPending && <Send size={28} className="relative z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />}
                      
                      {/* Button hover effect */}
                      <div className="absolute inset-0 bg-brand-red translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const ContactInfoItem = ({ icon, label, value, href }: { icon: React.ReactNode, label: string, value: string, href?: string }) => {
  const content = (
    <div className="group flex items-start gap-6 cursor-pointer">
      <div className="w-14 h-14 rounded-2xl border-2 border-zinc-700 flex items-center justify-center shrink-0 group-hover:border-brand-red group-hover:bg-brand-red transition-all duration-300">
        <span className="text-zinc-400 group-hover:text-white transition-colors">{icon}</span>
      </div>
      <div>
        <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">{label}</span>
        <span className="text-lg md:text-xl font-bold uppercase tracking-tight group-hover:text-brand-red transition-colors">{value}</span>
      </div>
    </div>
  );

  return href ? <a href={href} className="block">{content}</a> : content;
};

const TerminalInput = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="relative">
    <label htmlFor={props.id} className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">
      {label} <span className="text-brand-red">*</span>
    </label>
    <input
      {...props}
      className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-5 font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300"
      placeholder={`enter ${label.toLowerCase()}...`}
    />
  </div>
);

const TerminalTextarea = ({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <div className="relative">
    <label htmlFor={props.id} className="block text-xs font-black uppercase tracking-widest text-zinc-400 mb-3 ml-1">
      {label} <span className="text-brand-red">*</span>
    </label>
    <textarea
      {...props}
      className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-5 font-bold text-zinc-900 outline-none focus:border-zinc-900 focus:bg-white transition-all placeholder:text-zinc-300 resize-none"
      placeholder={`type your ${label.toLowerCase()}...`}
    />
  </div>
);
