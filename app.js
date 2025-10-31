const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware 👋');
  const reqTime = new Date().toISOString();
  next();
});

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);

const getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
};

const createTour = (req, res) => {
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

const getTour = (req, res) => {
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

const updateTour = (req, res) => {
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

const deleteTour = (req, res) => {
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

 app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
