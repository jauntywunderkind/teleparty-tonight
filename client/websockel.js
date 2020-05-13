export class SocketElement extends HTMLElement {
	constructor(){
		super()
		// bind all socket event handlers
		this._socketEventHandlers.forEach( fn=> this[fn.name]= this[ fn.name].bind(this))
		// opena
		this.open()
	}

	// general properties
	get url(){
		return this.getAttribute("url")
	}
	set url( url){
		this.setAttribute( "url", url)
	}

	// customelement members
	connectedCallback(){
		this.open()
	}
	disconnectedCallback(){
		this.close()
	}
	attributeChangedCallback( attrName, oldVal, newVal){
		if( attrName=== "url"){
			this.url= newVal
		}
	}

	// websocket members
	close( code= 1000, reason){
		if( this.socket){
			this._socketEventHandlers.forEach( handler=> this.socket.removeEventHandler( handler.event, handler))
		}
		this.socket.close( code, reason)
		this.socket= null
	}
	open(){
		if( this.socket){
			if( this.socket.url=== this.url&& this.socket.readyState<= 1){
				// already open at this url
				return
			}
			this.close();
		}
		if( this.url){
			this.socket= new WebSocket( this.url)
			this._socketEventHandlers.forEach( handler=> this.socket.addEventHandler( handler.event, handler))
		}
	}
	send( msg){
	}

	get _socketEventHandlers(){
		return [
			this._socketClosed,
			this._socketError,
			this._socketMessage,
			this._socketOpen
		]
	}
	_socketClosed( evt){
		this.setAttribute( "readyState", 3)
	}
	_socketError( error){
		console.error({ el: this, error})
	}
	_socketMessage( msg){
		const detail= JSON.parse( msg.data)
	}
	_socketOpen(){
		this.setAttribute( "readyState", 1)
	}
	send(
}

WebSockEl.prototype._socketClosed.event= "closed"
WebSockEl.prototype._socketError.event= "error"
WebSockEl.prototype._socketMessage.event= "message"
WebSockEl.prototype._socketOpen.event= "open"

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
