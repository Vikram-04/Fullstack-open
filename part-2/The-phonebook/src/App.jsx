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

const Notification = ({ message, color }) => {
  if (message === null) return null;
  const messageStyle = {
    border: `solid 2px ${color}`,
    color: `${color}`,
    padding: "5px",
    borderRadius: "5px",
    marginBottom: "20px",
    textAlign: "center",
    fontSize: "20px",
    marginInline: "30px",
    backgroundColor: "lightGray",
  };

  return <div style={messageStyle}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState([null, null]);

  function resetMessage() {
    setTimeout(() => {
      setMessage([null, null]);
    }, 5000);
  }

  const deletePersonOf = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      services.remove(id).then((deletedPerson) => {
        setMessage([`Deleted ${deletedPerson.name} from phonebook`, "green"]);
        resetMessage();
        setPersons(persons.filter((person) => person.id != deletedPerson.id));
      });
    }
  };

  useEffect(() => {
    services.getAll().then((initialPersons) => {
      setPersons(initialPersons);
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
          setMessage([`Added ${returnedPerson.name} to phonebook`, "green"]);
          resetMessage();
          setPersons([...persons, returnedPerson]);
        });
    } else {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`,
        )
      ) {
        const person = persons.find((p) => p.name == newName);
        services
          .update(person.id, { ...person, number: newNumber })
          .then((returnedPerson) => {
            setMessage([
              `${returnedPerson.name}'s phone number replaced successfully`,
              "green",
            ]);
            resetMessage();
            setPersons(
              persons.map((p) => (p.id == person.id ? returnedPerson : p)),
            );
          })
          .catch((error) => {
            setMessage([
              `${person.name}'s information has already been deleted from the server`,
              "red",
            ]);
            resetMessage();
            setPersons(persons.filter((p) => p.id != person.id));
          });
      }
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
      <Notification message={message[0]} color={message[1]}></Notification>
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
