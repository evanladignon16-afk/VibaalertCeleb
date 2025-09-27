'use client';

import { useState, useRef, useEffect } from 'react';

export default function TextToSpeech({ textToSpeak, setTextToSpeak, settings }) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const handleSpeak = () => {
    if (synthRef.current && textToSpeak.trim()) {
      try {
        synthRef.current.cancel();
        
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = settings?.voiceSpeed || 1.0;
        utterance.lang = settings?.language || 'en-US';
        
        if (settings?.selectedVoice) {
          utterance.voice = settings.selectedVoice;
        }
        
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        
        synthRef.current.speak(utterance);
      } catch (error) {
        console.error('Speech synthesis error:', error);
        setIsSpeaking(false);
      }
    }
  };

  const handleStopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-light text-slate-800 mb-4 sm:mb-6 border-b border-slate-200 pb-3">Text to Speech</h2>
      
      <textarea
        className="w-full border-2 border-slate-200 rounded-xl p-3 sm:p-4 h-32 sm:h-40 resize-none text-base sm:text-lg leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium text-slate-800 bg-slate-50 transition-all duration-200"
        value={textToSpeak}
        onChange={(e) => setTextToSpeak(e.target.value)}
        placeholder="Type your message here..."
        maxLength={500}
      />
      
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6">
        <button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={handleSpeak}
          disabled={isSpeaking || !textToSpeak.trim()}
        >
          {isSpeaking ? 'Speaking...' : 'Speak Text'}
        </button>
        
        {isSpeaking && (
          <button 
            className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={handleStopSpeaking}
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}