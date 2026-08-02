import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useQuizStore } from '../store/quizStore';
import { CheckCircle2, Copy, Download, Share2, ShieldCheck, FileImage, ShieldAlert } from 'lucide-react';
import QRCode from 'react-qr-code';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReceiptRow = ({ label, value, icon, isHighlighted }: any) => (
  <motion.div 
    variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
    className="py-3 border-b border-slate-100 last:border-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
  >
    <div className="flex items-center gap-2 text-slate-500">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className={`text-base font-bold text-slate-800 ${isHighlighted ? 'text-brand-green bg-brand-green/10 px-3 py-1 rounded-lg' : ''}`}>
      {value}
    </div>
  </motion.div>
);

const SubmissionScreen: React.FC = () => {
  const { studentDetails, referenceNumber, activeQuestions, answers, timeRemaining } = useQuizStore();
  const receiptRef = useRef<HTMLDivElement>(null);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fire confetti once on mount
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#0F8A5F', '#D4AF37', '#ffffff'] });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#0F8A5F', '#D4AF37', '#ffffff'] });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleCopyRef = async () => {
    if (referenceNumber) {
      await navigator.clipboard.writeText(referenceNumber);
      alert('Reference Number Copied Successfully');
    }
  };

  const handleSaveImage = async () => {
    if (printRef.current) {
      try {
        const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false });
        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.download = `SKSSF_Receipt_${referenceNumber}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to save image', err);
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (printRef.current) {
      try {
        const canvas = await html2canvas(printRef.current, { scale: 2, useCORS: true, logging: false });
        const dataUrl = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width / 2, canvas.height / 2]
        });
        pdf.addImage(dataUrl, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2);
        pdf.save(`SKSSF_Receipt_${referenceNumber}.pdf`);
      } catch (err) {
        console.error('Failed to generate PDF', err);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SKSSF Quiz Submission Receipt',
          text: `My SKSSF Quiz Reference Number is ${referenceNumber}.`,
          url: window.location.origin
        });
      } catch (err) {
        console.error('Share failed', err);
      }
    } else {
      alert('Sharing is not supported on this device/browser.');
    }
  };

  const timeTaken = (15 * 60) - timeRemaining;
  const timeTakenFormatted = `${Math.floor(timeTaken / 60)} Mins ${timeTaken % 60} Secs`;
  const today = new Date();

  return (
    <div className="min-h-[100dvh] bg-brand-light relative pb-12 overflow-y-auto flex flex-col items-center z-0">
      {/* Header Section */}
      <div className="w-full bg-brand-green flex flex-col items-center relative rounded-b-[40px] shadow-lg pt-12 pb-24 z-0 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>

        <div className="relative z-10 flex flex-col items-center px-6 w-full max-w-2xl text-white">
          <div className="w-20 h-20 bg-white rounded-full p-2 shadow-xl mb-4">
            <img src="/flag.jpg" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold font-poppins tracking-widest uppercase text-center">SKSSF MUTTIPADI UNIT</h1>
          <h2 className="text-brand-gold font-bold text-sm tracking-[0.2em] mt-1 text-center">ONLINE QUIZ 2026</h2>
          <p className="mt-2 text-emerald-100 font-medium text-center">Official Quiz Submission Receipt</p>

          {/* Success Animation */}
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 }}
            className="mt-8 flex flex-col items-center w-full"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center text-brand-green mb-3">
              <CheckCircle2 size={40} className="drop-shadow-sm" />
            </div>
            <h3 className="text-xl font-bold text-white font-poppins drop-shadow-md text-center">Quiz Submitted Successfully</h3>
            <p className="text-emerald-50 text-sm text-center mt-1 drop-shadow-md">Your answers have been securely recorded on our server.</p>
          </motion.div>
        </div>
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center relative z-10 -mt-16">

        {/* Receipt Card */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.8 }}
          className="mt-8 px-4 w-full z-10"
        >
          <div 
            ref={receiptRef}
            className="bg-white/90 backdrop-blur-md rounded-[24px] shadow-2xl p-6 border border-white relative overflow-hidden"
          >
            {/* Subtle watermark in background */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none w-64 h-64 grayscale">
              <img src="/flag.jpg" alt="Watermark" className="w-full h-full object-contain" />
            </div>

            <motion.div 
              initial="hidden"
              animate="show"
              variants={{
                show: { transition: { staggerChildren: 0.1, delayChildren: 1.2 } }
              }}
              className="flex flex-col gap-2 relative z-10"
            >
              <ReceiptRow label="Student Name" value={studentDetails?.name || 'Mohammed Hisham CK'} />
              <ReceiptRow label="Phone Number" value={studentDetails?.phone || 'SKSSF202600125'} />
              
              <motion.div variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }} className="py-4 border-b border-slate-100 flex flex-col gap-2">
                <span className="text-sm font-medium text-slate-500">Reference Number</span>
                <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 flex items-center justify-between">
                  <span className="text-xl sm:text-2xl font-bold text-brand-green tracking-widest font-mono">
                    {referenceNumber || 'SKSSF-QZ-2026-00084521'}
                  </span>
                  <button onClick={handleCopyRef} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-green shadow-sm active:scale-95 transition-transform">
                    <Copy size={18} />
                  </button>
                </div>
              </motion.div>

              <ReceiptRow label="Date" value={today.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })} />
              <ReceiptRow label="Time" value={today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} />
              <ReceiptRow label="Quiz Name" value="SKSSF MUTTIPADI Islamic Quiz" />
              <ReceiptRow label="Unit" value="SKSSF MUTTIPADI UNIT" />
              <ReceiptRow label="Questions" value={`${Object.keys(answers).length} / ${activeQuestions.length || 50}`} />
              <ReceiptRow label="Time Taken" value={timeTakenFormatted} />
              
              <div className="py-3 flex justify-between items-center border-b border-slate-100">
                <span className="text-sm font-medium text-slate-500">Submission Status</span>
                <div className="flex items-center gap-1.5 text-brand-green bg-emerald-50 px-3 py-1 rounded-full font-bold text-sm">
                  <CheckCircle2 size={16} /> Successfully Submitted
                </div>
              </div>

              <div className="py-3 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">Server Status</span>
                <div className="flex items-center gap-1.5 text-brand-green font-bold text-sm">
                  <ShieldCheck size={16} /> Verified
                </div>
              </div>

              {/* QR Code */}
              <div className="mt-6 flex flex-col items-center justify-center border-t border-dashed border-slate-300 pt-8 pb-4">
                <div className="p-3 bg-white border border-slate-200 rounded-2xl shadow-sm">
                  <QRCode 
                    value={JSON.stringify({ ref: referenceNumber || '123', name: studentDetails?.name, time: today.toISOString() })} 
                    size={120} 
                    fgColor="#0F8A5F"
                  />
                </div>
                <p className="text-xs font-bold text-slate-400 mt-3 uppercase tracking-widest text-center">Scan to Verify Submission</p>
              </div>

            </motion.div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="px-4 mt-8 flex flex-col gap-3 w-full">
          <button onClick={handleDownloadPDF} className="w-full py-4 bg-gradient-to-r from-brand-green to-emerald-700 text-white rounded-[24px] font-bold shadow-lg shadow-brand-green/30 flex items-center justify-center gap-3 active:scale-95 transition-transform">
            <Download size={20} /> Download Receipt (PDF)
          </button>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <button onClick={handleSaveImage} className="py-3.5 bg-white text-slate-700 border border-slate-200 rounded-[20px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
              <FileImage size={18} className="text-brand-green" /> Save as Image
            </button>
            <button onClick={handleShare} className="py-3.5 bg-white text-slate-700 border border-slate-200 rounded-[20px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm">
              <Share2 size={18} className="text-brand-green" /> Share Receipt
            </button>
          </div>

          <button className="py-4 mt-2 bg-emerald-50 text-brand-green border border-emerald-100 rounded-[24px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform w-full">
            <ShieldAlert size={20} /> Verify Submission
          </button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-10 px-8 leading-relaxed font-medium">
          Thank you for participating in the SKSSF MUTTIPADI UNIT Online Quiz.<br/>
          Keep this receipt for future reference. For support, contact the admin with your Reference Number.
        </p>
      </div>

      {/* --- HIDDEN PRINT LAYOUT FOR PDF/IMAGE GENERATION --- */}
      <div className="absolute top-0 right-[200vw] z-[-9999] pointer-events-none opacity-0">
        <div 
          ref={printRef} 
          className="w-[800px] bg-white text-slate-800 relative font-poppins shadow-2xl p-0 overflow-hidden border border-slate-200"
        >
          {/* Print Watermark */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] w-[500px] h-[500px] grayscale">
            <img src="/flag.jpg" alt="" className="w-full h-full object-contain" />
          </div>

          {/* Premium Header */}
          <div className="bg-brand-green w-full p-8 flex items-center justify-between border-b-8 border-brand-gold relative">
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}></div>
            
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-24 h-24 bg-white rounded-full p-2 shadow-lg border-2 border-brand-gold/50">
                <img src="/flag.jpg" alt="Logo" className="w-full h-full object-contain" />
              </div>
              <div className="flex flex-col text-white">
                <h1 className="text-3xl font-bold tracking-widest uppercase shadow-black/20 text-shadow-sm">SKSSF MUTTIPADI UNIT</h1>
                <h2 className="text-brand-gold font-bold text-lg tracking-[0.25em] mt-1 shadow-black/20 text-shadow-sm">ONLINE QUIZ 2026</h2>
                <span className="mt-2 text-emerald-100 font-medium tracking-wider">OFFICIAL SUBMISSION RECEIPT</span>
              </div>
            </div>
            
            <div className="relative z-10 text-right text-emerald-50 opacity-80 self-end font-mono text-sm">
              <p>Generated on</p>
              <p>{today.toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-12 relative z-10">
            
            <div className="mb-10 text-center">
              <div className="inline-flex items-center gap-2 text-brand-green bg-emerald-50 px-6 py-2 rounded-full border border-emerald-100">
                <CheckCircle2 size={24} />
                <span className="font-bold text-lg tracking-wide uppercase">Successfully Submitted</span>
              </div>
              <p className="text-slate-500 mt-4 max-w-lg mx-auto text-sm leading-relaxed">
                This document serves as the official proof of participation and submission of answers for the SKSSF Muttipadi Online Islamic Quiz 2026.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-10">
              {/* Left Column - Details */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Student Details</p>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="mb-3">
                      <p className="text-[11px] text-slate-500 uppercase font-semibold">Name</p>
                      <p className="text-lg font-bold text-slate-800 capitalize">{studentDetails?.name || 'Mohammed Hisham CK'}</p>
                    </div>
                    <div className="mb-3">
                      <p className="text-[11px] text-slate-500 uppercase font-semibold">Father's Name</p>
                      <p className="text-base font-semibold text-slate-700 capitalize">{studentDetails?.fatherName || 'Unknown'}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 uppercase font-semibold">Phone Number</p>
                      <p className="text-base font-semibold text-slate-700 font-mono">{studentDetails?.phone || 'Unknown'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Exam Details */}
              <div className="flex flex-col gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Exam Details</p>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Date</p>
                      <p className="font-semibold text-slate-800">{today.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Time</p>
                      <p className="font-semibold text-slate-800">{today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Questions</p>
                      <p className="font-semibold text-slate-800">{Object.keys(answers).length} / {activeQuestions.length || 30}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 uppercase font-semibold mb-1">Time Taken</p>
                      <p className="font-semibold text-slate-800">{timeTakenFormatted}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Number Banner */}
            <div className="bg-gradient-to-r from-brand-green/10 to-brand-green/5 border border-brand-green/20 rounded-2xl p-6 flex items-center justify-between mb-10">
              <div>
                <p className="text-sm font-bold text-brand-green uppercase tracking-widest mb-1">Official Reference Number</p>
                <p className="text-3xl font-bold text-slate-800 font-mono tracking-[0.2em]">{referenceNumber || 'QZ-84521'}</p>
              </div>
              <div className="flex items-center gap-2 text-brand-green font-bold">
                <ShieldCheck size={24} />
                <span>Verified</span>
              </div>
            </div>

            {/* Footer with QR */}
            <div className="flex justify-between items-end border-t border-slate-200 pt-8">
              <div className="flex gap-6 items-center">
                <div className="p-3 bg-white border-2 border-slate-100 rounded-xl shadow-sm">
                  <QRCode 
                    value={JSON.stringify({ ref: referenceNumber, phone: studentDetails?.phone, time: today.toISOString() })} 
                    size={90} 
                    fgColor="#0F8A5F"
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700">Scan to Verify</p>
                  <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Keep this receipt secure. Do not share your reference number publicly.</p>
                </div>
              </div>
              
              <div className="text-center relative">
                <div className="w-28 h-28 mx-auto -mb-6 relative z-10 opacity-90">
                  <img src="/Seal.png" alt="Official Seal" className="w-full h-full object-contain" />
                </div>
                <div className="w-48 h-[1px] bg-slate-300 mx-auto mb-2 relative z-0"></div>
                <p className="text-sm font-bold text-slate-700">Authorized Signature</p>
                <p className="text-xs text-slate-400 mt-0.5">Quiz Administration Dept.</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionScreen;
