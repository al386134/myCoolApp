// app.ts / main.ts
// or Angular App:
import { runNativeScriptAngularApp, platformNativeScript } from '@nativescript/angular';
import { AppModule } from './app/app.module';

// AwarNS Framework imports
// (always between esential imports and app initialization)
import { awarns } from '@awarns/core';
import { appTasks } from './app/features/tasks';
import { appTaskGraph } from './app/features/graph';
import { registerHumanActivityPlugin } from '@awarns/human-activity';
import { registerNotificationsPlugin } from '@awarns/notifications';
import { registerPersistencePlugin } from '@awarns/persistence';

awarns
  .init(
    appTasks, // The tasks to be used, which we defined before
    appTaskGraph, // The background execution workflow definition
    [
      // Required to register the activity change listeners on app startup
      // Learn more in the human-activity plugin docs
      registerHumanActivityPlugin(),
      // Required to register the notification tap callbacks
      // (Optional) we can indicate the name of the channel to be displayed in Android settings
      // Learn more in the notifications plugin docs
      registerNotificationsPlugin('Proximity alerts'),
      // Required for the local store to synchronize any pending records on app startup
      // (Optional) it is possible to inject an external (remote) store during the register
      // (Optional) it is possible to indicate for how much time the information must be kept locally
      // Learn more in the notifications plugin docs
      registerPersistencePlugin({oldRecordsMaxAgeHours: 7 * 24 }),
    ],
    {
      // Recommended, to see debug and info messages while developing
      enableLogging: true,
      // Other configuration options are available, check core package docs
    }
  )
  .then(() => console.log('AwarNS framework successfully loaded'))
  .catch((err) => {
    console.error('Could not load AwarNS framework:', err);
  });

/* 
 * Choose one depending on your application type: 
 */
 
// TypeScript App
//Application.run({ moduleName: 'app-root' });
// Angular App
runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
