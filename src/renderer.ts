import './index.css';
import AppLayout from './components/Main'
import Storage from './components/Storage';







class App {
    Layout: AppLayout;

    constructor() {
        this.initStore();
        this.Layout = new AppLayout();
       
        document.getElementById('root').appendChild(this.Layout)


    }

    initStore():void{

        Storage.set('table', {
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
        if(Storage.get('courses', null) === null)
            Storage.set('courses', [])
        if(Storage.get('timestamps', null) === null)
            Storage.set('timestamps', [])
    }

}

new App();




