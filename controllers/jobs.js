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
  const userId = req.user._id;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job });
}

const updateJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;
  const { company, position } = req.body;

  if (company === '' || position === '') {
    throw new BadRequestError('Company or Position fields cannot be empty');
  }

  const job = await Job.findOneAndUpdate({
    _id: jobId,
    createdBy: userId
  }, req.body, {
    new: true,
    runValidators: true
  });

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }

  res.status(StatusCodes.OK).json({ job });
}

const deleteJob = async (req, res) => {
  const jobId = req.params.id;
  const userId = req.user._id;
  
  const job = await Job.findOneAndRemove({
    _id: jobId,
    createdBy: userId
  });

  if (!job) {
    throw new NotFoundError("Job not found");
  }

  res.status(StatusCodes.OK).json({ job });
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