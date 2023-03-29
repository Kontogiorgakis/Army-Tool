import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationModel } from 'src/app/global/models/notifications/notifications.model';
import { ProductModel } from 'src/app/global/models/product/product.model';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { NotificationsService } from 'src/app/global/services/tasks/notifications.service';
import { ProductService } from 'src/app/global/services/tasks/products.service';
import { SmartSpeakerService } from 'src/app/global/services/voice/smart-speaker.service';

@Component({
  selector: 'app-bathroom-topbar',
  templateUrl: './bathroom-topbar.component.html',
  styleUrls: ['./bathroom-topbar.component.css']
})
export class BathroomTopbarComponent implements OnInit {

  pending:boolean = false;
  like:boolean = false;

  /*ITEMS*/
  toothbrush =new ProductModel()
  toothpaste =new ProductModel()
  dentalFloss =new ProductModel()

  /*NOTS*/
  notificBrush = new NotificationModel()
  notificPaste = new NotificationModel()
  notificFloss = new NotificationModel()

  constructor(private router:Router,private productService: ProductService,private socketService: SocketsService, private smartSpeaker: SmartSpeakerService,private notificationService: NotificationsService) { }

  ngOnInit(): void {
    this.smartSpeaker.initialize();
    this.smartSpeaker.start();

    this.productService.getAll().subscribe((result) => {
      for(var res of result){
        if(res.name==="Toothbrush"){
          this.toothbrush = res;
        }else if(res.name==="Toothpaste"){
          this.toothpaste = res;
        }else if(res.name==="Dental Floss"){
          this.dentalFloss = res;
        }
      }

      /*ADD COMMANDS WITH SPEAK*/
      this.smartSpeaker.addCommand('toothbrush counter',()=>{
        this.smartSpeaker.speak('You have '+this.toothbrush.counter.toString()+' toothbrush')
      })
      this.smartSpeaker.addCommand('toothpaste counter',()=>{
        this.smartSpeaker.speak('You have '+this.toothpaste.counter.toString()+' toothpaste')
      })
      this.smartSpeaker.addCommand('dental floss counter',()=>{
        this.smartSpeaker.speak('You have '+this.dentalFloss.counter.toString()+' dental floss')
      })

      /*ADD COMMANDS FOR DATABASE*/
      /*First Likes*/
      this.smartSpeaker.addCommand('like toothbrush',()=>{
        this.toothbrush.liked = true;
        //UPDATE
        this.productService.update(this.toothbrush).subscribe((result) => {
          this.smartSpeaker.speak('toothbrush like completed')
          this.socketService.publish("tasks_update", this.toothbrush);
        })
      })

      this.smartSpeaker.addCommand('dislike toothbrush',()=>{
        this.toothbrush.liked = false;
        //UPDATE
        this.productService.update(this.toothbrush).subscribe((result) => {
          this.smartSpeaker.speak('toothbrush is no longer liked item')
          this.socketService.publish("tasks_update", this.toothbrush);
        })
      })

      this.smartSpeaker.addCommand('like toothpaste',()=>{
        this.toothpaste.liked = true;
        //UPDATE
        this.productService.update(this.toothpaste).subscribe((result) => {
          this.smartSpeaker.speak('toothpaste like completed')
          this.socketService.publish("tasks_update", this.toothpaste);
        })
      })

      this.smartSpeaker.addCommand('dislike toothpaste',()=>{
        this.toothpaste.liked = false;
        //UPDATE
        this.productService.update(this.toothpaste).subscribe((result) => {
          this.smartSpeaker.speak('toothpaste is no longer liked item')
          this.socketService.publish("tasks_update", this.toothpaste);
        })
      })

      this.smartSpeaker.addCommand('like dental floss',()=>{
        this.dentalFloss.liked = true;
        //UPDATE
        this.productService.update(this.dentalFloss).subscribe((result) => {
          this.smartSpeaker.speak('dental floss like completed')
          this.socketService.publish("tasks_update", this.dentalFloss);
        })
      })

      this.smartSpeaker.addCommand('dislike dental floss',()=>{
        this.dentalFloss.liked = false;
        //UPDATE
        this.productService.update(this.dentalFloss).subscribe((result) => {
          this.smartSpeaker.speak('dental floss is no longer liked item')
          this.socketService.publish("tasks_update", this.dentalFloss);
        })
      })

      /*Now add items (notifications)*/
      this.notificationService.getAll().subscribe((result) => {
        for(let res of result){
          if(res.product==="Toothbrush"){
            this.notificBrush = res;
          }else if(res.product==="Toothpaste"){
            this.notificPaste = res;
          }else if(res.product==="Dental Floss"){
            this.notificFloss = res;
          }
        }

        this.smartSpeaker.addCommand('add toothbrush',()=>{
          if(this.notificBrush.type!=="low"&&this.notificBrush.type!=="add"){
            this.notificBrush.type="fromBathroom";
            this.notificBrush.message="Add from Bathroom ";
            //UPDATE
            this.notificationService.update(this.notificBrush).subscribe((result) => {
              this.socketService.publish("tasks_update", this.notificBrush);
            });
            this.smartSpeaker.speak('Toothbrush added. You can complete addition from your phone.')
          }
        })

        this.smartSpeaker.addCommand('add toothpaste',()=>{
          if(this.notificPaste.type!=="low"&&this.notificPaste.type!=="add"){
            this.notificPaste.type="fromBathroom";
            this.notificPaste.message="Add from Bathroom ";
            //UPDATE
            this.notificationService.update(this.notificPaste).subscribe((result) => {
              this.socketService.publish("tasks_update", this.notificPaste);
            });
            this.smartSpeaker.speak('Toothpaste added. You can complete addition from your phone.')
          }
        })

        this.smartSpeaker.addCommand('add dental floss',()=>{
          if(this.notificFloss.type!=="low"&&this.notificFloss.type!=="add"){
            this.notificFloss.type="fromBathroom";
            this.notificFloss.message="Add from Bathroom ";
            //UPDATE
            this.notificationService.update(this.notificFloss).subscribe((result) => {
              this.socketService.publish("tasks_update", this.notificFloss);
            });
            this.smartSpeaker.speak('Dental floss added. You can complete addition from your phone.')
          }
        })
      })

      this.smartSpeaker.addCommand('milk',()=>{
        console.log("tsibos")
        //window.location.reload()
        this.pendingRedirect()
      })

    })

  }
  public voice(){
    /*this.smartSpeaker.speak('', ()=>{
      console.log("TOOOOO BCC FERNEI PANIKO STIN SKINI")
    })*/
    this.smartSpeaker.addCommand('toothbrush counter',()=>{
      this.smartSpeaker.speak('You have 2 toothbrushes')
    })
  }

  public pendingRedirect(){
    console.log("DREN DREN")
    //this.pending = !this.pending;
    //this.router.navigateByUrl()
  }

  public likeRedirect(){
    console.log("LEMAT")
    this.like = !this.like;
    //this.router.navigateByUrl()
  }

}
