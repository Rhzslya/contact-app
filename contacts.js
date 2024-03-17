const fs = require("fs");
const validator = require("validator");
const chalk = require("chalk");
const { resolve } = require("path");

const readline = require("readline");
const { json } = require("stream/consumers");
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

const askName = () => {
  return new Promise((resolve, reject) => {
    rl.question(chalk`{green Add Contact Name} : `, (name) => {
      const contactsData = JSON.parse(fs.readFileSync(dataPath));
      for (const contact of contactsData) {
        if (name === contact.name) {
          console.log(
            chalk`{red.bold Name {white.bgRed "${name}"} already exist!}`
          );
          ValidationName().then(resolve);
          return;
        } else if (name === "") {
          console.log(chalk`{red Name Cannot Be Empty}`);

          return askName().then(resolve);
        }
      }
      resolve(name);
    });
  });
};

const askNumber = () => {
  return new Promise((resolve, reject) => {
    rl.question(chalk`{green What is Phone Number : }`, (number) => {
      number = number.toString();

      const contactsData = JSON.parse(fs.readFileSync(dataPath));
      for (const contact of contactsData) {
        if (number === contact.number) {
          console.log(
            chalk`{red Number {white.bgRed "${number}"} already exist}`
          );
          validationNumber().then(resolve);
          return;
        }

        if (!validator.isMobilePhone(number, "id-ID")) {
          console.log(chalk`{red Wrong Format Number}`);
          validationNumber().then(resolve);
          return;
        }
      }
      resolve(number);
    });
  });
};

const askEmail = () => {
  return new Promise((resolve, reject) => {
    rl.question(chalk`{green What is Email : }`, (email) => {
      const contactsData = JSON.parse(fs.readFileSync(dataPath));
      for (const contact of contactsData) {
        if (email === contact.email) {
          console.log(chalk`{red Email {white.bgRed"${email}"} already exist}`);
          validationEmail().then(resolve);
          return;
        }

        if (!validator.isEmail(email)) {
          console.log(chalk`{red Wrong Format Email}`);
          validationEmail().then(resolve);
          return;
        }
      }
      resolve(email);
    });
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
  const contactsData = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(contactsData);

  contacts.push(contactSave);
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
};

module.exports = {
  askName,
  askNumber,
  askEmail,
  saveContact,
  newContactAgain,
};
