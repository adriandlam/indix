import Editor from "@/components/editor";

export default async function NotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden">
      <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <Editor noteId={id ?? undefined} />
      </div>
    </div>
  );
}
