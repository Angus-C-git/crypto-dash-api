/**
 * UNUSED UTILITY ::: Can be used to authenticate queries and mutations on
 * a case by case basis
 *
 * In this case a global middleware wrapper was used
 *
 * */

module.exports = createMiddleware = (middlewareFunc, resolverFunc)  => (
	parent,
	args,
	context,
	info
) => middlewareFunc(resolverFunc, parent, args, context, info);

