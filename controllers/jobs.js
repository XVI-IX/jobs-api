const { StatusCodes } = require('http-status-codes');
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({
    createdBy: req.user._id
  });

  if (!jobs) {
    return NotFoundError(`Jobs created by ${req.user._id} not found`);
  }

  res.status(StatusCodes.OK).json({
    jobs,
    count: jobs.length
  });
}

const getJob = async (req, res) => {

  const jobId = req.params.id;
  const job = await Job.findById(jobId);

  res.send('get Job ')
}

const updateJob = (req, res) => {
  res.send('update Job ')
}

const deleteJob = (req, res) => {
  res.send('delete Job ')
}

const createJob = async (req, res) => {
  req.body.createdBy = req.user._id;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
}

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  createJob
}