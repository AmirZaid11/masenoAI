import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, X, CornerDownRight } from 'lucide-react';
import { Message } from '../lib/grok';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  replyingTo?: Message | null;
  onCancelReply?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  isLoading, 
  replyingTo, 
  onCancelReply 
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const inputRef = useRef<HTMLTextAreaElement>(null);


  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      
      try {
        const silent = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(silent);
      } catch (e) {}
    } catch (err) {
      console.error("Error accessing microphone:", err);
      alert("Could not access microphone. Please ensure you've granted permission.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      console.log("Transcribing with Puter AI...");
      const result = await (window as any).puter.ai.speech2txt(blob);
      const transcript = typeof result === 'string' ? result : result.text;
      
      if (transcript && transcript.trim()) {
        console.log("Transcription successful:", transcript);
        onSendMessage(transcript);
        setText('');
      }
    } catch (err) {
      console.error("Transcription error:", err);
      alert("Failed to transcribe audio. Please try typing.");
    } finally {
      setIsTranscribing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text.trim());
      setText('');
      if (isListening) stopRecording();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`;
    }
  }, [text]);

  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [replyingTo]);

  const getPlaceholder = () => {
    if (isTranscribing) return "Transcribing voice...";
    if (isListening) return "Listening...";
    return replyingTo ? "Type your reply..." : "Ask MSU AI anything...";
  };

  return (
    <div className="fixed bottom-8 left-0 right-0 px-4 sm:px-6 z-50 pointer-events-none">
      <div className="max-w-3xl mx-auto flex flex-col gap-2 pointer-events-auto">
        {/* Reply Preview */}
        {replyingTo && (
          <div className="mx-4 px-4 py-2 bg-slate-100/80 dark:bg-slate-800/80 backdrop-blur-md rounded-t-2xl border-x border-t border-white/20 flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-300">
            <CornerDownRight size={16} className="text-[#00d2ff]" />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-[#00d2ff] uppercase tracking-wider block">
                Replying to {replyingTo.sender === 'user' ? 'You' : 'Assistant'}
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-300 truncate italic">
                {replyingTo.text}
              </p>
            </div>
            <button 
              onClick={onCancelReply}
              className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
            >
              <X size={14} className="text-slate-400" />
            </button>
          </div>
        )}

        <div className={`flex items-end gap-3 ${replyingTo ? 'mt-[-8px]' : ''}`}>
          <div className={`flex-1 glass-capsule shadow-2xl border border-white/20 overflow-hidden flex items-end p-2 min-h-[56px] transition-all focus-within:ring-4 focus-within:ring-[#00d2ff]/10 focus-within:border-[#00d2ff]/30 ${replyingTo ? 'rounded-tl-none' : ''}`}>
            <textarea
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={getPlaceholder()}
              className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-2.5 px-4 text-[15px] max-h-[120px] outline-none text-red-500 dark:text-red-400 font-bold placeholder:text-slate-400"
              rows={1}
              disabled={isTranscribing}
            />
          
          {(isListening || isTranscribing) && (
            <div className="flex gap-1 pr-4 pb-2.5 h-full items-center">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 shrink-0">
          <button
            onClick={toggleListening}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
              ${isListening 
                ? 'mic-active' 
                : 'bg-white/10 dark:bg-slate-800/40 text-slate-400 hover:text-red-500 hover:bg-red-500/10 border border-white/10'
              }
            `}
          >
            {isListening ? <MicOff size={20} /> : <Mic size={20} />}
          </button>

          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isLoading}
            className={`
              w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300
              ${text.trim() 
                ? 'bg-linear-to-br from-[#00d2ff] to-[#9d50bb] hover:shadow-[#00d2ff]/40 text-white active:scale-95' 
                : 'bg-white/10 dark:bg-slate-800/40 text-slate-300 opacity-50 cursor-not-allowed border border-white/10'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send size={20} />
            )}
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};
