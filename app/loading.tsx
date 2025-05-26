"use client";
import React, { useEffect, useState } from 'react'
import Loader from "@/components/loader-smiley"

export default function Loading() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div
      style={{
        height: '100vh',
        background: '#eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '2px solid red'
      }}
    >
      {mounted && <Loader />}
    </div>
  )
}
