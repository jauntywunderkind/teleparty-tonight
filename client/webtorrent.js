import WebTorrent from "webtorrent"

export class WebTorrentElement extends HTMLElement {
	constructor(){
	}
	get magnet(){
		return this.getAttribute( "magnet")
	}
	set magnet( magnet){
		this._set( "magnet", magnet)
	}
	get pipe(){
		return this.getAttribute( "pipe")
	}
	set pipe( pipe){
		this._set( "pipe", pipe)
	}
	_set( name, value){
		if( this[ name]=== value){
			return false
		}
		this.setAttribute( name, value)
		return true
	}

	static get observedAttributes(){
		return [ "magnet", "pipe"]
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
