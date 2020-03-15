import './index.css';
import ClassRow from './components/ClassRow';
import AppLayout from './components/Main'
import DayBlock from './components/DayBlock';

import Store from 'electron-store';







class App {
    Layout: AppLayout;
    Storage: Store

    constructor() {
        this.Layout = new AppLayout();
        this.initStore()
       
        document.getElementById('root').appendChild(this.Layout)


    }

    initStore():void{
        this.Storage = new Store()
        this.Storage.set('table', {
            monday: [
            ],
            tuesday: [

            ],
            wednesday: [

            ],
            thursday: [
                
            ],
            friday: [
                
            ],
            sarturday:[
                
            ],
            sunday:[
                
            ]
        })
        // this.Storage.set('courses', [])
        // this.Storage.set('timestamps', [])
    }

}

new App();




