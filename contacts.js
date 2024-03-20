const fs = require("fs");
const validator = require("validator");
const chalk = require("chalk");
const readline = require("readline");
const main = require;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
} else {
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  if (fileContent.trim() === "") {
    fs.writeFileSync(dataPath, "[]", "utf-8");
  }
}

const loadContact = () => {
  const contactsData = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(contactsData);
  return contacts;
};

const commandChoice = () => {
  const list = [
    chalk`{green node app add} : Add New Contact`,
    chalk`{green node app list} : Show List Contact Save`,
    chalk`{green node app delete} : Delete Contact`,
  ];

  return list;
};

const askName = () => {
  return new Promise((resolve, reject) => {
    rl.question(chalk`{green Add Contact Name} : `, (name) => {
      if (name.trim() === "") {
        console.log(chalk`{red Name Cannot Be Empty}`);
        askName().then(resolve);
      } else if (!validator.isAlpha(name.replace(/\s/g, ""))) {
        console.log(chalk`{red Name Cannot Be Number}`);
        askName().then(resolve);
      } else {
        const contactsData = JSON.parse(fs.readFileSync(dataPath));
        for (const contact of contactsData) {
          if (name === contact.name) {
            console.log(
              chalk`{red.bold Name {white.bgRed "${name}"} already exist!}`
            );
            ValidationName().then(resolve);
            return;
          }
        }
        resolve(name);
      }
    });
  });
};

const askNumber = () => {
  return new Promise((resolve, reject) => {
    rl.question(chalk`{green What is Phone Number : }`, (number) => {
      number = number.toString();

      if (!validator.isMobilePhone(number, "id-ID")) {
        console.log(chalk`{red Wrong Format Number}`);
        askNumber().then(resolve);
      } else {
        const contactsData = JSON.parse(fs.readFileSync(dataPath));
        for (const contact of contactsData) {
          if (number === contact.number) {
            console.log(
              chalk`{red Number {white.bgRed "${number}"} already exist}`
            );
            validationNumber().then(resolve);
            return;
          }
        }
        resolve(number);
      }
    });
  });
};

const askEmail = () => {
  return new Promise((resolve, reject) => {
    rl.question(
      chalk`{green What is Email (Enter '-' to skip this step): }`,
      (email) => {
        if (email.toLowerCase() === "-") {
          return resolve(email);
        }

        if (!validator.isEmail(email)) {
          console.log(chalk`{red Wrong Format Email}`);
          askEmail().then(resolve);
        } else {
          const contactsData = JSON.parse(fs.readFileSync(dataPath));
          for (const contact of contactsData) {
            if (email === contact.email) {
              console.log(
                chalk`{red Email {white.bgRed"${email}"} already exist}`
              );
              validationEmail().then(resolve);
              return;
            }
          }
          resolve(email);
        }
      }
    );
  });
};

const ValidationName = () => {
  return new Promise((resolve, reject) => {
    rl.question(
      chalk`{green Do You Want To Change Name? (y{white /}{red n}) : }`,
      (answer) => {
        if (answer.toLowerCase() === "y") {
          return askName().then(resolve);
        } else if (answer.toLowerCase() === "n") {
          rl.close();
        } else {
          console.log(
            chalk`{red Invalid Input Please Enter {green 'y'} or 'n'}`
          );
          return ValidationName().then(resolve);
        }
      }
    );
  });
};

const validationNumber = () => {
  return new Promise((resolve, reject) => {
    rl.question(
      chalk`{green Do You Want To Change Number? (y{white /}{red n}) : }`,
      (answer) => {
        if (answer.toLowerCase() === "y") {
          return askNumber().then(resolve);
        } else if (answer.toLowerCase() === "n") {
          rl.close();
        } else {
          console.log(
            chalk`{red Invalid Input Please Enter {green 'y'} or 'n'}`
          );
          return validationNumber().then(resolve);
        }
      }
    );
  });
};

const validationEmail = () => {
  return new Promise((resolve, reject) => {
    rl.question(
      chalk`{green Do You Want To Change Email? (y{white /}{red n)} : }`,
      (answer) => {
        if (answer.toLowerCase() === "y") {
          return askEmail().then(resolve);
        } else if (answer.toLowerCase() === "n") {
          rl.close();
        } else {
          console.log(
            chalk`{red Invalid Input Please Enter {green 'y'} or 'n'}`
          );
          return validationEmail().then(resolve);
        }
      }
    );
  });
};

const newContactAgain = () => {
  return new Promise((resolve, reject) => {
    console.log(chalk`{bgGreen.white Contact Successfully Added}`);
    rl.question(
      chalk`{green Do You Want To Add New Contact Again? (y{white /}{red n)} : }`,
      (answer) => {
        if (answer.toLowerCase() === "y") {
          askName().then((name) => {
            askNumber().then((number) => {
              askEmail().then((email) => {
                saveContact(name, number, email);
                newContactAgain().then(resolve);
              });
            });
          });
        } else if (answer.toLowerCase() === "n") {
          rl.close();
        } else {
          console.log(
            chalk`{red Invalid Input Please Enter {green 'y'} or 'n'}`
          );
          return newContactAgain().then(resolve);
        }
        resolve(answer);
      }
    );
  });
};

const saveContact = (name, number, email) => {
  const contactSave = { name, number, email };

  const contacts = loadContact();

  contacts.push(contactSave);
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts, null, 4));
};

// List Contact
const showContact = () => {
  const contactsData = JSON.parse(fs.readFileSync("data/contacts.json"));
  const contacts = loadContact();
  if (contacts.length === 0) {
    console.log(chalk`{red No Contact Found}`);
    rl.close();
    return false;
  }
  contactsData.forEach((contact, i) => {
    console.log(
      `${i + 1}. Name : ${contact.name} - Number : ${contact.number}`
    );
  });
};
// Delete Contact
const askDeleteName = () => {
  return new Promise((resolve, reject) => {
    const contacts = loadContact();
    if (contacts.length === 0) {
      console.log(chalk`{red No Contact Found}`);
      rl.close();
      return false;
    }
    rl.question(chalk`{red Delete Contact Name} : `, (name) => {
      if (name.trim() === "") {
        console.log(chalk`{red Name Cannot Be Empty}`);
        askDeleteName().then(resolve);
      } else {
        resolve(name);
      }
    });
  });
};

const resultDeleteContact = (name) => {
  const contacts = loadContact();
  const contact = contacts.find((contact) => contact.name === name);

  if (!contact) {
    console.log(chalk`{red Contact {white.bgRed "${name}"} Not Found}`);
    rl.close();
    return false;
  }

  const newContacts = contacts.filter(
    (contact) => contact.name.toLowerCase() !== name.toLowerCase()
  );
  fs.writeFileSync("data/contacts.json", JSON.stringify(newContacts, null, 4));
  console.log(chalk`{green Contact {inverse "${name}"} has been deleted}`);
  rl.close();
};

module.exports = {
  askName,
  askNumber,
  askEmail,
  saveContact,
  newContactAgain,
  showContact,
  askDeleteName,
  resultDeleteContact,
  commandChoice,
};

// File ini ada di contacts.js
