function route(handle, pathname) {

	if (typeof handle[pathname] === 'function') {
		return handle[pathname]();
	} else {
		console.log("no request handler found for " + pathname);
		return "four oh four";
	}
}

exports.route = route;