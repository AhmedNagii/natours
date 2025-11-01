const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkID = (req, res, next, val) => {
  console.log(`Tour id is : ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => { 
  const { price, name } = req.body
    if (!price || !name) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid body',
      });
    }
  next()

}

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: { tour: newTour },
      });
    }
  );
};

exports.getTour = (req, res) => {
  // convert the string to a number
  const id = +req.params.id;
  const tour = tours.find((el) => el.id === id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid id' });
  }

  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Tour not found' });
  }
  res.status(200).json({
    status: 'success',
    data: { tour },
  });
};

exports.updateTour = (req, res) => {
  // convert the string to a number
  const id = +req.params.id;
  if (Number.isNaN(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  const tourIndex = tours.findIndex((el) => el.id === id);

  if (tourIndex === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }

  tours[tourIndex] = { ...tours[tourIndex], ...req.body.updatedValues };

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Error writing to file',
        });
      }
      res.status(200).json({
        status: 'success',
        data: { tour: tours[tourIndex] },
      });
    }
  );
};

exports.deleteTour = (req, res) => {
  // convert the string to a number
  const id = +req.params.id;
  if (Number.isNaN(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  const updatedTours = tours.filter((el) => el.id !== id);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(updatedTours),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: 'Error writing to file',
        });
      }
      res.status(204).json({
        status: 'success',
        data: null,
      });
    }
  );
};
