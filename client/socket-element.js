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
	bind(){
		if( this.socket){
			if( this.socket.url=== this.url){
				return
			}
			this.socket.removeEventListener( "message", this.reemit)
		}
		this.socket= new WebSocket( this.url)
		this.socket.addEventListener( "message", this.reemit)
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
