// websockel.js
export class WebSockEl extends HTMLElement {
	constructor(){
		super()
		// bind all socket event handlers
		this._socketEventHandlers.forEach( fn=> this[ fn.name]= this[ fn.name].bind(this))

		// send outbound messages
		this._socketSend= this._socketSend.bind( this)
		this.addEventListener( "websockeldataout", this._socketSend)

		// open
		this.open()
	}

	// general properties
	get url(){
		return this.getAttribute("url")
	}
	set url( url){
		if( url=== this.url){
			return
		}
		this.setAttribute( "url", url)
		if( this.socket){
			this.close()
			this.open()
		}
	}
	get readyState(){
		return this.socket&& this.socket.readyState
	}

	// customelement members
	static get observedAttributes(){
		return [ "url"];
	}
	connectedCallback(){
		this.open()
	}
	disconnectedCallback(){
		this.close()
	}
	attributeChangedCallback( attrName, oldVal, newVal){
		this[ attrName]= newVal
	}

	// websocket members
	close( code= 1000, reason){
		if( this.socket){
			this._socketEventHandlers.forEach( handler=> this.socket.removeEventListener( extractEventName(event), handler))
			this.socket.close( code, reason)
			this.socket= null
		}
	}
	open(){
		const url= `ws://${ window.location.host}${ this.url}`
		if( this.socket){
			if( this.socket.url=== url&& this.socket.readyState<= 1){
				// already open at this url
				return
			}
			this.close();
		}
		if( this.url){
			this.socket= new WebSocket( url)
			this._socketEventHandlers.forEach( handler=> this.socket.addEventListener( extractEventName(handler), handler))
		}
	}
	send( msg){
		if( !( msg instanceof String)){
			msg= JSON.stringify( msg)
		}
		this.socket.send( msg)
	}

	get _socketEventHandlers(){
		return [
			this._socketClosed,
			this._socketDataIn,
			this._socketError,
			this._socketOpen
		]
	}
	_socketClosed( evt){
		this.setAttribute( "readyState", 3)
		this.dispatchEvent( new WebsockelClosed( evt))
	}
	_socketDataIn( msg){
		try{
			msg= JSON.parse( msg.data)
		}catch(ex){}
		this.dispatchEvent( new WebsockelDataIn( msg))
	}
	_socketError( err){
		this.dispatchEvent( new WebsockelError( err))
	}
	_socketOpen( evt){
		this.setAttribute( "readyState", 1)
		this.dispatchEvent( new WebsockelOpen( evt))
	}
	_socketSend( evt){
		this.send( evt.detail)
	}
}

const extract= /(?:bound )?_socket(.*)/
function extractEventName( handler){
	const name= extract.exec( handler.name)
	if( !name){
		throw new Error( "unexpected handler '${ handler.name}'")
	}
	return name[1].toLowerCase()
}

export const EventTypes = {}

function makeEventType( name){
	const existing= EventTypes[ name]
	if( existing){
		return existing
	}
	// big funky wrapper to give it the correct name
	const eventClass= ({[ name]: class extends Event{
		constructor( detail){
			super(name.toLowerCase(), {bubbles: true, cancelable: true, detail})
			this.detail= detail
		}
	}})[ name]
	EventTypes[ name]= eventClass
	return eventClass
}

export const
	WebsockelClosed= makeEventType( "WebsockelClosed"),
	WebsockelDataOut= makeEventType( "WebsockelDataOut"),
	WebsockelDataIn= makeEventType( "WebsockelDataIn"),
	WebsockelError= makeEventType( "WebsockelError"),
	WebsockelOpen= makeEventType( "WebsockelOpen")

export default WebSockEl
