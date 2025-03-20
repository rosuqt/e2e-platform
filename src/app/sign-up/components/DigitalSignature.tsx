"use client";
import { useEffect, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";

interface DigitalSignatureProps {
  setSignature: (signature: string | null) => void;
  onDone: () => void;
  signature: string | null;
}

export default function DigitalSignature({ setSignature, onDone, signature }: DigitalSignatureProps) {
  const sigCanvas = useRef<SignatureCanvas | null>(null);

  useEffect(() => {
    if (signature && sigCanvas.current) {
      sigCanvas.current.fromDataURL(signature);
    }
  }, [signature]);

  const saveSignature = () => {
    if (sigCanvas.current) {
      const signatureData = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      setSignature(signatureData);
      onDone();
    }
  };

  const clearSignature = () => {
    sigCanvas.current?.clear();
    setSignature(null);
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="border border-gray-500 w-1/2 h-40 bg-white relative">
        <SignatureCanvas ref={sigCanvas} penColor="black" canvasProps={{ width: 520, height: 160 }} />
      </div>
      <div className="mt-2 flex gap-5">
        <button onClick={saveSignature} className="px-6 py-2 bg-button text-white rounded-full">Done</button>
        <button onClick={clearSignature} className="px-6 py-2 border border-button rounded-full">Clear</button>
      </div>
    </div>
  );
}
