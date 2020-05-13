// tpt.js
import { TimeSyncEl } from "./timesyncel.js"
import { WebSockEl } from "./websockel.js"

customElements.define( "timesyncel", TimeSyncEl)
customElements.define( "websockel", WebSockEl)

export {
	TimeSyncEl,
	WebSockEl,
	
}
