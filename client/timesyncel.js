// timesync.js
import { create as timesync } from "timesync/src/timesync.js"
import { WebsockelOutbound } from "./websockel.js"

const resolved= Promise.resolve()

export class TimeSyncEl extends HTMLElement{
	constructor(){
		super()
		this._receiveTimesync= this._receiveTimesync.bind( this)
	}

	// general properties
	get delay(){
		return Number.parseInt( this.getAttribute( "delay")|| 300)
	}
	set delay( newDelay= 300){
		this.setAttribute( "delay", newDelay)
	}
	get interval(){
		return Number.parseInt( this.getAttribute( "interval")|| 5000)
	}
	set interval( newInterval= 5000){
		this.setAttribute( "interval", newInterval)
	}
	get repeat(){
		return Number.parseInt( this.getAttribute( "repeat")|| 5)
	}
	set repeat( newRepeat){
		this.setAttribute( "repeat", newRepeat)
	}
	get timeout(){
		return Number.parseInt( this.getAttribute( "timeout")|| 20000)
	}
	set timeout( newTimeout= 20000){
		this.setAttribute( "timeout", newTimeout)
	}

	// customelement members
	static get observedAttributes(){
		return [ "delay", "interval", "repeat", "timeout"]
	}
	connectedCallback(){
		this.open()
	}
	disconnectedCallback(){
		this.close()
	}
	attributeChangedCallback( attrName, oldVal, newVal){
		// TODO
	}

	open(){
		if( this.timesync){
			return
		}

		const socket= this._findSocket()
		if( !socket){
			return
		}

		this.timesync= timesync({
			delay: this.delay,
			interval: this.interval,
			repeat: this.repeat,
			server: socket.socket,
			timeout: this.timeout
		})
		this.timesync.send= this._send

		socket.addEventListener( "timesync", this._receiveTimesync)
	}
	close(){
		if( this.timesync){
			this.timesync.destory()
			this.timesync= null;
		}
	}

	_findSocket(){
		let cursor= this
		while( cursor){
			if( cursor.tagName.toLowerCase()=== "websockel"){
				return 
			}
			cursor= cursor.parentNode
		}
	}
	async _send( socket, data, timeout){
		// TODO: timeout
		console.log({ socket, data})
		//socket.send( data)

		const outbound = WebsockelOutbound( data)
		this.dispatch( outbound)
	}
	_receiveTimesync( evt){
		if( !this.timesync){
			return
		}
		this.timesync.receive( null, evt.data)
	}
}
export default TimeSyncEl
