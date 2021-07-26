const db = require('../../data/db-config');
const Car = require('../cars/cars-model');
const vinValidator = require('vin-validator');

const checkCarId = async (req, res, next) => {
  // DO YOUR MAGIC
  try {
    const car = await Car.getById(req.params.id);
    if (car) {
      req.car = car;
      next();
    } else {
      res
        .status(404)
        .json({ message: `car with id ${req.body.id} is not found` });
    }
  } catch {
    res.status(500).json({ message: 'There is an error with the server' });
  }
};

const checkCarPayload = (req, res, next) => {
  // DO YOUR MAGIC
  const { vin, make, model, mileage } = req.body;

  if (vin && make && model && mileage) {
    next();
  } else {
    const missingFields = [];
    if (!vin) {
      //missingFields.push(vin);
      res.status(400).json({ message: `vin is missing` });
    }
    if (!make) {
      //missingFields.push(make);
      res.status(400).json({ message: `make is missing` });
    }
    if (!model) {
      //missingFields.push(model);
      res.status(400).json({ message: `model is missing` });
    }
    if (!mileage) {
      //missingFields.push(mileage);
      res.status(400).json({ message: `mileage is missing` });
    }
    //res.status(400).json({ message: `${missingFields} is missing` });
  }
};

const checkVinNumberValid = (req, res, next) => {
  // DO YOUR MAGIC

  const isVinValid = vinValidator.validate(req.body.vin);

  if (isVinValid) {
    next();
  } else {
    res.status(400).json({ message: `vin ${req.body.vin} is invalid` });
  }
};

const checkVinNumberUnique = async (req, res, next) => {
  // DO YOUR MAGIC

  const vin = req.body.vin;

  const vinNotUnique = await db('cars').where({ vin }).first();

  if (vinNotUnique) {
    res.status(400).json({ message: `vin ${vin} already exists` });
  } else {
    next();
  }
};

module.exports = {
  checkCarId,
  checkCarPayload,
  checkVinNumberValid,
  checkVinNumberUnique,
};
