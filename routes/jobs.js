const express = require('express');
const router = express.Router();

const {
  getAllJobs, getJob, createJob,
  updateJob, deleteJob
} = require('../controllers/jobs');

router.route('/').post(createJob)
                  .get(getAllJobs);

router.route('/:id').post(createJob)
                    .get(getJob)
                    .delete(deleteJob)
                    .patch(updateJob);

module.exports = router;