import { Component, OnInit } from '@angular/core'
import { AreaOfInterest } from '@awarns/geofencing'
import { ItemService } from './item.service'

@Component({
  selector: 'ns-items',
  templateUrl: './items.component.html',
})
export class ItemsComponent implements OnInit {
  items: Array<AreaOfInterest>

  constructor(private itemService: ItemService) {
  }

  ngOnInit(): void {
    this.items = this.itemService.getItems()
  }
}
