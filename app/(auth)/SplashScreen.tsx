import logo from "@/app/icon.svg";

export default function SplashScreen() {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col gap-8 items-center justify-center animate-fade-splashscreen
        bg-[linear-gradient(to_bottom_left,var(--color-iplay-black),var(--color-iplay-night))]`}
    >
      <div
        className="size-40 animate-fade-in-scale bg-linear-to-br from-iplay-pink to-iplay-coral"
        style={{
          WebkitMask: `url(${logo.src}) center/contain no-repeat`,
          mask: `url(${logo.src}) center/contain no-repeat`,
        }}
      />
      <h1 className="font-poppins text-3xl font-bold animate-fade-in-ltr duration-300">iPlayMusic</h1>
    </div>
  );
}