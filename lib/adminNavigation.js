'use strict';

// NodeBB modules
let controllers = require('./controllers');

/* ======================== Exports  ========================*/
exports.addAdminNavigation = addAdminNavigation;

/* ======================== function  ========================*/
function addAdminNavigation (header, callback) {
  header.plugins.push({
    route: '/plugins/magicblock',
    icon: 'fa-tint',
    name: 'MagicBlock'
  });

  callback(null, header);
}
