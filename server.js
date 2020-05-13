import Koa from "koa"
import KoaPinoLogger from "koa-pino-logger"
import KoaEasyWs from "koa-easy-ws"

import timesync from "./route/timesync.js"
import public_ from "./route/public_.js"

const app= new Koa()
app.use( KoaPinoLogger())
app.use( KoaEasyWs())
app.use( timesync)
app.use( public_)

app.listen( Number.parseInt( process.env.PORT)|| 1211)
