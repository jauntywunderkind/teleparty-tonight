export class SocketElement extends HTMLElement {
	constructor(){
		super()
		if( this.url){
			this.bind()
		}
		this.reemit= this.reemit.bind( this)
	}
	get url(){
		return this.getAttribute("url")
	}
	connectedCallback(){
		this.bind()
	}
	disconnectedCallback(){
	}
	open(){
		if( this.socket){
			if( this.socket.url=== this.url&& this.socket.readyState=== 1){
				// already open at this url
				return
			}
			this.close();
		}
		this.socket= new WebSocket( this.url)
		this.socket.addEventListener( "message", this.reemit)
	}
	close(){
		this.socket.removeEventListener( "message", this.reemit)
	}
	reemit( evt){
		const detail= JSON.parse( evt.data)
	}
}

export const EventTypes = {}

function makeEventType( name){
	const existing= EventTypes[ name]
	if( existing){
		return existing
	}
	const
		className= `${name.charAt(0).toUpper()}${name.substring(1)}Event`,
		// big funky wrapper to give it the correct name
		eventClass= ({[ className]: class extends Event{
			constructor( detail){
				super(name, {bubbles: true, cancelable: true})
				this.detail= detail
			}
		}})[ className]
	EventTypes[ className]= eventClass
	EventTypes[ name]= eventClass
	return eventClass
}

export default SocketElement
customElements.define("socket-element", SocketElement)
