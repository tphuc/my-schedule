import Neuon from 'neuon';
import DynamicList from './DynamicList';
import { SchoolIcon, ClockIcon } from '../assets/Icons';
import Storage from './Storage';
import DayBlock from './DayBlock';
import ClassRow from './ClassRow';



@Neuon.define('app-layout')
class Main extends Neuon.Element{

    public Canvas: HTMLElement;
    public Drawer: HTMLElement;

    public DaySchedules: any[] = [];

    constructor(){
        super();
        this.setCSSRules({
            ':host':{
                display:'flex',
                'align-items':'stretch',
                width:'100vw',
            },
            ':host #canvas':{
                'margin-left':'250px',
                position:'relative',
                flex:1,
                height:'100%',
                'min-height':'100vh',
                'box-sizing':'border-box',
            },
            ':host #drawer':{
                position:'fixed',
                top:0,
                left:0,
                'width':'250px',
                height:'100vh',
                'z-index':'10',
                'background-image':'linear-gradient(to right, rgb(46, 47, 55) 0%, rgb(61, 62, 70) 100%)',
                'border-right':'1px solid #111115'
            }
            
        });
        this.Canvas = this.shadowRoot.getElementById('canvas');
        this.Drawer = this.shadowRoot.getElementById('drawer');
        this.updateStorage()

        var Courses = new DynamicList('Courses', SchoolIcon, 'text')
        Courses.setItems(Storage.get('courses'))

        Courses.on('ITEM_CHANGED', () => {
            Storage.set('courses', Courses.Items);
        })

        var Timestamps = new DynamicList('Timestamps', ClockIcon, 'time');
        Timestamps.setItems(Storage.get('timestamps'))
        Timestamps.on('ITEM_CHANGED', (e:CustomEvent) => {
            if(e.detail.id && e.detail.type === 'remove'){
                this.DaySchedules.map((day: DayBlock) => { day.removeClassSection(e.detail.id) })
            }
            if(e.detail.type === 'add'){
                this.DaySchedules.map((day: DayBlock) => day.addClassSection(new ClassRow(Timestamps.Items[Timestamps.Items.length-1])))
            }
            Storage.set('timestamps', Timestamps.Items);
        })
 
        this.Drawer.appendChild(Timestamps);
        this.Drawer.appendChild(Courses);

    };

    updateStorage(){
        const table = Storage.get('table');
        const timestamps = Storage.get('timestamps') || []
        this.Canvas.innerHTML = '';

        Object.keys(table).map((day:any, idx:number) => {
            var dayblock = new DayBlock(day);
            this.DaySchedules.push(dayblock)
            this.Canvas.appendChild(dayblock);
            timestamps.map((t:any, id:number) => { 
                var classrow = new ClassRow(t);
                dayblock.addClassSection(classrow)
            })
        });
        

        this.update()
    }

    template(){
        return Neuon.Element.html`
            <div id='drawer'></div>
            <div id='canvas'></div>
        `
    }
}

export default Main