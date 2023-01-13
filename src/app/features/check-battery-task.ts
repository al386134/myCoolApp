import { DispatchableEvent, Task, TaskOutcome, TaskParams } from "@awarns/core/tasks";

const EVENT = 'notificationPrepared';

export class CheckBatteryTask extends Task {

  constructor() {
    super('checkBatteryLevel', {
      outputEventNames: ['notificationPrepared']
    });
  }

  protected async onRun(taskParams: TaskParams, invocationEvent: DispatchableEvent): Promise<void | TaskOutcome> {
    const currentBattery = invocationEvent.data;
    const batteryLevel = JSON.parse(JSON.stringify(currentBattery)).value;
    var notificationBody = '';
    if (batteryLevel < 40) {
        notificationBody = 'El nivel de batería es de: ' + batteryLevel + '% 🔋\t\n¡Recuerda coger el cargador!'
    }
    else notificationBody = 'El nivel de batería es de: ' + batteryLevel + '% 🔋'

    return {
        eventName: EVENT,
        result: {
          body: notificationBody,
        }
      };
  }
}