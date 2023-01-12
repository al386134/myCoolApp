import { Component } from '@angular/core'
import { awarns } from '@awarns/core';
import { AreaOfInterest, areasOfInterest } from '@awarns/geofencing';
import { BatteryLevel, BatteryLevelType } from '@awarns/battery';
import { recordsStore } from '@awarns/persistence';
import { Record } from '@awarns/core/entities';
@Component({
  selector: 'ns-app',
  templateUrl: './app.component.html',
})
export class AppComponent {

  async ngOnInit(){
/* 1. Before setting up the tasks, setup areas of interest */

  // First we query for any existing area of interest
  const aois = await areasOfInterest.getAll();
  
  const newAoIs: Array<AreaOfInterest> = [
    // Update the area of interest with the information of the area of your choice
    {
      id: 'geotec',
      name: 'Geotec',
      latitude: 39.9939082,
      longitude: -0.0739913,
      radius: 40,
    },
    // You can add more than one area of interest
  ];
  
  // Naive check, to see if areas of interest have already been setup
  if (aois.length === newAoIs.length) {
    console.log('Areas already set up!');
    return;
  }
  // Ensure we start from something clean
  await areasOfInterest.deleteAll();
  
  // Insert the new area(s)
  await areasOfInterest.insert(newAoIs);
  console.log('Done setting up areas of interest!');

  /* 2. Then, setup tasks. This way, the geofencing task will already have the areas of interest */
  
  // This checks if all the registered tasks meet their pre-execution conditions:
  // - Permissions are granted
  // - System services are enabled
  const isReady = await awarns.isReady();
  if (!isReady) {
    const tasksNotReady = await awarns.tasksNotReady$;
    // This allows to query which task(s), from the ones in use, are not ready
    // You can use this information to, for example, conditionally show different UI elements here, showing a rationale to your users about why certain permission or functionality must be activated
    console.log(`The following tasks are not ready!: ${tasksNotReady}`);
    // This will automatically perform all the actions needed to prepare the tasks that are not yet ready
    await awarns.prepare();
    // Will throw an error if not all the tasks have been succesfully prepared
  }
  
  /* 3. Finally, once everything else is ready, start the background execution workflow */

  awarns.emitEvent('startEvent');
  // Now the background workflow will start its execution by starting detecting human activity changes

// ...


  }


}
