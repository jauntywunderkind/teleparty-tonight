import tick from "./tick.js"

export class DefaulterEl extends HTMLElement {
	constructor(){ 
	}
	/** accessor to gather all param children for this defaulter */
	get params(){
		return Array.prototype.filter( this.children, function( el){ return el.tagName== "param" })
	}
	async connectedCallback(){
		this.applyDefaults()
	}

	/** find the parameters we want to add */	
	calcDefaults( from= new URLSearchParams( window.location.search), to= from){
		let defaulted= 0
		for( let param of this.params){
			for( let attr of params.getAttributeNames()){
				if( !from.has( attr)){
					to.set( attr, param.getAttribute( attr))
					++defaulted
				}
			}
		}
		return to
	}

	/** calculate & apply defaults to set */
	applyDefaults(){
		const params= this.calcDefaults()
		window.location= `${window.location.origin}${window.location.pathname}?${params.toString()}`
	}
}
export default DefaulterEl

export function register(){
	customElements.define("defaulter-el", DefaulterEl)
}
