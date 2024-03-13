// Core Module
// File System

// const { create } = require("domain");
const fs = require("fs");
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

function checkSameData(name, number) {
  try {
    const contactsData = JSON.parse(fs.readFileSync("data/contacts.json"));
    for (const contact of contactsData) {
      if (contact.name === name) {
        console.log(`Name ${name} already exist`);
        return true;
      }
      if (contact.number === number) {
        console.log(`Number ${number} already exist`);
        return true;
      }
    }
    return false;
  } catch (er) {
    console.error(er);
    return false;
  }
}

rl.question("Add Contact Name : ", (name) => {
  if (name === "") {
    console.log(`Name Cannot Be Empty`);
    rl.close();
  } else {
    rl.question("What is Phone Number : ", (number) => {
      if (number.length <= 10) {
        console.log("Wrong Format Number");
        rl.close();
      } else {
        number = number.replace(/-/g, "");

        const formattedNumber = formattedPhoneNumber(number);
        if (checkSameData(name, formattedNumber)) {
          rl.close();
          return;
        } else {
          console.log(
            `Your Add Contact ${name}, Phone Number is ${formattedNumber}`
          );
        }

        rl.question("This Is Corret Number? (y/n)", (answer) => {
          if (answer.toLowerCase() === "y") {
            try {
              let contactsData = [];
              try {
                contactsData = JSON.parse(
                  fs.readFileSync("data/contacts.json")
                );
              } catch (er) {
                console.log(
                  "File not found or empty. Initializing empty contacts."
                );
              }

              contactsData.push({
                name: name,
                number: formattedNumber,
              });
              fs.writeFileSync(
                "data/contacts.json",
                JSON.stringify(contactsData)
              );
              console.log(`Contact Succesfully added`);
              rl.close();
            } catch (er) {
              console.log(er);
            }
          } else if (answer.toLowerCase() === "n") {
            rl.question("Enter The Correct Phone Number : ", (newNumber) => {
              const formattedNewNumber = formattedPhoneNumber(number);
              if (checkSameData(name, formattedNewNumber)) {
                rl.close();
                return;
              } else {
                console.log(
                  `Your Add Contact ${name}, Phone Number is ${formattedNewNumber}`
                );
              }

              try {
                let contactsData = [];
                try {
                  contactsData = JSON.parse(
                    fs.readFileSync("data/contacts.json")
                  );
                } catch (er) {
                  console.log(
                    "File not found or empty. Initializing empty contacts."
                  );
                }

                contactsData.push({
                  name: name,
                  number: newNumber,
                });
                fs.writeFileSync(
                  "data/contacts.json",
                  JSON.stringify(contactsData)
                );
                console.log(`Contact Succesfully added`);
                rl.close();
              } catch (er) {
                console.log(er);
              }
            });
          } else {
            console.log(`Invalid input please enter 'y' or 'n'`);
            rl.close();
          }
        });
      }
    });
  }
});
