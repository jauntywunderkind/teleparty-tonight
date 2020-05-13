import resolve from "@rollup/plugin-node-resolve"
import cjsEs from "rollup-plugin-cjs-es"

export default {
	input: [
		//"client/websockel.js",
		//"client/timesync.js",
		//"client/player.js"
		"client/tpt.js"
	],
	output: {
		//dir: "public",
		file: "public/tpt.js",
		format: "es",
		sourcemap: true
	},
	plugins: [
		resolve(),
		cjsEs({ nested: true})
	],
}
