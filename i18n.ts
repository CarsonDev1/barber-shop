// i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(HttpBackend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: 'vi',
		supportedLngs: ['vi', 'ko'], // Add your languages here
		backend: {
			loadPath: '/locales/{{lng}}/{{ns}}.json', // Path for translation files
		},
		lng: 'vi',
		interpolation: {
			escapeValue: false, // React already escapes values
		},
		react: {
			useSuspense: false, // Enable Suspense for SSR compatibility
		},
	});

export default i18n;
