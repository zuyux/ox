import Image from "next/image";
import UpLink from '@/components/upLink'

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <div className="h-screen w-1/4 bg-[#111] rounded-3xl">
        <video>
          <source></source>
        </video>
      </div>
      <UpLink/>
    </main>
  );
}
