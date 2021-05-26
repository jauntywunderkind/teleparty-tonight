import { defineObservedAttributes, controller, initializeAttrs} from "@github/catalyst"

// timesync.js
import { create as timesync } from "timesync/src/timesync.js"
import { WebsockelDataOut, WebsockelDataIn } from "./websockel.js"

const eo= {
	passive: true,
	once: true
}

const _timeSyncObservedAttr= [ "delay", "interval", "repeat", "timeout"]

export class TimeSyncEl extends HTMLElement{

	delay= 300
	interval= 5000
	repeat= 5
	timeout= 20000

	constructor(){
		["_send", "_websockelDataIn", "_websockelOpen", "_websockelClose"]
			.forEach( name=> this[ name]= this[ name].bind( this))
		//this.open()
		this.addEventListener( "websockelopen", this._websockelOpen)
		this.addEventListener( "websockelclose", this._websockelClose)

		initializeAttrs(this, _timeSyncObservedAttr);
	}

	// has this been filtered through the initializeAttr type-checking/defaulting? i think/hope so
	attributeChangedCallback( name, oldValue, newValue){
		if( this.timesync){
			this.timesync.options[ name]= newValue
		}
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

defineObservedAttributes(TimeSyncEl, _timeSyncObservedAttr)
const TimeSyncEl2= controller( TimeSyncEl)

export default TimeSyncEl2
