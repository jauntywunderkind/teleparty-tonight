export async function timesync( ctx, next){
	if( !ctx.path.startsWith( "/timesync")){
		next()
		return
	}
	if( !ctx.ws){
		ctx.log.warn( "non-ws request to /timesync")
		return
	}

	const ws= await ctx.ws()
	ws.on( "message", function incoming( msg){
		ctx.log.debug( msg)
		ctx.send( JSON.stringify({
			id: msg.id,
			result: Date.now
		}))
	})
}
export default timesync
