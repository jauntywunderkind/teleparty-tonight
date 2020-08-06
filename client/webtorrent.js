import WebTorrent from "webtorrent"
import findProp from "class-wrangle-helper/findprop.js"

const _filter= Array.prototype.filter

export class WebTorrentClient extends HTMLElement {
	static isTorrent(el){
		return el.tagName=== "webtorrent-torrent"
	}

	constructor(){
	}

	// TODO: restructure to use `.client`
	// TODO: binding between .client props & attributes
	get maxConns(){
		return Number.parseInt( this.getAttribute( maxConns))
	}
	set maxConns( maxConns){
		_set( this, "maxConns", maxConns)
	}
	get nodeId(){
		// TODO: use client as primary
		return this.getAttribute( "nodeId")
	}
	set nodeId( nodeId){
		_set( this, "nodeId", nodeId)
	}
	get peerId(){
		return this.getAttribute( "peerId")
	}
	set peerId( peerId){
		_set( this, "peerId", peerId)
	}

	/** children torrents */
	get torrents(){
		const isTorrent= findProp( this, "isTorrent")
		return _filter.call( this.children, isTorrent)
	}
	set torrents( torrents){
		const
			isTorrent= findProp( this, "isTorrent"),
			removed= new Set( this.torrents)
		// add torrents
		for( let t of torrents){
			if( !isTorrent( torrents)){
				// non-torrent, ignore
				continue
			}
			if( removed.delete( t)){
				// ignore already existing torrents
				continue
			}
			this.appendChild( t)
		}
		// remove removed torrents
		for( let t of removed){
			t.destroy()
			this.removeChild( t)
		}
	}

	static get observedAttributes(){
		return []
	}
	async connectedCallback(){
		this.open()
	}
	disconnectedCallback(){
		this.close()
	}
	attributeChangedCallback( attrNAme, oldVal, newVal){
	}

	add( torrent){
		// TODO: if not torrent-el, lift
		this.appendChild( torrent)
		this.client.add( torrent.id)
	}
	open(){
		// TODO: skip if open

		// TODO: options
		this.client= new WebTorrent()

		// children
		for( const t of this.torrents){
			this.client.add( t)
		}
	}
	close(){
		this.client.destroy()
		this.client= null
	}
}

export function register(){
	customElements.define("webtorrent-client", WebTorrentClient)
}
