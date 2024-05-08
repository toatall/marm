import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {   
    // inn?: string;    
    // listInn?: string[] = []
    // isRunning: boolean = false
    // innCount: Number = 0

    constructor() { }

    ngOnInit(): void {

    }

    // onSubmit() {
    //     this.listInn = this.inn?.split("\n")
    //     if (!Array.isArray(this.listInn) || this.listInn.length == 0) {
    //         console.log('НЕ ЗАПОЛНЕНО ПОЛЕ!');
    //     }
    //     this.isRunning = true
    //     this.run()
    // }

    // private run() {
    //     const inn = this.listInn?.shift()
    //     if (inn == null || inn.trim().length == 0) {
    //         this.stop()
    //         return
    //     }
    // }

    // private stop() {
    //     this.isRunning = false
    // }

}
