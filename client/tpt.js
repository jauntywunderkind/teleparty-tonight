// tpt.js
export { TimeSyncEl } from "./timesyncel.js"
export { WebSockEl, register as registerWebSockEl } from "./websockel.js"
export { WebTorrentClient, register as registerWebTorrentClient} from "./webtorrent.js"

export function registerWebComponents(){
	for( let register of registerWebComponents.register){
		register()
	}
}
registerWebComponents.registers= [
	registerWebSockEl,
	registerWebTorrentClient
]
