const { sanitizeEntity } = require('@strapi/utils');

module.exports = {
  async register(ctx) {
    const { email, password, username, role } = ctx.request.body;

    if (!email || !password || !username) {
      return ctx.badRequest('Email, username, and password are required.');
    }

    // Check if the role exists
    let userRole = await strapi.query('plugin::users-permissions.role').findOne({ where: { id: role } });
    if (!userRole) {
      return ctx.badRequest('Invalid role provided.');
    }

    // Create the user
    const newUser = await strapi.query('plugin::users-permissions.user').create({
      data: {
        email,
        username,
        password,
        role: userRole.id, // Assign the role here
      },
    });

    // Generate JWT and return sanitized user data
    const sanitizedUser = sanitizeEntity(newUser, { model: strapi.models.user });
    const jwt = strapi.service('plugin::users-permissions.jwt').issue({ id: sanitizedUser.id });

    return ctx.send({ jwt, user: sanitizedUser });
  },
};
