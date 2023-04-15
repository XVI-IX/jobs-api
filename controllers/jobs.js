const { StatusCodes } = require('http-status-codes');
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require('../errors')

const getAllJobs = (req, res) => {
  res.send('get all Jobs ')
}

const getJob = (req, res) => {
  res.send('get Job ')
}

const updateJob = (req, res) => {
  res.send('update Job ')
}

const deleteJob = (req, res) => {
  res.send('delete Job ')
}

const createJob = (req, res) => {
  res.json(req.body);
}

module.exports = {
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
  createJob
}