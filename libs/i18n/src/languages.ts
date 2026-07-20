import type { Language } from '@king/types';
import type { SettingsType } from '@king/types';

const languages: Language[] = [
  { name: 'English', value: 'en', short: 'EN' },
  { name: 'German', value: 'de', short: 'DE' },
  { name: 'French', value: 'fr', short: 'FR' },
  { name: 'Spanish', value: 'es', short: 'ES' },
  { name: 'Italian', value: 'it', short: 'IT' },
  { name: 'Dutch', value: 'nl', short: 'NL' },
  { name: 'Polish', value: 'pl', short: 'PL' },
  { name: 'Portuguese Br', value: 'pt-br', short: 'PT-BR' },
  { name: 'Russian', value: 'ru', short: 'RU' },
  { name: 'Japanese', value: 'ja', short: 'JA' },
  { name: 'Korean', value: 'ko', short: 'KO' },
  { name: 'Chinese', value: 'zh', short: 'ZH' },
  { name: 'Turkish', value: 'tr', short: 'TR' },
  { name: 'Swedish', value: 'sv', short: 'SV' },
  { name: 'Danish', value: 'da', short: 'DA' },
  { name: 'Norwegian', value: 'no', short: 'NO' },
  { name: 'Finnish', value: 'fi', short: 'FI' },
  { name: 'Czech', value: 'cs', short: 'CS' },
  { name: 'Slovak', value: 'sk', short: 'SK' },
  { name: 'Hungarian', value: 'hu', short: 'HU' },
  { name: 'Romanian', value: 'ro', short: 'RO' },
  { name: 'Croatian', value: 'hr', short: 'HR' },
  { name: 'Indonesian', value: 'id', short: 'ID' },
  { name: 'Thai', value: 'th', short: 'TH' },
];

export const setLanguages = (settings: SettingsType) => {
  languages.length = 0;
  settings.languages.forEach((lang) => {
    languages.push({
      name: lang.name,
      value: lang.code.toLowerCase(),
      short: lang.code.toUpperCase(),
    });
  });
};

export { languages };
export default languages;