const fs = require('fs');
const express = require('express');

const app = express();

app.use(express.json());

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, 'utf-8')
);




app.post('/api/v1/tours', (req, res) => {
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
});

app.get('/api/v1/tours/:id', (req, res) => {
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
});

app.patch('/api/v1/tours/:id', (req, res) => {
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
});
app.delete('/api/v1/tours/:id', (req, res) => {
  // convert the string to a number
  const id = +req.params.id;
  if (Number.isNaN(id)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid id',
    });
  }

  const  updatedTours = tours.filter((el) => el.id !== id);

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
        data:null,
      });
    }
  );
});

app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { tours },
  });
});



const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
