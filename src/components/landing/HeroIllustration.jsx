export default function HeroIllustration() {
  return (
    <div className="relative mx-auto h-[360px] w-full max-w-md select-none md:h-[440px] md:max-w-lg">
      {/* back envelope */}
      <svg
        viewBox="0 0 220 150"
        className="absolute left-1/2 top-6 w-[85%] -translate-x-1/2 drop-shadow-[0_18px_30px_rgba(73,60,52,0.18)] animate-[float-slow_7s_ease-in-out_infinite]"
        style={{ '--r': '-9deg' }}
      >
        <rect x="2" y="2" width="216" height="146" rx="10" fill="#DED2ED" />
        <path d="M2 12 L110 90 L218 12" fill="none" stroke="#B7A8CF" strokeWidth="3" />
      </svg>

      {/* front letter card, peeking out */}
      <svg
        viewBox="0 0 240 300"
        className="absolute left-1/2 top-16 w-[70%] -translate-x-1/2 drop-shadow-[0_20px_34px_rgba(73,60,52,0.22)] animate-[float-slow_8s_ease-in-out_infinite]"
        style={{ '--r': '4deg', animationDelay: '0.4s' }}
      >
        <rect x="2" y="2" width="236" height="296" rx="6" fill="#FBF5EA" stroke="#EADFC8" strokeWidth="2" />
        <line x1="28" y1="60" x2="212" y2="60" stroke="#E3D6BD" strokeWidth="2" />
        <line x1="28" y1="86" x2="212" y2="86" stroke="#E3D6BD" strokeWidth="2" />
        <line x1="28" y1="112" x2="180" y2="112" stroke="#E3D6BD" strokeWidth="2" />
        <line x1="28" y1="138" x2="200" y2="138" stroke="#E3D6BD" strokeWidth="2" />
        {/* wax seal */}
        <circle cx="200" cy="250" r="22" fill="#E9A9BA" />
        <path d="M200 236 l4 8 9 1 -6.5 6.5 1.5 9 -8-4.5 -8 4.5 1.5-9L188 245l9-1z" fill="#FBF5EA" opacity="0.85" />
      </svg>

      {/* front-most small envelope, bottom-left */}
      <svg
        viewBox="0 0 160 110"
        className="absolute bottom-2 left-0 w-[46%] drop-shadow-[0_14px_22px_rgba(73,60,52,0.2)] animate-[float-slow_6s_ease-in-out_infinite]"
        style={{ '--r': '-6deg', animationDelay: '0.9s' }}
      >
        <rect x="2" y="2" width="156" height="106" rx="8" fill="#F2D98E" />
        <path d="M2 10 L80 66 L158 10" fill="none" stroke="#DCB964" strokeWidth="3" />
      </svg>

      {/* stamp, top-right */}
      <svg
        viewBox="0 0 90 90"
        className="absolute right-2 top-0 w-[22%] drop-shadow-[0_10px_18px_rgba(73,60,52,0.18)] animate-[float-slow_5.5s_ease-in-out_infinite]"
        style={{ '--r': '12deg', animationDelay: '0.2s' }}
      >
        <rect x="4" y="4" width="82" height="82" fill="#C2D9E6" stroke="#493C34" strokeWidth="2" strokeDasharray="4 3" />
        <path d="M45 24 L54 40 L72 40 L58 51 L63 68 L45 58 L27 68 L32 51 L18 40 L36 40 Z" fill="#FBF5EA" />
      </svg>

      {/* floating star + heart accents */}
      <svg
        viewBox="0 0 40 40"
        className="absolute bottom-16 right-0 w-10 animate-[float-slow_4.5s_ease-in-out_infinite]"
        style={{ '--r': '8deg' }}
      >
        <path fill="#F2D98E" d="M20 2 L24 15 L38 15 L27 24 L31 38 L20 29 L9 38 L13 24 L2 15 L16 15 Z" />
      </svg>
      <svg
        viewBox="0 0 40 40"
        className="absolute bottom-28 left-8 w-8 animate-[float-slow_5s_ease-in-out_infinite]"
        style={{ '--r': '-10deg', animationDelay: '0.6s' }}
      >
        <path fill="#E9A9BA" d="M20 35 C4 24 2 12 11 7 C16 4 20 8 20 11 C20 8 24 4 29 7 C38 12 36 24 20 35 Z" />
      </svg>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(var(--r, 0deg)); }
          50% { transform: translateY(-10px) rotate(var(--r, 0deg)); }
        }
      `}</style>
    </div>
  )
}
