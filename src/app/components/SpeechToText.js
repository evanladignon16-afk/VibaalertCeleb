'use client';

import { useState, useRef, useEffect } from 'react';

export default function SpeechToText({ recognizedText, setRecognizedText, setTextToSpeak, settings }) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [volume, setVolume] = useState(0);
  
  const recognitionRef = useRef(null);
  const volumeIntervalRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        setIsSupported(true);
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = settings?.language || 'en-US';

        recognitionRef.current.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setRecognizedText(transcript);
          setVolume(Math.floor(Math.random() * 5) + 1);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          setVolume(0);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          setVolume(0);
        };
      }
    }
  }, [settings?.language, setRecognizedText]);

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        setRecognizedText('');
        
        volumeIntervalRef.current = setInterval(() => {
          setVolume(Math.floor(Math.random() * 5) + 1);
        }, 100);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setVolume(0);
      
      if (volumeIntervalRef.current) {
        clearInterval(volumeIntervalRef.current);
      }
    }
  };

  const clearTranscript = () => {
    setRecognizedText('');
  };

  const VolumeIndicator = () => (
    <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6 bg-slate-50 rounded-xl p-4 border border-slate-200">
      <span className="text-base sm:text-lg font-medium text-slate-700">
        {isListening ? 'Listening' : 'Ready'}
      </span>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`w-2 sm:w-3 h-6 sm:h-8 rounded-sm transition-all duration-200 ${
              volume >= level 
                ? (isListening ? 'bg-emerald-500 shadow-sm' : 'bg-slate-300')
                : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
      <h2 className="text-xl sm:text-2xl font-light text-slate-800 mb-4 sm:mb-6 border-b border-slate-200 pb-3">Speech to Text</h2>
      
      <VolumeIndicator />
      
      <div className="mb-4 sm:mb-6">
        <button 
          className={`w-full font-medium py-3 sm:py-4 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
            isListening 
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white' 
              : 'bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white'
          } ${
            !isSupported ? 'from-slate-400 to-slate-500 cursor-not-allowed' : ''
          }`}
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
        >
          {isListening ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>

      {!isSupported && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
          <p className="text-amber-800 text-base sm:text-lg font-medium">
            Speech recognition not supported. Use Chrome, Edge, or Safari.
          </p>
        </div>
      )}

      {recognizedText && (
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 border-2 border-slate-200 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-3 sm:mb-4">Recognized Speech:</h3>
          <div className="bg-white border-2 border-slate-300 rounded-xl p-4 sm:p-6 mb-3 sm:mb-4 shadow-inner">
            <p className="text-slate-900 text-lg sm:text-xl lg:text-2xl leading-relaxed font-medium break-words">
              {recognizedText}
            </p>
          </div>
          
          <div className="flex justify-center">
            <button 
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white font-medium py-3 px-4 sm:px-6 rounded-xl text-base sm:text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={clearTranscript}
            >
              Clear Text
            </button>
          </div>
        </div>
      )}
    </div>
  );
}