import Header from "@/components/Home/Header";
import Main from "@/components/Home/Main"
import db from "@/lib/db";


export default async function Home() {

  const proxy = await db.proxy.findUnique({
    where: {
      id: 0
    }
  })

  const quality = await db.quality.findUnique({
    where: {
      id: 0
    }
  })

  return (
    <div className="size-full flex justify-between items-center flex-col min-h-[100dvh]">
      <div className="min-h-[15%] w-full">
        <Header proxy={proxy} quality={quality?.quality || "480p"} />
      </div>
        <Main />
      <div className="min-h-[15%]">
        {/* FOOTER */}
      </div>
    </div>
  );
}
