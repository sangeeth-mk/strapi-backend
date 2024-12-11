module.exports = (plugin) => {
  plugin.controllers.auth.register = async (ctx) => {
    const { role, ...rest } = ctx.request.body;

    // Fetch the "user" role
    const userRole = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: "user" } });

    if (!userRole) {
      return ctx.badRequest("Default user role not found. Please configure it in the admin panel.");
    }

    // Force default "user" role if not provided
    rest.role = role ? role : userRole.id;

    // Call the original registration service
    const response = await strapi
      .plugin("users-permissions")
      .services.user.add(rest);

    ctx.send({
      jwt: strapi.plugins["users-permissions"].services.jwt.issue({
        id: response.id,
      }),
      user: response,
    });
  };

  return plugin;
};
