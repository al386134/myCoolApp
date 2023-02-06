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
    var notificationBody = 'El nivel de batería es de: ' + batteryLevel + '% 🔋';
    if (batteryLevel < 40) {
        notificationBody += '\t\n¡Recuerda coger el cargador!'
    }

    return {
        eventName: EVENT,
        result: {
          body: notificationBody,
        }
      };
  }
}