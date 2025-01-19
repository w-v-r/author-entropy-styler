import ColorfulEditor from './components/ColorfulEditor.tsx';

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Colorful Text Editor
      </h1>
      <ColorfulEditor />
    </main>
  );
}
