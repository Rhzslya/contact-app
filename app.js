// Core Module
// File System

// const { create } = require("domain");
const fs = require("fs");
const validator = require("validator");
const { resolve } = require("path");
// const { Readline } = require("readline/promises");
// console.log(fs);

// Menuliskan String File secara Synchronus

// try {
//   fs.writeFileSync("data/hello.txt", "Hello World");
// } catch (e) {
//   console.log(e);
// }

// Menuliskan String file secara Asynchronus
// fs.writeFile("data/hello.txt", "Membuat File Secara Asynchronus", (err) => {
//   console.log(err);
// });

// const data = fs.readFileSync("hello.txt", "utf-8");
// console.log(data);

// fs.readFile("hello.txt", "utf-8", (err, data) => {
//   if (err) throw err;
//   console.log(data);
// });

const readline = require("readline");
const { json } = require("stream/consumers");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function formattedPhoneNumber(number) {
  const parts = [];
  for (let i = 0; i < number.length; i += 4) {
    parts.push(number.substring(i, i + 4));
  }
  return parts.join("-");
}

const dirPath = "./data";
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath);
}

const dataPath = "./data/contacts.json";
if (!fs.existsSync(dataPath)) {
  fs.writeFileSync(dataPath, "[]", "utf-8");
} else {
  const fileContent = fs.readFileSync(dataPath, "utf-8");
  if (fileContent.trim() === "") {
    fs.writeFileSync(dataPath, "[]", "utf-8");
  }
}

// function checkSameData(name, number) {
//   try {
//     const contactsData = JSON.parse(fs.readFileSync(dataPath));
//     for (const contact of contactsData) {
//       if (contact.name === name) {
//         console.log(`Name ${name} already exist`);
//         return true;
//       }
//       if (contact.number === number) {
//         console.log(`Number ${number} already exist`);
//         return true;
//       }
//     }
//     return false;
//   } catch (er) {
//     console.error(er);
//     return false;
//   }
// }

// rl.question("Add Contact Name : ", (name) => {
//   if (name === "") {
//     console.log(`Name Cannot Be Empty`);
//     rl.close();
//   } else {
//     rl.question("What is Phone Number : ", (number) => {
//       if (number.length <= 10) {
//         console.log("Wrong Format Number");
//         rl.close();
//       } else {
//         number = number.replace(/-/g, "");

//         const formattedNumber = formattedPhoneNumber(number);
//         if (checkSameData(name, formattedNumber)) {
//           rl.close();
//           return;
//         } else {
//           console.log(
//             `Your Add Contact ${name}, Phone Number is ${formattedNumber}`
//           );
//         }

//         rl.question("This Is Corret Number? (y/n)", (answer) => {
//           if (answer.toLowerCase() === "y") {
//             try {
//               let contactsData = [];
//               try {
//                 contactsData = JSON.parse(
//                   fs.readFileSync("data/contacts.json")
//                 );
//               } catch (er) {
//                 console.log(
//                   "File not found or empty. Initializing empty contacts."
//                 );
//               }

//               contactsData.push({
//                 name: name,
//                 number: formattedNumber,
//               });
//               fs.writeFileSync(
//                 "data/contacts.json",
//                 JSON.stringify(contactsData)
//               );
//               console.log(`Contact Succesfully added`);
//               rl.close();
//             } catch (er) {
//               console.log(er);
//             }
//           } else if (answer.toLowerCase() === "n") {
//             rl.question("Enter The Correct Phone Number : ", (newNumber) => {
//               const formattedNewNumber = formattedPhoneNumber(number);
//               if (checkSameData(name, formattedNewNumber)) {
//                 rl.close();
//                 return;
//               } else {
//                 console.log(
//                   `Your Add Contact ${name}, Phone Number is ${formattedNewNumber}`
//                 );
//               }

//               try {
//                 let contactsData = [];
//                 try {
//                   contactsData = JSON.parse(
//                     fs.readFileSync("data/contacts.json")
//                   );
//                 } catch (er) {
//                   console.log(
//                     "File not found or empty. Initializing empty contacts."
//                   );
//                 }

//                 contactsData.push({
//                   name: name,
//                   number: newNumber,
//                 });
//                 fs.writeFileSync(
//                   "data/contacts.json",
//                   JSON.stringify(contactsData)
//                 );
//                 console.log(`Contact Succesfully added`);
//                 rl.close();
//               } catch (er) {
//                 console.log(er);
//               }
//             });
//           } else {
//             console.log(`Invalid input please enter 'y' or 'n'`);
//             rl.close();
//           }
//         });
//       }
//     });
//   }
// });

const askName = () => {
  return new Promise((resolve, reject) => {
    rl.question("Add Contact Name : ", (name) => {
      const contactsData = JSON.parse(fs.readFileSync(dataPath));
      for (const contact of contactsData) {
        if (name === contact.name) {
          console.log(`Name ${name} already exist`);
          ValidationName().then(resolve);
          return;
        } else if (name === "") {
          console.log(`Name Cannot Be Empty`);
        }
      }
      resolve(name);
    });
  });
};

const askNumber = () => {
  return new Promise((resolve, reject) => {
    rl.question("What is Phone Number : ", (number) => {
      number = number.toString();

      const contactsData = JSON.parse(fs.readFileSync(dataPath));
      for (const contact of contactsData) {
        if (number === contact.number) {
          console.log(`Number ${number} already exist`);
          validationNumber().then(resolve);
          return;
        }

        if (!validator.isMobilePhone(number, "id-ID")) {
          console.log("Wrong Format Number");
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
    rl.question("What is Email : ", (email) => {
      const contactsData = JSON.parse(fs.readFileSync(dataPath));
      for (const contact of contactsData) {
        if (email === contact.email) {
          console.log(`Email ${email} already exist`);
          validationEmail().then(resolve);
          return;
        }

        if (!validator.isEmail(email)) {
          console.log("Wrong Format Email");
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
    rl.question("Do You Want To Change Name? (y/n) : ", (answer) => {
      if (answer.toLowerCase() === "y") {
        return askName().then(resolve);
      } else if (answer.toLowerCase() === "n") {
        rl.close();
      } else {
        console.log(`Invalid Input Please Enter 'y' or 'n'`);
        return ValidationName().then(resolve);
      }
    });
  });
};

const validationNumber = () => {
  return new Promise((resolve, reject) => {
    rl.question("Do You Want To Change Number? (y/n) : ", (answer) => {
      if (answer.toLowerCase() === "y") {
        return askNumber().then(resolve);
      } else if (answer.toLowerCase() === "n") {
        rl.close();
      } else {
        console.log(`Invalid Input Please Enter 'y' or 'n'`);
        return validationNumber().then(resolve);
      }
    });
  });
};

validationEmail = () => {
  return new Promise((resolve, reject) => {
    rl.question("Do You Want To Change Email? (y/n) : ", (answer) => {
      if (answer.toLowerCase() === "y") {
        return askEmail().then(resolve);
      } else if (answer.toLowerCase() === "n") {
        rl.close();
      } else {
        console.log(`Invalid Input Please Enter 'y' or 'n'`);
        return validationEmail().then(resolve);
      }
    });
  });
};

const main = async () => {
  const name = await askName();
  const number = await askNumber();
  const email = await askEmail();

  const contactSave = { name, number, email };
  const contactsData = fs.readFileSync("data/contacts.json", "utf-8");
  const contacts = JSON.parse(contactsData);

  contacts.push(contactSave);
  fs.writeFileSync("data/contacts.json", JSON.stringify(contacts));
  rl.close();
};

main();
