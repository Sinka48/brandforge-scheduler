export function GradientBackground() {
  return (
    <div 
      className="absolute inset-0 z-0"
      style={{
        backgroundColor: '#ff99df',
        backgroundImage: `
          radial-gradient(circle at 52% 73%, hsla(310, 85%, 67%, 1) 0px, transparent 50%),
          radial-gradient(circle at 0% 30%, hsla(197, 90%, 76%, 1) 0px, transparent 50%),
          radial-gradient(circle at 41% 26%, hsla(234, 79%, 69%, 1) 0px, transparent 50%),
          radial-gradient(circle at 41% 51%, hsla(41, 70%, 63%, 1) 0px, transparent 50%),
          radial-gradient(circle at 41% 88%, hsla(36, 83%, 61%, 1) 0px, transparent 50%),
          radial-gradient(circle at 76% 73%, hsla(346, 69%, 70%, 1) 0px, transparent 50%),
          radial-gradient(circle at 29% 37%, hsla(272, 96%, 64%, 1) 0px, transparent 50%)
        `,
        backgroundSize: '150% 150%',
        filter: 'blur(80px)',
        animation: 'moveBackground 10s linear infinite',
      }}
    />
  );
}