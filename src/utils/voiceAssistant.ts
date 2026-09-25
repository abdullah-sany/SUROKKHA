/**
 * Voice Assistant Utility for Rural Healthcare
 * Provides native text-to-speech in Bengali (and English)
 * for low-literacy or elderly rural patients.
 */

class VoiceAssistant {
  private synth: SpeechSynthesis | null = null;
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public speak(
    text: string,
    language: 'bn' | 'en' = 'bn',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.synth) {
      if (onError) onError('Speech synthesis not supported');
      return;
    }

    // Stop any ongoing speech
    this.stop();

    // Clean up text: remove markdown symbols (*, #, _, `, etc.)
    const cleanText = text
      .replace(/[*#_`~>\[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    this.currentUtterance = utterance;

    // Select suitable voice
    if (language === 'bn') {
      utterance.lang = 'bn-BD';
      // Find Bengali voice if available
      const voices = this.synth.getVoices();
      const bnVoice = voices.find(
        (v) => v.lang.startsWith('bn') || v.lang.includes('Bengali') || v.name.includes('Bangla')
      );
      if (bnVoice) {
        utterance.voice = bnVoice;
      }
      utterance.rate = 0.95; // Slightly slower for clarity in rural healthcare guidance
    } else {
      utterance.lang = 'en-US';
      utterance.rate = 1.0;
    }

    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      this.currentUtterance = null;
      if (onError) onError(e);
    };

    this.synth.speak(utterance);
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      this.currentUtterance = null;
    }
  }

  public getSpeakingState(): boolean {
    return this.isSpeaking;
  }
}

export const voiceAssistant = new VoiceAssistant();
