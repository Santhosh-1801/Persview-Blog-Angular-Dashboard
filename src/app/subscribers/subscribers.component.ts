import { Component, OnInit } from '@angular/core';
import { SubscribersService } from './../services/subscribers.service';

@Component({
  selector: 'app-subscribers',
  templateUrl: './subscribers.component.html',
  styleUrl: './subscribers.component.css'
})
export class SubscribersComponent implements OnInit {

  subscribersArray!:Array<any>;

  ngOnInit(): void {
    this.subsribersService.loadData().subscribe(val=>{
      this.subscribersArray=val;
    })
  }
  constructor(private subsribersService:SubscribersService){

  }
  onDelete(id:any){
    this.subsribersService.deleteData(id)
  }
}
