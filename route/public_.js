// apologies this file is named funny but "public" is a reserved word

import KoaStatic from "koa-static"
import { join} from "path"

// lol ok
let __file = import.meta.url.split( "/").splice( 3)
let __dirname = __file.splice( 0, __file.length- 2).join( "/")

export const public_ = KoaStatic( join( "/", __dirname, "public"))
export default public_
