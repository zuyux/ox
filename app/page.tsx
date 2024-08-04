import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <input type="text" name="share" placeholder="Share Video Link"
        className="px-4 py-4 rounded-md bg-transparent border-[1px] border-[#333]"
      ></input>
    </main>
  );
}
