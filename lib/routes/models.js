const { Router } = require('express');
const ensureAuth = require('../middleware/ensure-auth');
const Model = require('../models/Model');
const Database = require('../models/Database');

module.exports = Router()
  .post('/', ensureAuth(), async (req, res, next) => {
    try {
      req.body.mdlSchema = JSON.stringify(req.body.mdlSchema);
      const newModel = await Model.create({ ...req.body });
      res.send(newModel);
    } catch(e) {
      next(e);
    }
  })
  .patch('/', ensureAuth(), async (req, res, next) => {
    try {
      const modelToUpdate = await Model.findById(req.body.mdlId);
      const modelToUpdateSchema = JSON.parse(modelToUpdate.mdlSchema);
      const mdlSchema = JSON.stringify({ ...modelToUpdateSchema, [req.body.fieldName]: req.body.dataType });
      const updatedModel = await Model.findByIdAndUpdate(req.body.mdlId, { mdlSchema }, { new: true });
      res.send(updatedModel);
    } catch(e) {
      next(e);
    }
  })
  .get('/', ensureAuth(), async (req, res, next) => {
    try {
      const db = await Database.findOne({ dbName: req.query.database, userId: req.user.sub });
      const dbMdls = await Model.find({ dbId: db._id });
      res.send(dbMdls);
    } catch(e) {
      next(e);
    }
  })
  .get('/:id', ensureAuth(), async (req, res, next) => {
    try {
      const mdl = await Model.findById(req.params.id)
        .populate('dbId')
        .lean();
      res.send(mdl);
    } catch(e) {
      next(e);
    }
  });