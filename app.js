// Core Module
// File System

// const { create } = require("domain");
const contacts = require("./contacts");

const main = async () => {
  const name = await contacts.askName();
  const number = await contacts.askNumber();
  const email = await contacts.askEmail();

  contacts.saveContact(name, number, email);
  const newContact = await contacts.newContactAgain();
  if (newContact.toLowerCase() === "y") {
    main();
  } else {
    console.log(`Exiting...`);
    process.exit(0);
  }
};

const deleteContactData = async () => {
  await contacts.showContact();
  const name = await contacts.askDeleteName();

  contacts.resultDeleteContact(name);
};

const commandLine = () => {
  if (process.argv[2] === "add") {
    main();
  } else if (process.argv[2] === "list") {
    contacts.showContact();
    return process.exit(1);
  } else if (process.argv[2] === "delete") {
    deleteContactData();
  } else {
    console.log(`You Can use command below to use this program`);
    const showCommand = contacts.commandChoice();
    showCommand.forEach((show, index) => {
      console.log(`${index + 1}. ${show}`);
    });
    return process.exit(1);
  }
};
commandLine();
