import Koa from "koa"
import KoaPinoLogger from "koa-pino-logger"

import public_ from "./route/public_.js"

const app= new Koa()
app.use( KoaPinoLogger())
app.use( public_)

app.listen( Number.parseInt( process.env.PORT)|| 1211)
