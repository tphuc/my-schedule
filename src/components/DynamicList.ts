import Neuon from "neuon";
import { AddIcon, RemoveIcon, SchoolIcon } from '../assets/Icons'

@Neuon.define('d-item')
class Item extends Neuon.Element{

    public RemoveBtn: HTMLElement; 
    constructor(public Name: string){
        super();
        this.setCSSRules({
            ':host':{
                display:"flex",
                'align-items':'center',
                padding:'0px 30px',
                'user-select': 'none',
                color: '#bbb',
            }
        })
        this.RemoveBtn = this.shadowRoot.getElementById('rm-icon');
        this.update();
        
    }

    template(){
        return Neuon.Element.html`
            <div id='rm-icon' >
                ${RemoveIcon}
            </div>
            <span style="padding:5px">${this.Name}</span>
        ` 
    }
}




@Neuon.define('d-list')
class DynamicList extends Neuon.Element {

    public expanded: boolean = false;
    public _promptingAddItem: boolean = false;
    public Items: string[] = [];

    constructor(
        public Title: string,
        public SVGIcon: any,
        public Type: 'text' | 'time'
    ){
        super();
        this.Items = [];

        this.setCSSRules({
            ':host':{
                display:"flex",
                'flex-direction':'column',
                position:'relative'
            },
            ':host #title': {
                color: '#bbb',
                padding: '10px',
                'user-select': 'none',
                background: 'rgba(255,255,255,0.1)'
            },
            ':host #title:hover': {
                transition:'background 0.2s ease',
                background: 'rgba(255,255,255,0.2)'
            },
            ':host d-item':{
                position:'relative',
                'z-index':10,
                display:"flex",
                'align-items':'center',
                padding:'0px 30px',
                'user-select': 'none',
                color: '#bbb',
                'font-size':'14px'
            },
            ':host .item':{
                position:'relative',
                'z-index':10,
                display:"flex",
                'align-items':'center',
                padding:'0px 30px',
                'user-select': 'none',
                color: '#bbb',
                'font-size':'14px'
            },
            ':host d-item:hover':{
                background:'rgba(255,255,255,0.23)'
            },
            ':host .add':{
                'user-select': 'none',
                color: '#bbb',
                position:'relative',
                padding:'0px 10px',
                margin:'10px 5px',
                display:'flex',
                'align-self':'flex-end',
                'justify-content':'center',
                'align-items':'center',
                'float':'right',
                'border-radius': '20px',
                'font-size':'12px',
                transition:"background 0.2s ease "
            },
            ':host .add:hover':{
                background:'rgba(255,255,255,0.1)'
            },
            ':host .remove:hover':{
                transition:"background 0.2s ease ",
                fill:'#eee'
            },
            ':host input': {
                padding:'4px 5px',
                background:'rgba(255,255,255,0.1)',
                flex:1,
                outline:'none',
                margin:'4px',
                border:'1px solid #aaa',
                'border-radius':'30px',
                color:'#aaa',
                'font-size':'14px',
            }
        })
        this.update();
        this.shadowRoot.getElementById('title').onmousedown = (e) => { 
            this.expanded = !this.expanded; 
            this.update();
            if(this.expanded){
                var addButton: HTMLElement = this.shadowRoot.querySelector('div.add');
                if(addButton)
                    addButton.onmousedown = (e) => { 
                        if(this._promptingAddItem) return;
                        this._promptingAddItem = true; this.update();
                        var input: HTMLElement = this.shadowRoot.querySelector('input');
                        // input.focus()
                        if(!input) return
                        input.onkeydown = (e:any) => {
                            if(e.key !== 'Enter')
                                return
                            if(e.target.value){
                                this.addItem(e.target.value)
                            }
                            
                            this._promptingAddItem = false;
                            this.update()
                            
                        };
                        input.onblur = (e: any) => {
                            this._promptingAddItem = false;
                            this.update()
                        }
                }
            }
        }
    }


    setItems(items: any[]): void{
        this.Items = items;
        this.shadowRoot.getElementById('items').innerHTML = ''
        this.Items.forEach((name:any,idx:number) => {
            var item = new Item(name);
            item.RemoveBtn.onmousedown = (e) => this.removeItemById(idx)
            this.shadowRoot.getElementById('items').appendChild(item)
        });
        this.update();
        // this.Items.forEach((item:any,idx:number) => this.shadowRoot.getElementById(`rm-${idx}`).onclick = (e) => {
        //     this.removeItemById(idx);
        // }) 
        this.dispatch('ITEM_CHANGED', { type: 'reset'})
    }

    addItem(value: string):void{
        if(value){
            this.Items.push(value); 
            var item = new Item(value);
            item.RemoveBtn.onmousedown = (e) => this.removeItemById(this.Items.length - 1)
            this.shadowRoot.getElementById('items').appendChild(item)
            this.update()
        }
        this.dispatch('ITEM_CHANGED', { type:'add',  })
    }

    removeItemById(id: any): void{
        this.Items.splice(parseInt(id), 1);
        this.shadowRoot.getElementById('items').innerHTML = ''
        this.Items.forEach((name:any,idx:number) => {
            var item = new Item(name);
            item.RemoveBtn.onmousedown = (e) => this.removeItemById(idx)
            this.shadowRoot.getElementById('items').appendChild(item)
        })   
        this.update()
        this.dispatch('ITEM_CHANGED', { type: 'remove', id: id, })
    }





    renderAddItemInput(){
        return Neuon.Element.html`<div class='item'>
                ${RemoveIcon}
                <input type=${this.Type} autofocus>
            </div>
        `
    }

    renderDropdown(){
        return Neuon.Element.html`
        <div style="display: ${!this.expanded ? 'none':'block'}">
            <div id='items'>

            </div>
            ${
                this._promptingAddItem ? this.renderAddItemInput() : ''
            }
            <div class='add'>
                ${AddIcon}  
                <span style="padding:5px">Add</span>
            </div>
        </div>
        `

    }

    template() {
        return Neuon.Element.html`
            <div id='title'>
                <span style="width: 30px; padding:0px 4px; display:inline-flex; justify-content:center">
                 ${this.SVGIcon}
                </span>
                <span>${this.Title}</span>
            </div>
            ${this.renderDropdown()}
            
        `
    }
}

export default DynamicList;