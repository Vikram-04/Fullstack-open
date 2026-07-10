import axios from "axios";
import { useEffect, useState } from "react";
import services from "./services/persons";

const Search = ({ search, handleSearch }) => {
  return (
    <div>
      filter shown with: <input value={search} onChange={handleSearch}></input>
    </div>
  );
};

const AddPerson = ({
  onSubmit,
  newName,
  onNameChange,
  newNumber,
  onNumberChange,
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input value={newName} onChange={onNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Person = ({ person, deletePerson }) => {
  return (
    <>
      <li>
        {person.name} {person.number}
        <button onClick={deletePerson}>delete</button>
      </li>
    </>
  );
};

const Numbers = ({ showPersons, deletePerson }) => {
  return (
    <div>
      {showPersons.map((person) => (
        <Person
          key={person.name}
          person={person}
          deletePerson={() => deletePerson(person.id, person.name)}
        ></Person>
      ))}
    </div>
  );
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");

  const deletePersonOf = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      services.remove(id).then((deletedPerson) => {
        setPersons(persons.filter((person) => person.id != id));
      });
    }
  };

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newName === "" || newNumber === "") {
      alert(`Both name and number are required`);
      return;
    }
    if (!persons.some((person) => person.name === newName)) {
      services
        .add({ name: newName, number: newNumber })
        .then((returnedPerson) => {
          setPersons([...persons, returnedPerson]);
        });
    } else {
      alert(`${newName} is already added to phonebook`);
    }
    setNewName("");
    setNewNumber("");
  };
  const showPersons = persons.filter((person) =>
    person.name.toLowerCase().startsWith(search.toLowerCase()),
  );
  return (
    <div>
      <h1>Phonebook</h1>
      <Search
        search={search}
        handleSearch={(event) => setSearch(event.target.value)}
      ></Search>
      <h2>add a new</h2>
      <AddPerson
        onSubmit={handleSubmit}
        newName={newName}
        onNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        onNumberChange={(event) => setNewNumber(event.target.value)}
      ></AddPerson>
      <h2>Numbers</h2>
      <Numbers
        showPersons={showPersons}
        deletePerson={deletePersonOf}
      ></Numbers>
    </div>
  );
};

export default App;
