import { Component, OnInit } from '@angular/core';
import { faCircle, faMinus, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TasksService } from 'src/app/global/services/tasks/tasks.service';
import { SocketsService } from 'src/app/global/services/sockets/sockets.service';
import { TaskModel } from 'src/app/global/models/tasks/task.model';


@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  /*Adding the item informations*/
  public products: TaskModel[] = [];
  public type: string = '';
  public name: string = '';
  public quantity: string = '';
  public price: string = '';
  public store: string = '';
  public status: string = '';
  product = new TaskModel();


  //Divs
  //name:boolean = true;
  quantityDiv:boolean = false;
  priceDiv:boolean = false;


  //Buy from
  show:boolean = false;

  //Tab manipulation
  //Active Tab
  activeTab=""

  //filter
  filter$: Observable<string> | undefined;

  constructor(private router: Router, private route: ActivatedRoute, private tasksService: TasksService,private socketService: SocketsService) {}

  ngOnInit(): void {
    this.filter$ = this.route.queryParamMap.pipe(
      map((params: ParamMap) => params.get('tab')||""),
    );

    // subscribe and log the params when they change
    // you could set to an internal variable or
    // bind the filter$ directly to the async pipe
    // ultimatecourses.com/blog/angular-ngfor-async-pipe
    this.filter$.subscribe(param =>{
      if(param===null)
        return
      /*Here we manipulate the params*/
      if(param!==""){
        this.name = param
        this.changeUI();
      }
    });
  }

  /*Change UI depending on the item*/
  public changeUI(){

    //item
    const item = (<HTMLSelectElement>document.getElementById('search_bar')).value;
    console.log("This is item"+item)

    //measurement
    let pieces: string[] = ['Chicken Whole','Pineapple','Chips','Pop Corn','Biscuits','Toothbrush','Toothpaste','Dental Floss'];
    let liquids: string[] = ['Coca Cola','Red Bull','Gatorade'];
    let kilograms: string[] = ['Chicken Breasts','Chicken Drums','Chicken Legs','Mango','Avocado'];
    var quant;

    /*Three for*/
    for(let i=0; i<pieces.length; i++){
      if(this.name === pieces[i]){
        if(i>=5){
          //Change Ui
          document.getElementById('edible')?.setAttribute("style","background: none; color: black;")
          document.getElementById('potable')?.setAttribute("style","background: none; color: black;")
          document.getElementById('other')?.setAttribute("style","background: #594545; color: white;")

          //status
          this.product.status = 'bathroom';
          document.getElementById('fridge')?.setAttribute("style","box-shadow:none;")
          document.getElementById('cabinet')?.setAttribute("style","box-shadow:none;")
          document.getElementById('bathroom')?.setAttribute("style","box-shadow:0px 5px 6px rgba(0, 0, 0, 0.4);")

        }else{
          document.getElementById('edible')?.setAttribute("style","background: #594545; color: white;")
          document.getElementById('potable')?.setAttribute("style","background: none; color: black;")
          document.getElementById('other')?.setAttribute("style","background: none; color: black;")
          if(i>=2 && i<5){
            //status
            this.product.status = 'cupboard';
            document.getElementById('fridge')?.setAttribute("style","box-shadow:none;")
            document.getElementById('cabinet')?.setAttribute("style","box-shadow:0px 5px 6px rgba(0, 0, 0, 0.4);")
            document.getElementById('bathroom')?.setAttribute("style","box-shadow:none;")
          }else{
             //status
             this.product.status = 'fridge';
             document.getElementById('fridge')?.setAttribute("style","box-shadow:0px 5px 6px rgba(0, 0, 0, 0.4);")
             document.getElementById('cabinet')?.setAttribute("style","box-shadow:noneX;")
             document.getElementById('bathroom')?.setAttribute("style","box-shadow:none;")
          }
        }
        //change milligram
        document.getElementById('kilograms')!.innerHTML = "Kilograms:"

        //pointer events
        document.getElementById('sinKM')?.setAttribute("style","pointer-events:none;");
        document.getElementById('mionKM')?.setAttribute("style","pointer-events:none; line-height: 16px;");
        document.getElementById('inputKM')?.setAttribute("style","color:rgb(182, 182, 182);");

        quant = document.getElementById('inputPieces') as HTMLInputElement
        //this.product.quantity = quant.value+' pc';
        document.getElementById('sinPieces')?.setAttribute("style","pointer-events:auto;");
        document.getElementById('mionPieces')?.setAttribute("style","pointer-events:auto; line-height: 16px;");
        document.getElementById('inputPieces')?.setAttribute("style","color:rgb(82, 82, 82);");
      }
    }

    for(const element of liquids){
      if(this.name === element){
        //Change Ui
        document.getElementById('edible')?.setAttribute("style","background: none; color: black;")
        document.getElementById('potable')?.setAttribute("style","background: #594545; color: white;")
        document.getElementById('other')?.setAttribute("style","background: none; color: black;")

        //change milligram
        document.getElementById('kilograms')!.innerHTML = "Milligrams:"


        //pointer events
        document.getElementById('sinKM')?.setAttribute("style","pointer-events:none;");
        document.getElementById('mionKM')?.setAttribute("style","pointer-events:none; line-height: 16px;");
        document.getElementById('inputKM')?.setAttribute("style","color:rgb(182, 182, 182);");

        quant = document.getElementById('inputPieces') as HTMLInputElement
        //this.product.quantity = quant.value+' pc';
        document.getElementById('sinPieces')?.setAttribute("style","pointer-events:auto;");
        document.getElementById('mionPieces')?.setAttribute("style","pointer-events:auto; line-height: 16px;");
        document.getElementById('inputPieces')?.setAttribute("style","color:rgb(82, 82, 82);");

        //status
        this.product.status = 'fridge';
        document.getElementById('fridge')?.setAttribute("style","box-shadow:0px 5px 6px rgba(0, 0, 0, 0.4);")
        document.getElementById('cabinet')?.setAttribute("style","box-shadow:none;")
        document.getElementById('bathroom')?.setAttribute("style","box-shadow:none")
      }
    }

    for(const element of kilograms){
      console.log(element+"   "+item);
      if(this.name === element){
        //Change Ui
        document.getElementById('edible')?.setAttribute("style","background: #594545; color: white;")
        document.getElementById('potable')?.setAttribute("style","background: none; color: black;")
        document.getElementById('other')?.setAttribute("style","background: none; color: black;")

        //change milligram
        document.getElementById('kilograms')!.innerHTML = "Kilograms:"

        //pointer events
        quant = document.getElementById('inputKM') as HTMLInputElement
        //this.product.quantity = quant.value+' kg';
        console.log("OPA GANGANM "+quant.value)
        document.getElementById('sinKM')?.setAttribute("style","pointer-events:auto;");
        document.getElementById('mionKM')?.setAttribute("style","pointer-events:auto; line-height: 16px;");
        document.getElementById('inputKM')?.setAttribute("style","color:rgb(82, 82, 82);");

        document.getElementById('sinPieces')?.setAttribute("style","pointer-events:none;");
        document.getElementById('mionPieces')?.setAttribute("style","pointer-events:none; line-height: 16px;");
        document.getElementById('inputPieces')?.setAttribute("style","color:rgb(182, 182, 182);");

        //status
        this.product.status = 'fridge';
        document.getElementById('fridge')?.setAttribute("style","box-shadow:0px 5px 6px rgba(0, 0, 0, 0.4);")
        document.getElementById('cabinet')?.setAttribute("style","box-shadow:none;")
        document.getElementById('bathroom')?.setAttribute("style","box-shadow:none")
      }
    }




  }


  /*Get Product info and add*/
  public postProduct(): void{

  }

  public addKM(){
    let input = document.getElementById('inputKM') as HTMLInputElement
    let number = parseFloat(input.value);
    if(number+0.1<=5)
        number = number + 0.1;
    number = parseFloat(number.toFixed(2))
    input.value = number.toString();
    this.product.quantity = input.value+' kg';

  }

  public addPieces(){
    let input = document.getElementById('inputPieces') as HTMLInputElement
    let number = parseInt(input.value);
    if(number+1<=10)
        number = number + 1;
    input.value = number.toString();
    this.product.quantity = input.value+' pc';
  }

  public minusKM(){
    let input = document.getElementById('inputKM') as HTMLInputElement
    let number = parseFloat(input.value);
    if(number-0.1>=0)
        number = number - 0.1;
    number = parseFloat(number.toFixed(2))
    input.value = number.toString();
    this.product.quantity = input.value+' kg';
  }

  public minusPieces(){
    let input = document.getElementById('inputPieces') as HTMLInputElement
    let number = parseInt(input.value);
    if(number-1>=0)
        number = number - 1;
    input.value = number.toString();
    this.product.quantity = input.value+' pc';
  }

  public showStores(){
    document.getElementById('adding')?.setAttribute("style","filter: blur(1px);")
    this.show=true;
  }

  public selectShop(){
    document.getElementById('adding')?.setAttribute("style","filter: blur(0px);")
    this.show=false;

    //make market first
    document.getElementById('shops')!.innerHTML="Σκλαβενίτης";
    document.getElementById('price')!.innerHTML="10,25€";

  }

  /*Show divs*/
  public nameShow(){

    //show name
    document.getElementById('search_bar')?.setAttribute("style","pointer-events: auto;")
    document.getElementById('namerow')?.setAttribute("style","opacity: 1;")
    document.getElementById('dash1')?.setAttribute("style","opacity: 1;")

    //hide quantity
    document.getElementById('quantity')?.setAttribute("style","opacity: 0.6;")
    document.getElementById('dash2')?.setAttribute("style","opacity: 0.6;")
    document.getElementById('no1')?.setAttribute("style","pointer-events: none;")
    document.getElementById('no2')?.setAttribute("style","pointer-events: none; top:82px;")

    //hide price
    document.getElementById('shops')?.setAttribute("style","pointer-events: auto;")
    document.getElementById('price_status')?.setAttribute("style","opacity: 0.6;")
    document.getElementById('addit')?.setAttribute("style","opacity: 0.6; pointer-events: none;")
    this.quantityDiv = false
  }

  public quantityShow(){
    if((<HTMLSelectElement>document.getElementById('search_bar')).value!==""){
      this.quantityDiv = true;
     //show quantity
    document.getElementById('quantity')?.setAttribute("style","opacity: 1;")
    document.getElementById('dash2')?.setAttribute("style","opacity: 1;")
    document.getElementById('no1')?.setAttribute("style","pointer-events: auto;")
    document.getElementById('no2')?.setAttribute("style","pointer-events: auto; top:82px;")

    //hide name
    document.getElementById('search_bar')?.setAttribute("style","pointer-events: none;")
    document.getElementById('namerow')?.setAttribute("style","opacity: 0.6;")
    document.getElementById('dash1')?.setAttribute("style","opacity: 0.6;")


    //hide price
    document.getElementById('shops')?.setAttribute("style","pointer-events: auto;")
    document.getElementById('price_status')?.setAttribute("style","opacity: 0.6;")
    document.getElementById('addit')?.setAttribute("style","opacity: 0.6; pointer-events: none;")
    }/*else{
      document.getElementById('addit')?.setAttribute("style","opacity: 1; pointer-events: auto;")
    }*/
  }


  public priceShow(){
    if(this.quantityDiv){
      //show price
      document.getElementById('shops')?.setAttribute("style","pointer-events: auto;")
      document.getElementById('price_status')?.setAttribute("style","opacity: 1;")
      document.getElementById('addit')?.setAttribute("style","opacity: 1; pointer-events: auto;")

      //hide name
      document.getElementById('search_bar')?.setAttribute("style","pointer-events: none;")
      document.getElementById('namerow')?.setAttribute("style","opacity: 0.6;")
      document.getElementById('dash1')?.setAttribute("style","opacity: 0.6;")

      //hide quantity
      document.getElementById('quantity')?.setAttribute("style","opacity: 0.6;")
      document.getElementById('dash2')?.setAttribute("style","opacity: 0.6;")
      document.getElementById('no1')?.setAttribute("style","pointer-events: none;")
      document.getElementById('no2')?.setAttribute("style","pointer-events: none; top:82px;")
    }
  }


  public addItem(){
    this.product.name = this.name;
    this.product.price = this.price;
    //this.product.quantity = this.quantity
    this.product.type = "Not Purchased";

    console.log(this.product.quantity)


    var pricePr = document.getElementById('price') as HTMLElement
    if(pricePr.innerHTML[0]==='<'){
      this.product.price = 'none';
    }else{
      this.product.price = pricePr.innerHTML
    }
    console.log("prod =")
    console.log(this.product);
    //ADD THEM
    this.tasksService.create(this.product).subscribe((result) => {
      this.type = '';
      this.name = '';
      this.quantity = '';
      this.price = '';
      this.status = '';
      console.log(this.product)
      this.socketService.publish("tasks_update", this.product);
    });
    //this.deleteTask("63a302b73f9b7469a77ae60f");
    this.router.navigateByUrl('/')
    // Susbcribe to socket event and set callback
    this.getAllTasks();
    this.socketService.subscribe("tasks_update", (data: any) => {
      //console.log("avaino")
      this.getAllTasks();
      //console.log(this.products[0].name);
    });
  }

  private getAllTasks(): void {
    this.tasksService.getAll().subscribe((result) => {
      this.products = result;
      //console.log(result)
      //console.log(this.products[0]._id);
    });
  }
  faCircle = faCircle;
  faMinus =  faMinus;
  faChevronRight = faChevronRight;
}
