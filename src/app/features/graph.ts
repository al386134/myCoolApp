// graph.ts;
import { BatteryLevelType } from '@awarns/battery';
import { TaskGraph, EventListenerGenerator, RunnableTaskDescriptor } from '@awarns/core/tasks';
import { recordsStore } from '@awarns/persistence';
import { interval, lastValueFrom, Observable, of } from 'rxjs';

class AppTaskGraph implements TaskGraph {



 async describe(
    on: EventListenerGenerator,
    run: RunnableTaskDescriptor
  ): Promise<void> {

    on('startEvent', run('startDetectingCoarseHumanActivityChanges'))
    // Once a non-stationary action becomes detected, the location of the phone will be collected every 1 minute
    // The collection of the phone location will stop once the phone becomes still again
    on('userFinishedBeingStill', run('acquirePhoneGeolocation').every(1, 'minutes').cancelOn('userStartedBeingStill'));

    // // Each time a geolocation becomes acquired, we'll check how close it is to the known areas of interest (which we'll set up later)
    on('geolocationAcquired',
      run('checkAreaOfInterestProximity', {
        nearbyRange: 200, // We can indicate from how many meters from the border of the area we understand that the phone is close to it 
        offset: 15, // Also, we can specify an offset (in meters too) to consider in the distance calculation (to mitigate the GPS error)
      })
    );

    // // Similarly, another notification will be delivered right after detecting that the phone has been detected inside the area
    on('movedInsideAreaOfInterest', run('acquirePhoneBatteryLevel'));

    // And another notification will be sent when the oposite occurs
    on('movedOutsideAreaOfInterest', run('acquirePhoneBatteryLevel'));

    on('batteryLevelAcquired', run('checkBatteryLevel'));

    on('notificationPrepared', run('sendNotification', {
      title: 'Interacción con area de interés'
    }));
  

    on('stopEvent', run('stopDetectingCoarseHumanActivityChanges'));

  }

}

export const appTaskGraph = new AppTaskGraph();