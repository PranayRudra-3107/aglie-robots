import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideTranslateService({
      lang: 'en',                // Default to English
      fallbackLang: 'en',        // Fallback if translation missing
      loader: provideTranslateHttpLoader({
        prefix: '/assets/i18n/',  // Your folder
        suffix: '.json'            // Your file extension
      })
    })
  ]
};
