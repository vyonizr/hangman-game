import {  useEffect, useState } from "react";
import Loader from './Loader'
import { WORD_URL, ALPHABET, ATTEMPTS } from '../constants'

function Game() {
  const [word, setWord] = useState<string>('')
  const [pressedKey, setPressedKey] = useState<string | null>(null)
  const [attemptsLeft, setAttemptsLeft] = useState(ATTEMPTS)
  const [guessedLetters, setGuessedLetters] = useState<(string | null)[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function fetchWord(): Promise<string> {
    try {
      const response = await fetch(WORD_URL)
      const data: string[] = await response.json()
      return data[0]
    } catch (error) {
      console.error(error)
      return ''
    }
  }

  useEffect(() => {
    const getWord = async () => {
      try {
        setIsLoading(true)
        const word = await fetchWord()
        setWord(word)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    getWord()
  }, [])

  useEffect(() => {
    setGuessedLetters(Array(word.length).fill(null))
  }, [word])

  const restartGame = async () => {
    try {
      setIsLoading(true)
      setAttemptsLeft(ATTEMPTS)
      const word = await fetchWord()
      setWord(word)
      setGuessedLetters(Array(word.length).fill(null))
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const { key } = event
      const isAlphabet = ALPHABET.includes(key.toLowerCase())

      if (isGameEnd && key === 'Enter') {
        restartGame()
      } else if (isAlphabet) {
        setPressedKey(key)
        validateLetter(key)
      }
    }

    const handleKeyUp = () => {
      setPressedKey(null)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  })

  const validateLetter = (playerLetter: string) => {
    const updatedLetters = [...guessedLetters]
    let isLetterFound = false

    for (let i = 0; i < word.length; i++) {
      const letter = word[i]
      if (word[i] === playerLetter.toLowerCase()) {
        updatedLetters[i] = letter
        isLetterFound = true
      }
    }

    if (!isLetterFound && attemptsLeft > 0 && !isGameEnd) {
      setAttemptsLeft((prevState) => prevState - 1)
    } else {
      setGuessedLetters(updatedLetters)
    }
  }

  const isWin =
    guessedLetters.length > 0 &&
    guessedLetters.every((letter) => letter !== null)
  const isLose = attemptsLeft === 0
  const isGameEnd = isWin || isLose

  const RestartButton = () => (
    <button
      onClick={restartGame}
      className='mt-2 px-4 py-2 bg-blue-500 text-white rounded'
    >
      Play Again
    </button>
  )

  const handleAttemptColor = (attemptsLeft: number) => {
    if (attemptsLeft > 5) {
      return 'text-green-600'
    } else if (attemptsLeft > 2) {
      return 'text-yellow-600'
    } else {
      return 'text-red-600'
    }
  }

  return (
    <>
      {isLoading ? (
        <Loader className="self-center mt-8" />
      ) : (
        <>
          <h2 className="uppercase inline-flex gap-4 justify-center text-center text-3xl mt-8">
            {guessedLetters.map((letter, i) => (
              <span key={i}>{letter !== null ? letter : "_"}</span>
            ))}
          </h2>
          <h3
            className={`text-center text-2xl mt-4 font-bold ${handleAttemptColor(
              attemptsLeft
            )}`}
          >
            {attemptsLeft}
          </h3>
          <div className="inline-flex flex-wrap justify-center gap-4 mt-4 px-4">
            {ALPHABET.map((letter, i) => (
              <button
                className={`uppercase border w-11 h-11 border-gray-800 p-2 text-center focus:outline-none lg:hover:bg-blue-500 lg:hover:text-white ${
                  pressedKey === letter ? "bg-blue-500 text-white" : "bg-white"
                }`}
                key={i}
                onClick={() => validateLetter(letter)}
              >
                {letter}
              </button>
            ))}
          </div>
          {isLose ? (
            <p className="uppercase text-2xl tracking-widest mt-8 text-center">
              {word}
            </p>
          ) : null}
          <div className="flex flex-col items-center mt-4">
            {isGameEnd ? (
              <>
                <h1>{isWin ? "You win!" : "Better luck next time!"}</h1>
                <RestartButton />
              </>
            ) : null}
          </div>
        </>
      )}
    </>
  )
}

export default Game