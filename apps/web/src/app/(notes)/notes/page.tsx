import Editor from "@/components/editor";

export default function NotesPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-3rem)] overflow-hidden">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <Editor />
      </div>
    </div>
  );
}
