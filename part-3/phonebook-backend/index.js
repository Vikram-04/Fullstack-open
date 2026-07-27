require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");
const app = express();

app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => {
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

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id).then((person) => {
    response.json(person);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    response
      .status(400)
      .json({ error: `Person name and number fields must exist` });
    return;
  }
  Person.find({ name: body.name }).then((people) => {
    if (people.length != 0) {
      return response.status(400).json({
        error: `Person with name ${body.name} already exists in phonebook`,
      });
    }
    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person.save().then((savedPerson) => {
      response.json(savedPerson);
    });
  });
});

PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
