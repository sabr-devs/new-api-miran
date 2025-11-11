'use strict';


export const getService = (name) => {
  return strapi.plugin('users-permissions').service(name);
};

export const sanitize = require('./sanitize');