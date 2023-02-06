import { Injectable } from '@angular/core'
import { AreaOfInterest } from '@awarns/geofencing'


@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private items = new Array<AreaOfInterest>({
    id: 'geotec',
    name: 'Geotec',
    latitude: 39.9939082,
    longitude: -0.0739913,
    radius: 40,
  },
  // You can add more than one area of interest
  {
    id: 'ingesom',
    name: 'Ingesom',
    latitude: 39.983949,
    longitude: -0.039771,
    radius: 40,
  },
  )



  getItems(): Array<AreaOfInterest> {
    return this.items
  }

  getItem(id: string): AreaOfInterest {
    return this.items.find(i => i.id == id)
  }
}
