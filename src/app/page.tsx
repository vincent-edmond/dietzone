import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">DietZone</h1>
      <p className="mt-4 text-neutral-600">
        Expert en nutrition sportive — St-Denis, La Réunion.
      </p>
      <Button className="mt-8">Découvrir la boutique</Button>
    </main>
  );
}
