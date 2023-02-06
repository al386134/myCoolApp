import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { AreaOfInterest } from '@awarns/geofencing'

import { ItemService } from './item.service'

@Component({
  selector: 'ns-details',
  templateUrl: './item-detail.component.html',
})
export class ItemDetailComponent implements OnInit {
  item: AreaOfInterest

  constructor(private itemService: ItemService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params.id
    this.item = this.itemService.getItem(id)
  }
}
