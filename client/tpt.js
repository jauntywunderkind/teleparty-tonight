// tpt.js
import { TimeSyncEl } from "./timesyncel.js"
import { WebSockEl } from "./websockel.js"

customElements.define( "time-sync-el", TimeSyncEl)
customElements.define( "web-sock-el", WebSockEl)

export {
	TimeSyncEl,
	WebSockEl,
	
}
