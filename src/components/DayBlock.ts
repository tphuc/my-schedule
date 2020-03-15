import Neuon from 'neuon';
import ClassRow from './ClassRow';

@Neuon.define('day-block')
class DayBlock extends Neuon.Element{

    public ClassSections : ClassRow[] = []

    constructor(
        public WeekDay:string
    ){
        super();
        this.ClassSections = []
        this.setCSSRules({
            ':host':{
                display:'block',
                'padding': '1em',
                'margin': '10px',
                'box-sizing':'border-box',
                'border-bottom':'1px solid rgb(60,60,65)'
            },
            '#heading':{
                color:'#d1d1d1',
                'font-weight':'300',
                'font-size': '1.2em',
                display:'flex',
                'flex-direction':'row',
                'justify-content':'space-between',
                'align-items':'center',
                'user-select':'none',
                'padding-bottom': '10px'
            }
        });
        this.update()
    };

    addClassSection( section: ClassRow ):void{
        this.ClassSections.push(section);
        section.DaySchedule = this;
        this.shadowRoot.appendChild(section)
    }

    removeClassSection(idx: number):void{
        
        this.ClassSections.map((section, id) => { 
            if(id === idx){
                console.log(id, section.DaySchedule);
                section.DaySchedule.shadowRoot.removeChild(section)
            }
        })
        this.ClassSections.splice(idx, 1);
    }


    template(){
        return Neuon.Element.html`
            <div id='heading'>
                <span>${this.WeekDay}</span>
            </div>
        `
    }
}


export default DayBlock;