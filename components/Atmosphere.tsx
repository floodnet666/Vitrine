import React from 'react';

const Atmosphere: React.FC = () => {
  return (
    <>
      <div className="noise-bg" />
      <div className="scanline" />
      <div className="fixed inset-0 pointer-events-none z-40 bg-[radial-gradient(circle_at_center,_transparent_0%,_#000000_120%)]" />
    </>
  );
};

export default Atmosphere;