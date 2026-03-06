"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Card {
  id: string;
  front: string;
  back: string;
}

interface StudySessionProps {
  cards: Card[];
  deckId: string;
  deckName: string;
}

export function StudySession({ cards, deckId, deckName }: StudySessionProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionScore, setSessionScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime] = useState(new Date());
  const router = useRouter();

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  // Load persistent score and progress from localStorage
  useEffect(() => {
    const savedScore = localStorage.getItem(`study-score-${deckId}`);
    if (savedScore) {
      setSessionScore(parseInt(savedScore, 10));
    }

    const savedProgress = localStorage.getItem(`study-progress-${deckId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      // Resume from where user left off
      if (progress.studiedCards < cards.length) {
        setCurrentCardIndex(progress.studiedCards);
      }
    }

    // Update streak when starting a study session
    updateStreak();
  }, [deckId, cards.length]);

  // Update streak function
  const updateStreak = () => {
    const streakData = localStorage.getItem('study-streak-data');
    if (streakData) {
      const data = JSON.parse(streakData);
      const today = new Date().toDateString();
      const lastStudy = new Date(data.lastStudyDate).toDateString();
      
      if (today !== lastStudy) {
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastStudy === yesterday) {
          // Continue streak
          data.currentStreak += 1;
          data.studyDates.push(today);
        } else {
          // Start new streak
          data.currentStreak = 1;
          data.studyDates = [today];
        }
        
        data.lastStudyDate = new Date().toISOString();
        
        // Update longest streak
        if (data.currentStreak > data.longestStreak) {
          data.longestStreak = data.currentStreak;
        }
        
        localStorage.setItem('study-streak-data', JSON.stringify(data));
      }
    }
  };

  // Save score and progress to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`study-score-${deckId}`, sessionScore.toString());
  }, [sessionScore, deckId]);

  useEffect(() => {
    const progressData = {
      studiedCards: currentCardIndex + 1,
      lastStudied: new Date().toISOString(),
      score: sessionScore
    };
    localStorage.setItem(`study-progress-${deckId}`, JSON.stringify(progressData));
  }, [currentCardIndex, deckId, sessionScore]);

  const handleAnswer = (isCorrect: boolean) => {
    setTotalAttempts(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setSessionScore(prev => prev + 10);
    } else {
      setSessionScore(prev => Math.max(0, prev - 5));
    }

    setShowAnswer(false);
    
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setIsCompleted(false);
  };

  const handleExit = () => {
    router.push(`/decks/${deckId}`);
  };

  if (cards.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-indigo-950/30 via-zinc-950 to-cyan-950/30">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-zinc-100">No cards to study</h1>
          <p className="mt-2 text-zinc-400">This deck doesn't have any flashcards yet.</p>
          <button
            onClick={handleExit}
            className="mt-6 rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
          >
            Go Back to Deck
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
    const studyTime = Math.round((new Date().getTime() - startTime.getTime()) / 60000); // minutes

    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-indigo-950/30 via-zinc-950 to-cyan-950/30">
        <div className="w-full max-w-md rounded-3xl bg-black px-8 py-8 text-white shadow-2xl ring-2 ring-gray-800 backdrop-blur">
          <div className="text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 ring-2 ring-green-500/30">
              <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-semibold text-zinc-100">Session Complete!</h2>
            <p className="mt-2 text-sm text-zinc-400">{deckName}</p>
            
            <div className="mt-6 space-y-4">
              <div className="rounded-lg bg-gray-900 px-4 py-3">
                <p className="text-xs text-gray-400">Accuracy</p>
                <p className="text-2xl font-semibold text-zinc-100">{accuracy}%</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-gray-900 px-4 py-3">
                  <p className="text-xs text-gray-400">Correct</p>
                  <p className="text-lg font-semibold text-green-400">{correctAnswers}</p>
                </div>
                <div className="rounded-lg bg-gray-900 px-4 py-3">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="text-lg font-semibold text-zinc-100">{totalAttempts}</p>
                </div>
              </div>
              
              <div className="rounded-lg bg-gray-900 px-4 py-3">
                <p className="text-xs text-gray-400">Session Score</p>
                <p className="text-2xl font-semibold text-yellow-400">{sessionScore}</p>
              </div>
              
              <div className="rounded-lg bg-gray-900 px-4 py-3">
                <p className="text-xs text-gray-400">Study Time</p>
                <p className="text-lg font-semibold text-zinc-100">{studyTime} min</p>
              </div>
            </div>
            
            <div className="mt-8 flex gap-3">
              <button
                onClick={handleRestart}
                className="flex-1 rounded-lg bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 ring-1 ring-gray-600 transition hover:bg-gray-700"
              >
                Study Again
              </button>
              <button
                onClick={handleExit}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
              >
                Back to Deck
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-linear-to-b from-indigo-950/30 via-zinc-950 to-cyan-950/30">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-black/50 px-6 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100">{deckName}</h1>
            <p className="text-sm text-zinc-400">Study Session</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-zinc-400">Session Score</p>
              <p className="text-lg font-semibold text-yellow-400">{sessionScore}</p>
            </div>
            
            <div className="text-right">
              <p className="text-xs text-zinc-400">Progress</p>
              <p className="text-lg font-semibold text-zinc-100">{Math.round(progress)}%</p>
            </div>
            
            <button
              onClick={handleExit}
              className="rounded-lg bg-red-600/20 px-4 py-2 text-sm font-medium text-red-400 ring-1 ring-red-400/30 transition hover:bg-red-600/30 hover:text-red-300"
            >
              Exit Session
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-zinc-900">
        <div 
          className="h-full bg-linear-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 items-center justify-center px-6 py-12">
        <div className="mx-auto w-full max-w-2xl">
          <div className="rounded-3xl bg-black px-8 py-12 shadow-2xl ring-2 ring-gray-800">
            {/* Card Number */}
            <div className="mb-6 text-center">
              <p className="text-sm text-zinc-400">
                Card {currentCardIndex + 1} of {cards.length}
              </p>
            </div>

            {/* Card Content */}
            <div className="mb-8 text-center">
              <div className="mb-6">
                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-400">Front</p>
                <p className="mt-3 text-xl text-zinc-100">{currentCard.front}</p>
              </div>
              
              {showAnswer && (
                <div className="mt-8 border-t border-zinc-800 pt-8">
                  <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">Back</p>
                  <p className="mt-3 text-xl text-zinc-200">{currentCard.back}</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4">
              {!showAnswer ? (
                <button
                  onClick={() => setShowAnswer(true)}
                  className="rounded-lg bg-indigo-600 px-8 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
                >
                  Show Answer
                </button>
              ) : (
                <>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-red-500/20 transition hover:bg-red-700"
                  >
                    Incorrect
                  </button>
                  <button
                    onClick={() => handleAnswer(true)}
                    className="rounded-lg bg-green-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-green-500/20 transition hover:bg-green-700"
                  >
                    Correct
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
