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

// Sintel, a free, Creative Commons movie
var torrentId = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'


