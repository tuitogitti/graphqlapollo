/* Apollo-kirjaston avulla rakennettu yksinkertainen GraphQL-serveri.

Data on tiedostossa data.js. Tietokantaa ei ole käytetty, jotta esimerkkiä
olisi helpompi kokeilla.

GraphQL-serverin osat ovat:
1) GraphQL-skeema, joka kuvaa datan ja kyselyt jotka voidaan siihen kohdistaa.
2) Resolver-funktiot, joilla suoritetaan toimenpiteet
3) Serveriolio, joka luodaan skeemasta ja resolvereista

Kun GraphQL-serverille lähetetään kysely, ensin se validoidaan vertaamalla sitä
skeemaan. Oikean muotoinen kysely voidaan suorittaa. Kysely suoritetaan kutsumalla
resolver-funktiota.

Kyselyitä voi testata Apollo clientin avulla ilman oikeaa asiakassovellusta. 
Client avautuu kun menet selaimella osoitteeseen localhost:4000 

Voit kokeilla esim. seuraavia kyselyitä copy pastettamalla (CTLR-C, CTLR-V)
kyselyt Apollo clienttiin:

  // Hae nimi id:n perusteella
 
  {
    getStudentById(id: 1) {
        name
    }
  }

  // Hae nimi ja arvosanat id:n perusteella
  
  {
    getStudentById(id: 1) {
        name
        grades {
            coursecode
            grade
        }
    }
  }

  // Hae nimet ja opintopisteet opintopistemäärän perusteella
  
  {
    getStudentsBySp(studypoints: 0) {
      name
      studypoints
  }
}

// Lisää opiskelija ja palauta nimi

mutation {
    addStudent(input: {
      id: 5, 
      studentcode: "t1234", 
      name: "Testi Opiskelija", 
      email: "t1234@jamk.fi", 
      studypoints: 0, 
      grades: [{coursecode: "HTS106002", grade: 0}]
      })
  {
    name
  }
}

// Päivitä opiskelija ja palauta nimi

mutation {
  updateStudent(id: 4, input: {
      id: 4, 
      studentcode: "m1234", 
      name: "Mauno Opiskelija", 
      email: "m1234@jamk.fi", 
      studypoints: 5, 
      grades: [{coursecode: "HTS10600", grade: 3}]
      }) 
  {
    name
  }
}
*/
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { students } from "./data.js";

/* 1) GraphQL-skeema, joka kuvaa datan ja kyselyt, jotka voidaan siihen kohdistaa.
skeeman pitää olla aina typeDefs-nimisessä muuttujassa 
*/
const typeDefs = `
type Query {
  getStudents: [Student]
  getStudentById(id: Int!): Student
  getStudentsBySp(studypoints: Int): [Student]
},
type Mutation {
  addStudent(input: StudentInput): Student
  updateStudent(id: Int!, input: StudentInput): Student
  deleteStudent(id: Int!): String
},
input GradeInput {
  coursecode: String
  grade: Int
}
input StudentInput {
    id: Int,
    studentcode: String, 
    name: String, 
    email: String, 
    studypoints: Int, 
    grades: [GradeInput]
},
type Grade {
  coursecode: String
  grade: Int
}
type Student {
  id: Int
  studentcode: String
  name: String
  email: String
  studypoints: Int
  grades: [Grade]
}
`;

/* 2) Resolver-funktiot, joita käytetään toimenpiteiden suorittamiseen.
   Toimenpiteet kohdistetaan tässä tiedostoon, mutta normaalisti funktioissa
   olisivat tietokantakyselyt. Ne voisivat olla omassa tiedostossaan, joka
   importattaisiin tähän tiedostoon.
*/
const resolvers = {
  Query: {
    getStudents: () => students,
    /* Apollon metodeissa on _ -argumentti pakollisena ennen muita argumentteja,
       jotka ovat aaltosulkujen sisällä */
    getStudentById: (_, { id }) =>
      students.find((student) => student.id === id),
    getStudentsBySp: (_, { studypoints }) => {
      if (studypoints !== null) {
        // hakee opiskelijat joiden op-määrä on <= annettu luku
        return students.filter((student) => student.studypoints <= studypoints);
      } else {
        return students;
      }
    },
  },
  Mutation: {
    updateStudent: (_, { id, input }) => { 
      const index = students.findIndex((student) => student.id === id);
      if (index === -1) {
        throw new Error("Opiskelijaa ei ole");
      }    
      students[id - 1] = input; // päivittää koko opiskelijan
      return students[id - 1]; //palauttaa muokatun opiskelijan
    },
    deleteStudent: (_, { id }) => {
      const index = students.findIndex((student) => student.id === id);
      if (index === -1) {
        throw new Error("Opiskelijaa ei ole");
      }
      students.splice(index, 1);
      return "Opiskelija poistettu";
    },
    addStudent: (_, { input }) => {
      students.push(input);
      return students[students.length - 1]; //palauttaa lisätyn opiskelijan
    },
  },
};

// 3) Serveriolio, joka luodaan skeemasta ja resolvereista
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});
console.log(`GraphQL-serveri osoitteessa ${url}`);