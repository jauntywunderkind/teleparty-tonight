import WebTorrent from "webtorrent"

export class WebTorrentElement extends HTMLElement {
	constructor(){
	}
	get (){
		return this.getAttribute( "torrent")
	}
	set torrent( torrent){
		this._set( "torrent", torrent)
	}
	get pipeTo(){
		return this.getAttribute( "pipeTo")
	}
	set pipeTo( pipeTo){
		this._set( "pipeTo", pipeTo)
	}
	_set( name, value){
		if( this[ name]=== value){
			return false
		}
		this.setAttribute( name, value)
		return true
	}

	static get observedAttributes(){
		return [ "torrent", "pipeTo"]
	}
	async connectedCallback(){
		this.open()
	}
	disconnectedCallback(){
		this.close()
	}
	attributeChangedCallback( attrNAme, oldVal, newVal){
		
	}

	open(){
		this.client= new WebTorrent()

		client.add(torrentId, function (torrent) {
			var file = torrent.files.find(function (file) {
				return file.name.endsWith('.mp4')
			})
		
			//file.appendTo('body')
		})
	}
	close(){
		this.client= null
	}
}

var client = new WebTorrent()
