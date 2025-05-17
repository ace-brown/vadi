import Header from "@/components/navigation/MainNavigation";

export default function ErrorPage() {
  return (
    <>
      <Header />
      <main className="flex flex-col justify-start items-center min-h-screen">
        <h1 className="text-red-600 font-bold text-2xl mt-12">
          صفحه مورد نظر پیدا نشد
        </h1>
      </main>
    </>
  );
}
