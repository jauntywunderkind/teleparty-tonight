export async function timesync( ctx, next){
	if( !ctx.path.startsWith( "/timesync")){
		return await next()
	}
	if( !ctx.ws){
		ctx.log.warn( "non-ws request to /timesync")
		return
	}

	const ws= await ctx.ws()
	ws.on( "message", function incoming( msg){
		msg= JSON.parse( msg)
		ctx.log.info( msg)
		ws.send( JSON.stringify({
			id: msg.id,
			result: Date.now()
		}))
	})
}
export default timesync
