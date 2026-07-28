require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req) => {
  return JSON.stringify(req.body);
});

app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms :body`),
);

app.get("/api/persons", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/info", (request, response) => {
  Person.find({}).then((people) => {
    response.end(
      `Phonebook has info of ${people.length} people\n${new Date().toUTCString()}`,
    );
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      response.json(person);
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      response.json(person);
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;
  const person = new Person({
    name: body.name,
    number: body.number,
  });
  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson);
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;
  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end();
      }
      person.name = name;
      person.number = number;
      person.save().then((savedPerson) => {
        response.json(savedPerson);
      });
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).end();
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log("Error: ", error);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "misformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
