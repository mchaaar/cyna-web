let routeCache = null;

export const initializeRoutes = async () => {
    const routes = await import('../app/routes.json');
    routeCache = routes.default;
};

export const getCachedRoutes = () => routeCache;
