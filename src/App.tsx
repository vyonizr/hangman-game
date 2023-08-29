import Game from './components/Game'

function App() {
  return (
    <main className="mt-12 flex flex-col max-w-[560px]">
      <h1 className="font-bold text-center text-5xl uppercase italic">
        Hangman
      </h1>
      <Game />
    </main>
  )
}

export default App
