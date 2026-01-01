import { VoiceBalanceRequest } from '../stores/voice.store';

export const formatVoiceDuration = (request: VoiceBalanceRequest): string => {
  if (!request.call_initiated_at || !request.call_completed_at) {
    return 'N/A';
  }
  
  const start = new Date(request.call_initiated_at);
  const end = new Date(request.call_completed_at);
  const duration = Math.round((end.getTime() - start.getTime()) / 1000);
  
  if (duration < 60) {
    return `${duration} seconds`;
  } else {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
};

export const getLanguageName = (code: string, supportedLanguages: Array<{code: string; name: string}>): string => {
  const language = supportedLanguages.find(lang => lang.code === code);
  return language?.name || code.toUpperCase();
};

export const getVoiceTypeName = (code: string, supportedVoiceTypes: Array<{code: string; name: string}>): string => {
  const voiceType = supportedVoiceTypes.find(type => type.code === code);
  return voiceType?.name || code.charAt(0).toUpperCase() + code.slice(1);
};