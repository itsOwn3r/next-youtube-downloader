import Main from "@/components/Home/Main"


export default function Home() {
  return (
    <div className="size-full flex justify-between items-center flex-col min-h-[100dvh]">
      <div className="min-h-[15%]">header</div>
        <Main />
      <div className="min-h-[15%]">footer</div>
    </div>
  );
}
