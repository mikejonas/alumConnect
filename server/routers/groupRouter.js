var groupRouter = require('express').Router();
var groupController = require('../controllers/groupController');
var util = require('../lib/utility.js');

groupRouter.route('/')
  .get(groupController.fetchGroups)
  .post(util.isAdmin, groupController.createGroup);

groupRouter.route('/group/:id')
  .get(groupController.fetchGroupInfo)
  .post(util.isAdmin, groupController.modifyGroup)
  .delete(util.isAdmin, groupController.deleteGroup);

module.exports = groupRouter;
