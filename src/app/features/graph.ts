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

    // Once a non-stationary action becomes detected, the location of the phone will be collected every 1 minute
    // The collection of the phone location will stop once the phone becomes still again
    // on('userFinishedBeingStill', run('acquirePhoneGeolocation').every(1, 'minutes').cancelOn('userStartedBeingStill'));

    // // Each time a geolocation becomes acquired, we'll check how close it is to the known areas of interest (which we'll set up later)
    on(
      'geolocationAcquired',
      run('checkAreaOfInterestProximity', {
        nearbyRange: 200, // We can indicate from how many meters from the border of the area we understand that the phone is close to it 
        offset: 15, // Also, we can specify an offset (in meters too) to consider in the distance calculation (to mitigate the GPS error)
      })
    );

    // // The app will deliver this notification once the phone becomes detected at a distance smaller than the area's radius + nearbyRange
    // // on(
    // //   'movedCloseToAreaOfInterest',
    // //   run('sendNotification', {
    // //     title: 'You are close',
    // //     body: 'Time to come by?'
    // //   })
    // // );
    // // Similarly, another notification will be delivered right after detecting that the phone has been detected inside the area
    on(
      'movedInsideAreaOfInterest',
      run('checkBatteryLevel'));

    // And another notification will be sent when the oposite occurs
    on(
      'movedOutsideAreaOfInterest',
      run('checkBatteryLevel'));

    // on('startEvent', run('acquirePhoneBatteryLevel')
    // .every(1, 'minutes')
    // .cancelOn('stopEvent'));

    // on('batteryLevelAcquired', run('checkBatteryLevel'));

    on('notificationPrepared', run('sendNotification', {
      title: 'Battery aquired'
    }));
  

    //on('stopEvent', run('stopDetectingCoarseHumanActivityChanges'));








// We'll later emit a start event from the application UI, once everything has been properly set up
    // This will setup a listener on human activity changes
    // on('startEvent', run('startDetectingCoarseHumanActivityChanges'));

    // on('userStartedBeingStill',run('sendNotification', {
    //   title: 'Estas descansando 🪑',
    //   body: 'Te mereces un buen descanso'
    // }))
    
    // on('userStartedWalking',run('sendNotification', {
    //   title: 'Estas andando 🚶',
    //   body: '¡Sigue así, paso a paso hacia una vida saludable!'
    // }))


    // on('userStartedRunning',run('sendNotification', {
    //   title: 'Estas corriendo! 🏃‍♂️',
    //   body: 'Ten cuidado, mira siempre al cruzar la carretera'
    // }))

    
    // on('userStartedRidingABicycle',run('sendNotification', {
    //   title: '¡Ánimo contador! 🚲',
    //   body: 'No te olvides del casco'
    // }))

    // on('userStartedBeingInAVehicle',run('sendNotification', {
    //   title: 'Estás conduciendo 🚗 🏍️',
    //   body: 'Si bebes, no conduzcas'
    // }))

    // on('userStartedBeingStill', run('writeRecords'));
    // on('userStartedWalking', run('writeRecords'));
    // on('userStartedRunning', run('writeRecords'));
    // on('userStartedRidingABicycle', run('writeRecords'));
    // on('userStartedBeingInAVehicle', run('writeRecords'));

    // on('stopEvent', run('stopDetectingCoarseHumanActivityChanges'));




    // // All these notifications will do nothing, but they can be customized with certain metadata about actions that the app must perform once tapped (check notifications plugin docs)
    
    // // All the framework tasks output objects compatible the Record API (see core docs)
    // // This allows us to persist them right after they are observed, with just a single line

    // on('movedCloseToAreaOfInterest', run('writeRecords'));
    // on('movedInsideAreaOfInterest', run('writeRecords'));
    // on('movedOutsideAreaOfInterest', run('writeRecords'));
    // on('movedAwayFromAreaOfInterest', run('writeRecords'));

    // We could do the same with the activity changed event we declared before
    // on('userActivityChanged', run('writeRecords'));
    // And also with the geolocation, but we should be careful not to violate the privacy of our users...
    // on('geolocationAcquired', run('writeRecords'));

    // To finalize, we can prevent our workflow from running by no longer listening to human activity changes
    // Then, if the geolocation data collection task is not scheduled by the time the stop event rises, this means, the phone is idle, we are done
    // However, it would be more robust if we create a task to be invoked when both, the stopEvent and the userStartedBeingStill events are triggered
    // We could instead use the output (event) of this new task to cancel the geolocation data collection, ensuring that it stops no matter the state of the phone by the time the stop event gets emitted

  }

}

export const appTaskGraph = new AppTaskGraph();