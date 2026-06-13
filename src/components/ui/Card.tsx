export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="glass animate-fade-up rounded-4xl p-6 sm:p-7">
      {children}
    </div>
  );
}
