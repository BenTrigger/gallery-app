module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'he', 'ru', 'fr', 'it', 'es'],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}; 