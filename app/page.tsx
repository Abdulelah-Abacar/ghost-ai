import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Ghost AI</p>
      <Button className="ml-4" variant="default">
        Get Started
      </Button>
    </div>
  );
}
