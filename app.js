const { useState, useEffect } = React;

const words = ["apple", "banana", "cherry", "grape", "orange", "pear", "peach", "plum", "melon", "mango"];

function shuffle(src) {
  const copy = [...src];
  for (let i = 0; i < copy.length; i++) {
    const x = copy[i];
    const y = Math.floor(Math.random() * copy.length);
    copy[i] = copy[y];
    copy[y] = x;
  }
  return typeof src === "string" ? copy.join("") : copy;
}

function ScrambleGame() {
  const [gameWords, setGameWords] = useState(() => {
    const storedWords = localStorage.getItem("gameWords");
    return storedWords ? JSON.parse(storedWords) : shuffle(words);
  });

  const [originalWord, setOriginalWord] = useState(() => {
    const storedWord = localStorage.getItem("originalWord");
    return storedWord || gameWords[0];
  });

  const [currentWord, setCurrentWord] = useState(() => {
    const storedScrambled = localStorage.getItem("currentWord");
    return storedScrambled || shuffle(gameWords[0]);
  });

  const [score, setScore] = useState(() => parseInt(localStorage.getItem("score")) || 0);
  const [strikes, setStrikes] = useState(() => parseInt(localStorage.getItem("strikes")) || 0);
  const [input, setInput] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("gameWords", JSON.stringify(gameWords));
    localStorage.setItem("originalWord", originalWord);
    localStorage.setItem("currentWord", currentWord);
    localStorage.setItem("score", score);
    localStorage.setItem("strikes", strikes);
  }, [gameWords, originalWord, currentWord, score, strikes]);

  function handleGuess(event) {
    event.preventDefault();
    if (input.toLowerCase() === originalWord) {
      setScore(score + 1);
      setMessage("Correct!");

      const newWords = gameWords.filter(word => word !== originalWord);
      setGameWords(newWords);

      if (newWords.length > 0) {
        const newWord = newWords[0];
        setOriginalWord(newWord);
        setCurrentWord(shuffle(newWord));
      } else {
        setMessage("Game Over! You won! Click Restart.");
      }
    } else {
      setStrikes(strikes + 1);
      setMessage("Incorrect! Try again.");
      if (strikes + 1 >= 3) {
        setMessage("Game Over! Click Restart.");
      }
    }
    setInput("");
  }

  function handleRestart() {
    localStorage.clear();
    const newWords = shuffle(words);
    setGameWords(newWords);
    setOriginalWord(newWords[0]);
    setCurrentWord(shuffle(newWords[0]));
    setScore(0);
    setStrikes(0);
    setMessage("");
  }

  return (
    <div>
      <h1>Scramble Game</h1>
      {gameWords.length > 0 && strikes < 3 ? (
        <>
          <p>Scrambled Word: {currentWord}</p>
          <form onSubmit={handleGuess}>
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} required />
            <button type="submit">Guess</button>
          </form>
          <p>Score: {score} | Strikes: {strikes}/3</p>
          <p>{message}</p>
        </>
      ) : (
        <>
          <p>{message}</p>
          <button onClick={handleRestart}>Restart</button>
        </>
      )}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ScrambleGame />);
