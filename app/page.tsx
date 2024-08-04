import Board from "@/components/Board";
import Header from "@/components/Header";
import { Providers } from "./Provider";

export default function Home() {
  return (
    <Providers>
      <main>
        <Header />
        <Board />
      </main>
    </Providers>
  );
}
