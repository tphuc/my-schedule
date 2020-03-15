import Neuon from 'neuon';
import Storage from './Storage';
import DayBlock from './DayBlock';

@Neuon.define('class-row')
class ClassRow extends Neuon.Element {

    DaySchedule: DayBlock;
    TimestampContainer: HTMLElement;
    LectureContainer: HTMLElement;
    ClassContainer: HTMLElement;
    ReminderButton: HTMLElement;
    DropdownOptions: HTMLElement;
    Modal: HTMLElement;


    _cacheInput: string = '';


    constructor(
        public Time: string = '', 
        public Lecture: string = '',
        public enableReminder: boolean = false,
    ) {
        super();
        this.TimestampContainer = this.shadowRoot.getElementById('timestamp');
        this.LectureContainer = this.shadowRoot.getElementById('lecture');
        this.ReminderButton = this.shadowRoot.getElementById('reminder');
        this.Modal = this.shadowRoot.getElementById('modal');
        this.DropdownOptions = this.shadowRoot.querySelector('#dropdown-content')
        this.update()
        this.setCSSRules({
            ':host': {
                position:'relative',
                display: 'flex',
                'flex-direction': 'row',
                'align-items': 'stretch',
                'user-select': 'none',
                margin: '5px',
                'padding-top': '5px',
            },
            ':host::before':{
                width:'10px',
                height:"10px",
                background:"#aaa"
            },
            '#timestamp': {
                padding: '5px',
                background: 'rgba(240,240,240,0.05)',
                'margin-right': '5px',
                'border-radius': '3px',
                'color': '#4b83fb',
                'cursor': 'pointer',
                'font-size': '14px',
                'font-weight': '400',
                'min-width':'40px',
                display:'flex',
                'justify-content':'center',
                'align-items':'center'
            },
            '#timestamp:hover':{
                transition:'background 0.5s ease',
                background: 'rgba(240,240,240,0.1)',
            },
            '#lecture': {
                flex:1,
                padding: '5px',
                'margin-right': '5px',
                background: 'rgba(253,250,254,0.2)',
                'border-radius': '2px',
                'color': '#d1d1d1',
                'cursor': 'pointer',
                'min-width': '200px',
                'font-weight': '400',
                'vertical-align':'middle',
                height:'30px',
                'line-height':'30px'
            },
            '#lecture:hover':{
                transition:'all 0.2s ease',
                background: 'rgba(240,240,255,0.25)',
            },
            '#class': {
                padding: '5px',
                'margin-right': '5px',
                background: 'rgba(253,250,254,0.2)',
                'border-radius': '2px',
                'color': '#d1d1d1',
                'cursor': 'pointer',
                'font-weight': '400',
                'min-width':'20px',
                'font-size':'15px',
            },
            '#class:hover':{
                transition:'all 0.2s ease',
                background: 'rgba(240,240,255,0.25)',
            },
            '#class:focus':{
                transition:'all 0.2s ease',
                background: 'rgba(240,240,255,0.5)',
            },

            '#reminder': {
                display:'flex',
                'justify-content':'center',
                'align-items':'center',
                height:'30px',
                padding: '5px',
                background: 'rgba(253,250,254,0.1)',
                'border-radius': '2px',
                'color': '#d1d1d1',
                'cursor': 'pointer',
            },
            '#reminder:hover':{
                transition:'all 0.2s ease',
                background: 'rgba(240,240,255,0.2)',
            },

            
            '@keyframes slidedown':{
                from: {
                    transform:'translateY(-100px)',
                },
                to:{
                    transform:'translateY(0px)'
                }
            },
            '#modal':{
                'z-index':10,
                position:'fixed',
                top:0,
                left:'250px',
                width:'calc(100% - 250px)',
                height:'100vh',
                background:"rgba(31,31,35,0.8)",
                display:'none'
            },
            ':host #input-container':{
                'box-sizing':'border-box',
                position:"relative",
                'z-index':12,
                margin: '10% 20%',
                width:'60%',
                height:'40%',
                'border-radius': '10px',
                background:'linear-gradient(to right, rgb(126, 127, 135, 0.3) 0%, rgb(131, 132, 145, 0.3) 100%)',
                display:'flex',
                'flex-direction':'column',
                'align-items':'stretch',
                'justify-content':'center',
                padding: '10px 3em',
                'box-shadow': '0 -2px 2px -2px rgba(0, 0, 0, .2)',
                transition:"all 0.5s ease",
                animation: 'slidedown 0.5s',
                'backdrop-filter': 'blur(14px)'
            },
            'input':{
                'box-sizing':'border-box',
                position:"relative",
                display:"flex",
                width:'100%',
                'z-index':10,
                padding:'8px 20px',
                'max-height':'30px',
                background:'rgba(255,255,255,0.1)',
                flex:1,
                outline:'none',
                border:'1px solid #888',
                'border-radius':'5px',
                color:'#aaa',
            },
            'input:focus':{
                border:'1px solid #aaa',
            },
            '#dropdown-content':{
                padding:'10px',
                margin:'10px',
                'max-height':'150px',
                overflow:'scroll',
                'box-sizing':'border-box',
                background:"transparent",
                'min-width': '160px',
                'z-index': 1,
            },
            '#dropdown-content > .suggest-item':{
                margin:'20px',
                color:'#aaa',
                'text-align':'center',
                transition:'all 0.2s ease',
                padding:'5px',
                'border-radius':'20px',
                'font-size':'12px'
                
            },
            '#dropdown-content > .suggest-item:hover':{
                transform:"scale(1.4)",
                background:'rgba(255,255,255,0.02)',
                transition:'all 0.4s',

            },
            '#dropdown-content::-webkit-scrollbar': {
                width: '5px',
                height:'0px',
                background: 'transparent'
            },
            '#dropdown-content::-webkit-scrollbar-track': {
                background: 'transparent'
            },
            '#dropdown-content::-webkit-scrollbar-thumb': {
                background: 'transparent'
            }
        })

        // this.TimestampContainer.onmousedown = (e) => this.showInputModal(e, (val: any) => { this.Time = val; this.update() })
        this.LectureContainer.onmousedown = (e) => this.showInputModal(e, (val: any) => { this.Lecture = val; this.update() })
        this.ReminderButton.onmousedown = (e) => {}
        this._updateDropdownOptions()
    }

    _updateDropdownOptions():void{
        this.DropdownOptions.innerHTML = ''
        Storage.get('courses').map((item:any) => {
            var option = document.createElement('div');
            option.className = 'suggest-item'
            option.innerHTML = item
            option.onclick = (e) => { this.Lecture = item;this.Modal.style.display = 'none'; this.update()}
            this.DropdownOptions.appendChild(option);
        })
    }

    showInputModal(e: MouseEvent, callback?: any): void{
        this.Modal.style.display = 'block';
        var textinput = this.shadowRoot.getElementById('input');
        textinput.setAttribute('value', '');
        textinput.focus();

        this._updateDropdownOptions()

        this.shadowRoot.getElementById('input').onchange = (e:any) => { 
            this.Modal.style.display = 'none';
            callback(e.target.value)
        }

        window.document.onkeydown = (e: KeyboardEvent) => {
            if(e.key === 'Escape' || e.key == 'Esc'){
                this.Modal.style.display = 'none';
            }
        }

        this.Modal.onmousedown = (e:any) => {
            if(e.target === this.Modal)
                this.Modal.style.display = 'none';
        }
        
    }

    template() {
        return Neuon.Element.html`
            <div id='timestamp'>${this.Time}</div>
            <div id='lecture'>${this.Lecture}</div>
            <div id='reminder'>
                <svg id="icon" width="24" height="24" scaleBy="3" fill='#888888'>
                    <rect width="24" height="24" fill="none" rx="0" ry="0"/>
                    <path fill="inherit" fill-rule="evenodd" clip-rule="evenodd" d="M3.78027 4.53768C2.93412 5.24768 2.82375 6.50919 3.53375 7.35534L4.49659 8.50281C3.86055 9.69428 3.5 11.055 3.5 12.5C3.5 14.5999 4.26151 16.522 5.52346 18.0052L3.8146 20.0169C3.45553 20.4396 3.50908 21.0738 3.93396 21.4304C4.35522 21.7838 4.98285 21.7308 5.33887 21.3117L6.99034 19.3675C8.39517 20.3941 10.1268 21 12 21C13.8732 21 15.6048 20.3941 17.0097 19.3675L18.6611 21.3117C19.0171 21.7308 19.6448 21.7838 20.066 21.4304C20.4909 21.0738 20.5445 20.4396 20.1854 20.0169L18.4765 18.0052C19.7385 16.522 20.5 14.5999 20.5 12.5C20.5 11.055 20.1394 9.69428 19.5034 8.50281L20.4662 7.35534C21.1762 6.50919 21.0659 5.24768 20.2197 4.53768L17.9216 2.60932C17.0754 1.89931 15.8139 2.00968 15.1039 2.85583L13.9544 4.22576C13.3269 4.0781 12.6726 3.99999 12 3.99999C11.3274 3.99999 10.6731 4.0781 10.0456 4.22576L8.89606 2.85583C8.18606 2.00968 6.92455 1.89931 6.0784 2.60931L3.78027 4.53768ZM8.8092 4.61918L7.97681 3.62717C7.69281 3.28871 7.18821 3.24457 6.84975 3.52857L4.55161 5.45693C4.21315 5.74093 4.16901 6.24554 4.45301 6.584L5.17034 7.43888C6.0946 6.19369 7.35131 5.21004 8.8092 4.61918ZM18.8297 7.43888C17.9054 6.19369 16.6487 5.21004 15.1908 4.61918L16.0232 3.62717C16.3072 3.28871 16.8118 3.24457 17.1502 3.52857L19.4484 5.45693C19.7868 5.74093 19.831 6.24554 19.547 6.584L18.8297 7.43888ZM12 19.8C16.0317 19.8 19.3 16.5317 19.3 12.5C19.3 8.46831 16.0317 5.19999 12 5.19999C7.96832 5.19999 4.7 8.46831 4.7 12.5C4.7 16.5317 7.96832 19.8 12 19.8ZM12.8001 13.1C12.6176 13.3429 12.3272 13.5 12 13.5C11.4477 13.5 11 13.0523 11 12.5C11 12.1728 11.1571 11.8824 11.4 11.6999V7.09999C11.4 6.76861 11.6686 6.49999 12 6.49999C12.3314 6.49999 12.6 6.76861 12.6 7.09999V11.6999C12.6758 11.7568 12.7432 11.8242 12.8001 11.9H16.4C16.7314 11.9 17 12.1686 17 12.5C17 12.8314 16.7314 13.1 16.4 13.1H12.8001Z" />
                </svg>
            </div>

            <div id='modal'>
                <div id='input-container'>
                    <input id='input' type='text'>
                    <div id="dropdown-content">
                    </div>
                </div>
                
            </div>
            
        `
    }
}


export default ClassRow;