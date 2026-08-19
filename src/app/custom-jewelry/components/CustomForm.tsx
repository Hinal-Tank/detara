'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';

// ─── Constants ────────────────────────────────────────────────────────────────
const JEWELRY_TYPES = [
  { value: 'Ring', icon: '◇', label: 'Ring' },
  { value: 'Necklace', icon: '◈', label: 'Necklace' },
  { value: 'Earrings', icon: '◉', label: 'Earrings' },
  { value: 'Bracelet', icon: '◻', label: 'Bracelet' },
  { value: 'Pendant', icon: '◎', label: 'Pendant' },
  { value: 'Other', icon: '◌', label: 'Other' },
];

const DIAMOND_PREFS = [
  { value: 'Natural Diamond', label: 'Natural Diamond', desc: 'Formed by nature over millions of years' },
  { value: 'Lab-Grown Diamond', label: 'Lab-Grown Diamond', desc: 'Same brilliance, more accessible' },
  { value: 'Not Sure / Need Guidance', label: 'Not Sure', desc: 'Our team will guide you' },
];

const DIAMOND_SHAPES = ['Round Brilliant', 'Princess', 'Oval', 'Cushion', 'Emerald', 'Pear', 'Marquise', 'Radiant', 'Asscher', 'Heart'];
const CARAT_OPTIONS = ['Under 0.50ct', '0.50–1.00ct', '1.00–1.50ct', '1.50–2.00ct', '2.00–3.00ct', '3.00ct+'];
const METAL_OPTIONS = ['18K White Gold', '18K Yellow Gold', '18K Rose Gold', '14K White Gold', '14K Yellow Gold', '14K Rose Gold', 'Platinum 950'];
const COLOUR_OPTIONS = ['D (Colourless)', 'E (Colourless)', 'F (Colourless)', 'G (Near-Colourless)', 'H (Near-Colourless)', 'I–J (Near-Colourless)'];
const BUDGET_RANGES = ['Under €3,000', '€3,000–€7,000', '€7,000–€15,000', '€15,000–€30,000', '€30,000+', 'Flexible / Discuss'];
const CONTACT_METHODS = ['Email', 'WhatsApp', 'Phone Call', 'Video Consultation'];
const PAYMENT_METHODS = ['Bank Transfer', 'Concierge Payment', 'Card Payment (coming soon)'];

const TOTAL_STEPS = 6;

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
}

interface FormData {
  // Step 1
  jewelryType: string;
  // Step 2
  diamondPref: string;
  // Step 3
  shape: string;
  carat: string;
  metal: string;
  colour: string;
  ringSize: string;
  budget: string;
  completionDate: string;
  additionalRequirements: string;
  // Step 4 — uploads handled separately
  // Step 5
  fullName: string;
  email: string;
  phone: string;
  country: string;
  preferredContact: string;
  preferredPayment: string;
  additionalMessage: string;
}

const initialForm: FormData = {
  jewelryType: '',
  diamondPref: '',
  shape: '',
  carat: '',
  metal: '',
  colour: '',
  ringSize: '',
  budget: '',
  completionDate: '',
  additionalRequirements: '',
  fullName: '',
  email: '',
  phone: '',
  country: '',
  preferredContact: 'Email',
  preferredPayment: 'Bank Transfer',
  additionalMessage: '',
};

// ─── Step Progress Bar ────────────────────────────────────────────────────────
function StepProgress({ current, total }: { current: number; total: number }) {
  const steps = ['Type', 'Diamond', 'Design', 'Inspiration', 'Details', 'Submit'];
  return (
    <div className="mb-10 md:mb-14">
      <div className="flex items-center justify-between mb-3">
        {steps.map((label, i) => {
          const stepNum = i + 1;
          const isActive = stepNum === current;
          const isDone = stepNum < current;
          return (
            <div key={label} className="flex flex-col items-center flex-1">
              <div className={`w-7 h-7 flex items-center justify-center text-[10px] font-medium transition-all duration-300 ${
                isDone
                  ? 'bg-[#B9924A] text-white'
                  : isActive
                  ? 'bg-[#211B18] text-[#FFFDF8]'
                  : 'bg-[#EEE7DC] text-[#9CA3AF]'
              }`}>
                {isDone ? '✓' : stepNum}
              </div>
              <span className={`text-[9px] mt-1.5 tracking-[0.15em] uppercase hidden sm:block transition-colors ${
                isActive ? 'text-[#211B18]' : isDone ? 'text-[#B9924A]' : 'text-[#9CA3AF]'
              }`}>{label}</span>
            </div>
          );
        })}
      </div>
      <div className="relative h-[1px] bg-[#E8E4DC] mt-1">
        <div
          className="absolute top-0 left-0 h-full bg-[#B9924A] transition-all duration-500"
          style={{ width: `${((current - 1) / (total - 1)) * 100}%` }}
        />
      </div>
    </div>
  );
}

// ─── Field components ─────────────────────────────────────────────────────────
function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[9px] tracking-[0.2em] uppercase text-[#766C63] mb-2 font-medium">
      {children}
      {required && <span className="text-[#B9924A] ml-1">*</span>}
    </label>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', required }: {
  value: string; onChange: (v: string) => void; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full bg-transparent border-b border-[rgba(28,25,23,0.15)] py-3.5 text-sm text-[#211B18] placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#B9924A] transition-colors"
    />
  );
}

function SelectChips({ options, value, onChange }: {
  options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-3.5 py-2 text-[10px] tracking-[0.15em] uppercase border transition-all duration-200 ${
            value === opt
              ? 'border-[#211B18] bg-[#211B18] text-[#FFFDF8]'
              : 'border-[rgba(28,25,23,0.15)] text-[#766C63] hover:border-[#B9924A] hover:text-[#B9924A]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ─── Image Upload ─────────────────────────────────────────────────────────────
function ImageUploadStep({
  uploads,
  onAdd,
  onRemove,
}: {
  uploads: UploadedFile[];
  onAdd: (files: UploadedFile[]) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  const MAX_SIZE_MB = 10;
  const MAX_FILES = 5;

  const processFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    setError('');
    const newUploads: UploadedFile[] = [];
    const remaining = MAX_FILES - uploads.length;

    Array.from(fileList).slice(0, remaining).forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        setError(`${file.name}: unsupported format. Use JPG, PNG, WEBP or PDF.`);
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setError(`${file.name}: file too large (max ${MAX_SIZE_MB}MB).`);
        return;
      }
      const preview = file.type === 'application/pdf' ?''
        : URL.createObjectURL(file);
      newUploads.push({ file, preview, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` });
    });

    if (newUploads.length > 0) onAdd(newUploads);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    processFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-[9px] tracking-[0.2em] uppercase text-[#B9924A] mb-3">Step 4 of 6</p>
        <h3 className="font-serif text-2xl md:text-3xl font-light text-[#211B18] mb-2">Upload Inspiration</h3>
        <p className="text-sm text-[#766C63] font-light leading-relaxed">
          Share reference images, sketches, or inspiration photos. Our designers will use these to understand your vision.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-none cursor-pointer transition-all duration-200 py-12 px-8 text-center ${
          dragOver
            ? 'border-[#B9924A] bg-[rgba(201,169,110,0.05)]'
            : 'border-[rgba(28,25,23,0.15)] hover:border-[#B9924A] bg-[#FFFDF8]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          className="hidden"
          onChange={(e) => processFiles(e.target.files)}
        />
        <div className="text-3xl text-[#B9924A] mb-4">⊕</div>
        <p className="text-sm text-[#211B18] font-light mb-1">
          Drop files here or <span className="text-[#B9924A]">click to browse</span>
        </p>
        <p className="text-[10px] text-[#9CA3AF] tracking-wide">
          JPG, PNG, WEBP, PDF · Max {MAX_SIZE_MB}MB per file · Up to {MAX_FILES} files
        </p>
        {uploads.length >= MAX_FILES && (
          <p className="text-[10px] text-[#B9924A] mt-2">Maximum {MAX_FILES} files reached</p>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-600 font-light">{error}</p>
      )}

      {/* Previews */}
      {uploads.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {uploads.map((u) => (
            <div key={u.id} className="relative group">
              <div className="aspect-square bg-[#F3EEE5] overflow-hidden">
                {u.preview ? (
                  <Image
                    src={u.preview}
                    alt={u.file.name}
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <span className="text-2xl text-[#B9924A]">📄</span>
                    <p className="text-[9px] text-[#766C63] mt-1 px-2 text-center truncate w-full">{u.file.name}</p>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => onRemove(u.id)}
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-[#211B18] text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove file"
              >
                ✕
              </button>
              <p className="text-[9px] text-[#766C63] mt-1 truncate">{u.file.name}</p>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-[#9CA3AF] font-light italic">
        Inspiration images are optional but help our designers understand your vision. Files are handled securely and not shared publicly.
      </p>
    </div>
  );
}

// ─── Main Form ────────────────────────────────────────────────────────────────
function CustomFormInner() {
  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ ...initialForm });
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Pre-fill from URL params (product reference)
  useEffect(() => {
    const name = searchParams?.get('name') || '';
    const metal = searchParams?.get('metal') || '';
    const diamond = searchParams?.get('diamond') || '';
    if (name) {
      setForm((f) => ({
        ...f,
        additionalRequirements: `Based on: ${name}${metal ? ` · Metal: ${metal}` : ''}${diamond ? ` · Diamond: ${diamond}` : ''}`,
      }));
    }
    if (metal) {
      const matched = METAL_OPTIONS.find((m) => m.toLowerCase().includes(metal.toLowerCase().replace(/\d+k\s*/i, '').trim()));
      if (matched) setForm((f) => ({ ...f, metal: matched }));
    }
    if (diamond) {
      if (diamond.toLowerCase().includes('lab')) setForm((f) => ({ ...f, diamondPref: 'Lab-Grown Diamond' }));
      else if (diamond.toLowerCase().includes('natural')) setForm((f) => ({ ...f, diamondPref: 'Natural Diamond' }));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key: keyof FormData) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: '' }));
  };

  const validateStep = (): boolean => {
    const errs: Partial<Record<keyof FormData, string>> = {};
    if (step === 1 && !form.jewelryType) errs.jewelryType = 'Please select a jewelry type';
    if (step === 2 && !form.diamondPref) errs.diamondPref = 'Please select a diamond preference';
    if (step === 5) {
      if (!form.fullName.trim()) errs.fullName = 'Name is required';
      if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Valid email is required';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: document.getElementById('custom-form')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const prevStep = () => {
    setStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: document.getElementById('custom-form')?.offsetTop ?? 0, behavior: 'smooth' });
  };

  const handleAddUploads = (newFiles: UploadedFile[]) => {
    setUploads((prev) => [...prev, ...newFiles].slice(0, 5));
  };

  const handleRemoveUpload = (id: string) => {
    setUploads((prev) => {
      const removed = prev.find((u) => u.id === id);
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return prev.filter((u) => u.id !== id);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;
    setSubmitting(true);
    setError('');

    try {
      // Build message summary
      const lines = [
        `Jewelry Type: ${form.jewelryType}`,
        `Diamond Preference: ${form.diamondPref}`,
        form.shape && `Diamond Shape: ${form.shape}`,
        form.carat && `Approximate Carat: ${form.carat}`,
        form.metal && `Metal: ${form.metal}`,
        form.colour && `Diamond Colour: ${form.colour}`,
        form.ringSize && `Ring Size: ${form.ringSize}`,
        form.budget && `Budget: ${form.budget}`,
        form.completionDate && `Desired Completion: ${form.completionDate}`,
        form.additionalRequirements && `Design Details: ${form.additionalRequirements}`,
        `Preferred Contact: ${form.preferredContact}`,
        `Preferred Payment: ${form.preferredPayment}`,
        form.phone && `Phone/WhatsApp: ${form.phone}`,
        form.country && `Country: ${form.country}`,
        form.additionalMessage && `Additional Message: ${form.additionalMessage}`,
        uploads.length > 0 && `Inspiration files uploaded: ${uploads.map((u) => u.file.name).join(', ')}`,
      ].filter(Boolean).join('\n');

      // Submit to concierge API
      const res = await fetch('/api/concierge/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lead_type: 'custom_request',
          customer_name: form.fullName.trim(),
          customer_email: form.email.trim(),
          customer_phone: form.phone?.trim() || null,
          message: lines,
          preferred_contact: form.preferredContact,
          preferred_payment: form.preferredPayment,
          payment_method: form.preferredPayment,
          product_config: [form.jewelryType, form.diamondPref, form.metal, form.carat].filter(Boolean).join(' · '),
          // Structured fields for email template
          jewelry_type: form.jewelryType || undefined,
          diamond_preference: form.diamondPref || undefined,
          product_metal: form.metal || undefined,
          budget: form.budget || undefined,
          requested_specs: [
            form.shape && `Shape: ${form.shape}`,
            form.carat && `Carat: ${form.carat}`,
            form.colour && `Colour: ${form.colour}`,
            form.ringSize && `Ring Size: ${form.ringSize}`,
            form.completionDate && `Completion: ${form.completionDate}`,
            form.additionalRequirements && `Details: ${form.additionalRequirements}`,
          ].filter(Boolean).join('\n') || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Submission failed');

      setReferenceNumber(json.referenceNumber || '');
      setSubmitted(true);
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to submit. Please try again or email concierge@detara.store');
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section id="custom-form" className="py-20 md:py-36 px-5 md:px-8 bg-[#FFFDF8]">
        <div className="max-w-[640px] mx-auto text-center">
          <div className="w-16 h-16 border border-[#B9924A] flex items-center justify-center mx-auto mb-8">
            <span className="text-[#B9924A] text-2xl">◇</span>
          </div>
          <p className="text-[9px] tracking-[0.3em] uppercase text-[#B9924A] mb-4">Request Received</p>
          <h2 className="font-serif text-3xl md:text-4xl font-light text-[#211B18] mb-4">
            Your Custom Request<br />
            <span className="italic font-light text-[#766C63]">Has Been Submitted</span>
          </h2>
          <div className="w-8 h-[1px] bg-[#B9924A] mx-auto my-6" />
          {referenceNumber && (
            <div className="bg-[#F3EEE5] border border-[rgba(28,25,23,0.08)] px-8 py-5 mb-8 inline-block">
              <p className="text-[9px] tracking-[0.2em] uppercase text-[#766C63] mb-1">Reference Number</p>
              <p className="font-serif text-xl text-[#211B18]">{referenceNumber}</p>
            </div>
          )}
          <p className="text-sm text-[#766C63] font-light leading-relaxed mb-6 max-w-md mx-auto">
            A DETARA specialist will review your request and contact you within 24 hours to begin your private consultation.
          </p>
          <div className="space-y-2 text-xs text-[#9CA3AF] font-light">
            <p>✓ Confirmation email sent to {form.email}</p>
            <p>✓ Your request has been saved securely</p>
            <p>✓ A DETARA designer will be in touch shortly</p>
          </div>
          <div className="mt-10 pt-8 border-t border-[rgba(28,25,23,0.08)]">
            <p className="text-xs text-[#9CA3AF] font-light mb-4">Need immediate assistance?</p>
            <a
              href="https://wa.me/442046148575"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border border-[rgba(28,25,23,0.15)] text-[10px] tracking-[0.2em] uppercase text-[#211B18] hover:border-[#B9924A] hover:text-[#B9924A] transition-colors"
            >
              WhatsApp Concierge
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="custom-form" className="py-20 md:py-36 px-5 md:px-8 bg-[#FFFDF8]">
      <div className="max-w-[760px] mx-auto">
        {/* Section header */}
        <div className="mb-10 md:mb-14">
          <p className="text-[9px] tracking-[0.35em] uppercase text-[#B9924A] mb-4">Begin Your Commission</p>
          <h2 className="font-serif text-[clamp(2rem,4.5vw,4.5rem)] font-light text-[#211B18] leading-[0.92]">
            Design Your<br />
            <span className="italic text-[#766C63]">Custom Piece</span>
          </h2>
        </div>

        <StepProgress current={step} total={TOTAL_STEPS} />

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-light">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* ── STEP 1: Jewelry Type ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#B9924A] mb-3">Step 1 of 6</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-[#211B18] mb-2">What Are You Creating?</h3>
                <p className="text-sm text-[#766C63] font-light">Select the type of jewellery you would like to commission.</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {JEWELRY_TYPES.map((jt) => (
                  <button
                    key={jt.value}
                    type="button"
                    onClick={() => set('jewelryType')(jt.value)}
                    className={`flex flex-col items-center gap-3 p-5 border transition-all duration-200 ${
                      form.jewelryType === jt.value
                        ? 'border-[#211B18] bg-[#211B18] text-[#FFFDF8]'
                        : 'border-[rgba(28,25,23,0.12)] text-[#766C63] hover:border-[#B9924A] hover:text-[#B9924A]'
                    }`}
                  >
                    <span className="text-xl">{jt.icon}</span>
                    <span className="text-[10px] tracking-[0.2em] uppercase">{jt.label}</span>
                  </button>
                ))}
              </div>
              {fieldErrors.jewelryType && (
                <p className="text-xs text-red-600">{fieldErrors.jewelryType}</p>
              )}
            </div>
          )}

          {/* ── STEP 2: Diamond Preference ───────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-8">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#B9924A] mb-3">Step 2 of 6</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-[#211B18] mb-2">Diamond Preference</h3>
                <p className="text-sm text-[#766C63] font-light">Choose your preferred diamond origin. Our team can guide you if you are unsure.</p>
              </div>
              <div className="space-y-3">
                {DIAMOND_PREFS.map((dp) => (
                  <button
                    key={dp.value}
                    type="button"
                    onClick={() => set('diamondPref')(dp.value)}
                    className={`w-full flex items-start gap-4 p-5 border text-left transition-all duration-200 ${
                      form.diamondPref === dp.value
                        ? 'border-[#211B18] bg-[#211B18] text-[#FFFDF8]'
                        : 'border-[rgba(28,25,23,0.12)] hover:border-[#B9924A]'
                    }`}
                  >
                    <div className={`w-4 h-4 mt-0.5 border flex-shrink-0 flex items-center justify-center ${
                      form.diamondPref === dp.value ? 'border-[#B9924A] bg-[#B9924A]' : 'border-[rgba(28,25,23,0.3)]'
                    }`}>
                      {form.diamondPref === dp.value && <span className="text-white text-[8px]">✓</span>}
                    </div>
                    <div>
                      <p className={`text-sm font-medium tracking-wide ${form.diamondPref === dp.value ? 'text-[#FFFDF8]' : 'text-[#211B18]'}`}>{dp.label}</p>
                      <p className={`text-xs font-light mt-0.5 ${form.diamondPref === dp.value ? 'text-[#FFFDF8]/70' : 'text-[#766C63]'}`}>{dp.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
              {fieldErrors.diamondPref && (
                <p className="text-xs text-red-600">{fieldErrors.diamondPref}</p>
              )}
            </div>
          )}

          {/* ── STEP 3: Design Details ───────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-8">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#B9924A] mb-3">Step 3 of 6</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-[#211B18] mb-2">Design & Style</h3>
                <p className="text-sm text-[#766C63] font-light">Share your preferences. All fields are optional — provide as much or as little as you like.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <FieldLabel>Preferred Diamond Shape</FieldLabel>
                  <SelectChips options={DIAMOND_SHAPES} value={form.shape} onChange={set('shape')} />
                </div>
                <div>
                  <FieldLabel>Approximate Carat Weight</FieldLabel>
                  <SelectChips options={CARAT_OPTIONS} value={form.carat} onChange={set('carat')} />
                </div>
                <div>
                  <FieldLabel>Preferred Metal</FieldLabel>
                  <SelectChips options={METAL_OPTIONS} value={form.metal} onChange={set('metal')} />
                </div>
                <div>
                  <FieldLabel>Diamond Colour Preference</FieldLabel>
                  <SelectChips options={COLOUR_OPTIONS} value={form.colour} onChange={set('colour')} />
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  {form.jewelryType === 'Ring' && (
                    <div>
                      <FieldLabel>Ring Size</FieldLabel>
                      <TextInput value={form.ringSize} onChange={set('ringSize')} placeholder="e.g. UK L, EU 52, US 6" />
                    </div>
                  )}
                  <div>
                    <FieldLabel>Budget Range</FieldLabel>
                    <SelectChips options={BUDGET_RANGES} value={form.budget} onChange={set('budget')} />
                  </div>
                </div>
                <div>
                  <FieldLabel>Desired Completion Date</FieldLabel>
                  <TextInput value={form.completionDate} onChange={set('completionDate')} placeholder="e.g. December 2025, No rush" />
                </div>
                <div>
                  <FieldLabel>Additional Design Requirements</FieldLabel>
                  <textarea
                    value={form.additionalRequirements}
                    onChange={(e) => set('additionalRequirements')(e.target.value)}
                    rows={4}
                    placeholder="Describe your vision, inspiration, occasion, or any specific details..."
                    className="w-full bg-transparent border border-[rgba(28,25,23,0.15)] p-4 text-sm text-[#211B18] placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#B9924A] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 4: Upload Inspiration ───────────────────────────────── */}
          {step === 4 && (
            <ImageUploadStep
              uploads={uploads}
              onAdd={handleAddUploads}
              onRemove={handleRemoveUpload}
            />
          )}

          {/* ── STEP 5: Customer Details ─────────────────────────────────── */}
          {step === 5 && (
            <div className="space-y-8">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#B9924A] mb-3">Step 5 of 6</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-[#211B18] mb-2">Your Details</h3>
                <p className="text-sm text-[#766C63] font-light">How should our team reach you?</p>
              </div>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel required>Full Name</FieldLabel>
                    <TextInput value={form.fullName} onChange={set('fullName')} placeholder="Your full name" required />
                    {fieldErrors.fullName && <p className="text-xs text-red-600 mt-1">{fieldErrors.fullName}</p>}
                  </div>
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <TextInput value={form.email} onChange={set('email')} placeholder="your@email.com" type="email" required />
                    {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <FieldLabel>Phone / WhatsApp</FieldLabel>
                    <TextInput value={form.phone} onChange={set('phone')} placeholder="+44 20 0000 0000" type="tel" />
                  </div>
                  <div>
                    <FieldLabel>Country</FieldLabel>
                    <TextInput value={form.country} onChange={set('country')} placeholder="United Kingdom" />
                  </div>
                </div>
                <div>
                  <FieldLabel>Preferred Contact Method</FieldLabel>
                  <SelectChips options={CONTACT_METHODS} value={form.preferredContact} onChange={set('preferredContact')} />
                </div>
                <div>
                  <FieldLabel>Preferred Payment Method</FieldLabel>
                  <SelectChips options={PAYMENT_METHODS} value={form.preferredPayment} onChange={set('preferredPayment')} />
                </div>
                <div>
                  <FieldLabel>Additional Message <span className="text-[#9CA3AF] normal-case tracking-normal text-[9px]">(optional)</span></FieldLabel>
                  <textarea
                    value={form.additionalMessage}
                    onChange={(e) => set('additionalMessage')(e.target.value)}
                    rows={3}
                    placeholder="Anything else you would like us to know..."
                    className="w-full bg-transparent border border-[rgba(28,25,23,0.15)] p-4 text-sm text-[#211B18] placeholder:text-[#9CA3AF]/60 focus:outline-none focus:border-[#B9924A] transition-colors resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 6: Review & Submit ──────────────────────────────────── */}
          {step === 6 && (
            <div className="space-y-8">
              <div>
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#B9924A] mb-3">Step 6 of 6</p>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-[#211B18] mb-2">Review & Submit</h3>
                <p className="text-sm text-[#766C63] font-light">Please review your request before submitting.</p>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Jewelry Type', value: form.jewelryType },
                  { label: 'Diamond Preference', value: form.diamondPref },
                  form.shape && { label: 'Diamond Shape', value: form.shape },
                  form.carat && { label: 'Carat Weight', value: form.carat },
                  form.metal && { label: 'Metal', value: form.metal },
                  form.budget && { label: 'Budget', value: form.budget },
                  form.completionDate && { label: 'Completion Date', value: form.completionDate },
                  { label: 'Name', value: form.fullName },
                  { label: 'Email', value: form.email },
                  form.phone && { label: 'Phone', value: form.phone },
                  form.country && { label: 'Country', value: form.country },
                  { label: 'Preferred Contact', value: form.preferredContact },
                  { label: 'Preferred Payment', value: form.preferredPayment },
                  uploads.length > 0 && { label: 'Inspiration Files', value: `${uploads.length} file${uploads.length > 1 ? 's' : ''} uploaded` },
                ].filter(Boolean).map((item) => {
                  if (!item) return null;
                  const { label, value } = item as { label: string; value: string };
                  if (!value) return null;
                  return (
                    <div key={label} className="flex gap-4 py-3 border-b border-[rgba(28,25,23,0.06)]">
                      <span className="text-[9px] tracking-[0.15em] uppercase text-[#9CA3AF] w-32 flex-shrink-0 pt-0.5">{label}</span>
                      <span className="text-sm text-[#211B18] font-light">{value}</span>
                    </div>
                  );
                })}
              </div>

              {form.additionalRequirements && (
                <div className="bg-[#F3EEE5] p-5 border-l-2 border-[#B9924A]">
                  <p className="text-[9px] tracking-[0.2em] uppercase text-[#766C63] mb-2">Design Details</p>
                  <p className="text-sm text-[#211B18] font-light leading-relaxed">{form.additionalRequirements}</p>
                </div>
              )}

              <div className="bg-[#F3EEE5] p-5 space-y-2">
                <p className="text-[9px] tracking-[0.2em] uppercase text-[#766C63] mb-3">What Happens Next</p>
                <p className="text-xs text-[#766C63] font-light">✓ A DETARA specialist will review your request within 24 hours</p>
                <p className="text-xs text-[#766C63] font-light">✓ You will receive a confirmation email with your reference number</p>
                <p className="text-xs text-[#766C63] font-light">✓ We will contact you via your preferred method to begin the consultation</p>
                <p className="text-xs text-[#766C63] font-light">✓ No payment is required at this stage</p>
              </div>
            </div>
          )}

          {/* ── Navigation ───────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-10 pt-8 border-t border-[rgba(28,25,23,0.08)]">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase text-[#766C63] hover:text-[#211B18] transition-colors"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3.5 bg-[#211B18] text-[#FFFDF8] text-[10px] tracking-[0.25em] uppercase hover:bg-[#B9924A] transition-colors"
              >
                Continue →
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex items-center gap-2 px-10 py-4 bg-[#B9924A] text-white text-[10px] tracking-[0.25em] uppercase hover:bg-[#B8935A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[200px] justify-center"
              >
                {submitting ? (
                  <>
                    <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Custom Request'
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

export default function CustomForm() {
  return (
    <Suspense fallback={
      <section className="py-20 md:py-36 px-5 md:px-8 bg-[#FFFDF8]">
        <div className="max-w-[760px] mx-auto animate-pulse space-y-6">
          <div className="h-4 bg-[#EEE7DC] w-1/4 rounded" />
          <div className="h-12 bg-[#EEE7DC] w-3/4 rounded" />
          <div className="h-64 bg-[#EEE7DC] rounded" />
        </div>
      </section>
    }>
      <CustomFormInner />
    </Suspense>
  );
}