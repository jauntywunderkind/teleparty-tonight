// show the init form if the url does not have anything
const qs= new URLSearchParams( window.location.search)
if( !qs.get("video")|| !qs.get("start")){
	document.querySelector("#init").classList.remove("hidden")
}
