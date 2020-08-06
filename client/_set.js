// assumes there is a getter
export function _set( self, name, value){
	if( self[ name]=== value){
		return false
	}
	self.setAttribute( name, value)
	return true
}
export default _set
