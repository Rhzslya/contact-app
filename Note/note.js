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
