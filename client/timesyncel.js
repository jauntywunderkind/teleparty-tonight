// timesync.js
import { create as timesync } from "timesync/src/timesync.js"
import { WebsockelDataOut, WebsockelDataIn } from "./websockel.js"

const resolved= Promise.resolve()

const eo= {
	passive: true,
	once: true
}

export class TimeSyncEl extends HTMLElement{
	constructor(){
		super();
		["_send", "_websockelDataIn", "_websockelOpen", "_websockelClose"]
			.forEach( name=> this[ name]= this[ name].bind( this))
		//this.open()
		this.addEventListener( "websockelopen", this._websockelOpen)
		this.addEventListener( "websockelclose", this._websockelClose)
	}

	// general properties
	get delay(){
		return Number.parseInt( this.getAttribute( "delay")|| 300)
	}
	set delay( delay= 300){
		this._set( "delay", delay)
	}
	get interval(){
		return Number.parseInt( this.getAttribute( "interval")|| 5000)
	}
	set interval( interval= 5000){
		this._set( "interval", interval)
	}
	get repeat(){
		return Number.parseInt( this.getAttribute( "repeat")|| 5)
	}
	set repeat( repeat){
		this._set( "repeat", repeat)
	}
	get timeout(){
		return Number.parseInt( this.getAttribute( "timeout")|| 20000)
	}
	set timeout( timeout= 20000){
		this._set( "timeout", timeout)
	}
	_set( name, value){
		if( this[name]=== value){
			return
		}
		this.setAttribute( name, value)
		if( this.timesync){
			this.timesync.options[ name]= value
		}
	}

	// customelement members
	static get observedAttributes(){
		return [ "delay", "interval", "repeat", "timeout"]
	}
	async connectedCallback(){
		const sockel= this._findSocket()
		if( !sockel){
			console.error( "websockel not found during open")
			return
		}

		// listen
		sockel.addEventListener( "websockeldatain", this._websockelDataIn)
		// prepare for cleanup
		sockel.addEventListener( "websockelclose", this._websockelClose, eo)
		// open, now or latter
		if( sockel.readyState>= -1){
			this.open()
		}else{
			sockel.addEventListener( "websockelopen", this._websockelOpen, eo)
		}
	}
	disconnectedCallback(){
		this.close()
		const socket= this._findSocket()
		if( !socket){
			return
		}
		socket.removeEventListener( "websockeldatain", this._websockelDataIn)
		socket.removeEventListener( "websockelclose", this._websockelClose, eo)
		socket.removeEventListener( "websockelopen", this._websockelOpen, eo)
	}
	attributeChangedCallback( attrName, oldVal, newVal){
		this[ attrName]= newVal
	}

	open(){
		if( this.timesync){
			return
		}

		const sockel= this._findSocket()
		if( !sockel){
			throw new Error( "websockel expected")
		}

		this.timesync= timesync({
			delay: this.delay,
			interval: this.interval,
			repeat: this.repeat,
			server: sockel,
			timeout: this.timeout
		})
		this.timesync.send= this._send
		//this.timesync.sync()

		//socket.addEventListener( "timesync", this._receiveTimesync)
	}
	close(){
		if( this.timesync){
			this.timesync.destroy()
			this.timesync= null;
		}
	}

	_findSocket(){
		let cursor= this
		while( cursor&& cursor!== document){
			if( cursor.tagName.toLowerCase()=== "web-sock-el"){
				return cursor
			}
			cursor= cursor.parentNode
		}
	}
	async _send( sockel, data, timeout){
		if( sockel.socket){
			sockel.dispatchEvent( new WebsockelDataOut( data))
		}else{
			throw new Error("socket not up")
		}
	}
	_websockelDataIn( evt){
		if( !this.timesync){
			return
		}
		console.log({recv: evt.detail})
		this.timesync.receive( null, evt.detail)
	}

	_websockelOpen(){
		this.open()
	}
	_websockelClose(){
		// assume websockel will come back
		//this.close()
	}
}
export default TimeSyncEl
