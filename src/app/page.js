'use client';

import { useState, useEffect } from 'react';
import TextToSpeech from './components/TextToSpeech';
import SpeechToText from './components/SpeechToText';

export default function VibalertApp() {
  const [textToSpeak, setTextToSpeak] = useState('');
  const [recognizedText, setRecognizedText] = useState('');
  const [availableVoices, setAvailableVoices] = useState([]);
  
  const [settings, setSettings] = useState({
    voiceSpeed: 1.0,
    selectedVoice: null,
    language: 'en-US'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
        setAvailableVoices(englishVoices);
        
        if (englishVoices.length > 0 && !settings.selectedVoice) {
          setSettings(prev => ({...prev, selectedVoice: englishVoices[0]}));
        }
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [settings.selectedVoice]);

  const getVoiceGender = (voice) => {
    const name = voice.name.toLowerCase();
    if (name.includes('female') || name.includes('woman') || name.includes('zira') || name.includes('hazel') || name.includes('karen') || name.includes('samantha')) {
      return 'female';
    } else if (name.includes('male') || name.includes('man') || name.includes('david') || name.includes('mark') || name.includes('alex')) {
      return 'male';
    }
    return 'unknown';
  };

  const maleVoices = availableVoices.filter(voice => getVoiceGender(voice) === 'male');
  const femaleVoices = availableVoices.filter(voice => getVoiceGender(voice) === 'female');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">      
      <div className="bg-gradient-to-r from-slate-800 to-slate-700 shadow-lg border-b-4 border-amber-400 p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-center text-white tracking-wider">
          VIBALERT
        </h1>
        <p className="text-center text-slate-200 mt-1 sm:mt-2 font-medium text-sm sm:text-base">
          Assistive Communication System
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        <TextToSpeech 
          textToSpeak={textToSpeak}
          setTextToSpeak={setTextToSpeak}
          settings={settings}
        />

        <SpeechToText 
          recognizedText={recognizedText}
          setRecognizedText={setRecognizedText}
          setTextToSpeak={setTextToSpeak}
          settings={settings}
        />

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 p-4 sm:p-6 lg:p-8">
          <h2 className="text-xl sm:text-2xl font-light text-slate-800 mb-4 sm:mb-6 border-b border-slate-200 pb-3">Voice Settings</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <label className="block text-base sm:text-lg font-medium text-slate-700 mb-3">
                Speech Speed
              </label>
              <input 
                type="range" 
                min="0.5" 
                max="2" 
                step="0.1"
                value={settings.voiceSpeed}
                onChange={(e) => setSettings(prev => ({...prev, voiceSpeed: parseFloat(e.target.value)}))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-sm text-slate-500 mt-1">
                <span>Slow</span>
                <span className="font-medium text-slate-700">{settings.voiceSpeed}x</span>
                <span>Fast</span>
              </div>
            </div>
            
            <div>
              <label className="block text-base sm:text-lg font-medium text-slate-700 mb-3">
                Voice Type
              </label>
              <div className="space-y-3">
                <div>
                  <button
                    className={`w-full py-3 px-4 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base font-medium ${
                      maleVoices.includes(settings.selectedVoice) 
                        ? 'border-blue-600 bg-blue-50 text-blue-800 shadow-md' 
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      if (maleVoices.length > 0) {
                        setSettings(prev => ({...prev, selectedVoice: maleVoices[0]}));
                      }
                    }}
                    disabled={maleVoices.length === 0}
                  >
                    Male Voice {maleVoices.length === 0 ? '(Not Available)' : ''}
                  </button>
                </div>
                <div>
                  <button
                    className={`w-full py-3 px-4 rounded-xl border-2 transition-all duration-200 text-sm sm:text-base font-medium ${
                      femaleVoices.includes(settings.selectedVoice) 
                        ? 'border-rose-500 bg-rose-50 text-rose-800 shadow-md' 
                        : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:shadow-sm'
                    }`}
                    onClick={() => {
                      if (femaleVoices.length > 0) {
                        setSettings(prev => ({...prev, selectedVoice: femaleVoices[0]}));
                      }
                    }}
                    disabled={femaleVoices.length === 0}
                  >
                    Female Voice {femaleVoices.length === 0 ? '(Not Available)' : ''}
                  </button>
                </div>
              </div>
              {settings.selectedVoice && (
                <p className="text-xs sm:text-sm text-slate-600 mt-3 italic">
                  Current: {settings.selectedVoice.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}