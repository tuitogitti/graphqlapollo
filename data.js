/*
Data on tässä tiedostossa, koska haluamme kokeilla esimerkkiä
mahdollisimman helposti. Yleensä data on tietokannassa.
*/
export const students = [
    { 
      id: 1,
      studentcode: 'o1234',
      name: 'Ossi Opiskelija',
      email: 'o1234@jamk.fi',
      studypoints: 10,
      grades: [
        {
          coursecode: 'HTS10700',
          grade: 2,
        },
        {
          coursecode: 'HTS10600',
          grade: 4,
        }
      ]
    },
    {
      id: 2,
      studentcode: 'a1234',
      name: 'Assi Opiskelija',
      email: 'a1234@jamk.fi',
      studypoints: 5,
      grades: [
        {
          coursecode: 'HTS10600',
          grade: 3,
        },
      ],
    },
    {
      id: 3,
      studentcode: 'u1234',
      name: 'Uuno Opiskelija',
      email: 'u1234@jamk.fi',
      studypoints: 0,
      grades: [
        {
          coursecode: 'HTS10700',
          grade: 0,
        },
      ],
    },
    {
      id: 4,
      studentcode: 'm1234',
      name: 'Mauno Opiskelija',
      email: 'm1234@jamk.fi',
      studypoints: 0,
      grades: [
        {
          coursecode: 'HTS10600',
          grade: 0,
        },
      ],
    }
  ];