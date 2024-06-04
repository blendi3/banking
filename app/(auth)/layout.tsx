import Image from "next/image";
import Image1 from "../../public/icons/bank-thumbnail.jpg";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen w-full justify-between font-inter">
      {children}
      <div className="auth-asset">
        <div>
          <Image
            className="rounded-l-xl border-y-4 border-l-4 border-black-1"
            src={Image1}
            alt="Auth Bank Images"
            width={550}
            height={550}
          />
        </div>
      </div>
    </main>
  );
}
