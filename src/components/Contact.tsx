"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import { sendEmail } from "@/actions/sendEmail";
import StatusModal from "@/components/StatusModal";
import { getSystemErrorName } from "util";

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
}

export default function Contact({ content, brandInfo }: ContactProps) {
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
    <section id="contact" className="scroll-mt-20 bg-gray-50 py-24">
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
          <h2 className="mb-6 text-4xl font-bold">{content.title}</h2>
          <p className="mb-10 text-lg text-gray-600">{content.subtitle}</p>
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Mail className="text-blue-600" /> <span>{brandInfo.email}</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-blue-600" /> <span>{brandInfo.phone}</span>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-blue-600" />{" "}
              <span>{brandInfo.address}</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {isSuccess ? (
            <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-blue-100 bg-blue-50 p-12 text-center">
              <CheckCircle size={48} className="mb-4 text-blue-600" />
              <h3 className="mb-2 text-2xl font-bold text-gray-900">
                {content.form.successTitle}
              </h3>
              <p className="text-gray-600">{content.form.successMessage}</p>
            </div>
          ) : (
            <form
              action={handleSubmit}
              className="space-y-4 rounded-3xl border border-gray-100 bg-gray-50 p-8 shadow-sm"
            >
              <input
                name="senderName"
                required
                className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder={content.form.name}
              />
              <input
                name="senderEmail"
                type="email"
                required
                className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-600"
                placeholder={content.form.email}
              />
              <textarea
                name="message"
                required
                className="w-full rounded-xl border p-4 outline-none focus:ring-2 focus:ring-blue-600"
                rows={4}
                placeholder={content.form.message}
              />
              <button
                disabled={isPending}
                className={`group flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition ${isPending ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700"}`}
              >
                {isPending ? "Sending..." : content.form.button}
                {!isPending && (
                  <Send
                    size={18}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
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
