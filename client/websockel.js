// websockel.js
export class WebSockEl extends HTMLElement {
	constructor(){
		super()
		// bind all socket event handlers
		this._socketEventHandlers.forEach( fn=> this[ fn.name]= this[ fn.name].bind(this))

		// send outbound messages
		this._socketSend= this._socketSend.bind( this)
		this.open= this.open.bind( this)
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
			this._socketEventHandlers.forEach( handler=> this.socket.removeEventListener( extractEventName(handler), handler))
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
			if( this._reopen){
				console.info( "websockel reconnecting")
			}
			const socket= this.socket= new WebSocket( url)
			this._socketEventHandlers.forEach( function( handler){
				const name= extractEventName( handler)
				socket.addEventListener( name, handler)
			})
		}
	}
	send( msg){
		if( !this.socket){
			console.warn( "websockel not connected, dropped message")
			return
		}
		if( !( msg instanceof String)){
			msg= JSON.stringify( msg)
		}
		this.socket.send( msg)
	}

	get _socketEventHandlers(){
		return [
			this._socketClose,
			this._socketMessage,
			this._socketError,
			this._socketOpen
		]
	}
	_socketClose( evt){
		this.setAttribute( "readyState", 3)
		this.dispatchEvent( new WebsockelClose( evt))

		console.log("close")
		if( this._reopen){
			return
		}
		this._reopen= setInterval( this.open, 10000)
	}
	_socketMessage( msg){
		let data= msg.data
		try{
			data= JSON.parse( data)
		}catch(ex){}
		this.dispatchEvent( new WebsockelDataIn( data))
	}
	_socketError( err){
		this.dispatchEvent( new WebsockelError( err))

		console.log("error")
		if( this._reopen){
			return
		}
		this._reopen= setInterval( this.open, 10000)
	}
	_socketOpen( evt){
		this.setAttribute( "readyState", 1)
		this.dispatchEvent( new WebsockelOpen( evt))

		if( !this._reopen){
			return
		}
		console.info("websockel reconnected")
		clearInterval( this._reopen)
		this._reopen= null
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
	WebsockelClose= makeEventType( "WebsockelClose"),
	WebsockelDataOut= makeEventType( "WebsockelDataOut"),
	WebsockelDataIn= makeEventType( "WebsockelDataIn"),
	WebsockelError= makeEventType( "WebsockelError"),
	WebsockelOpen= makeEventType( "WebsockelOpen")

export default WebSockEl

export function register(){
	customElements.define("web-sock-el", WebSockEl)
}
