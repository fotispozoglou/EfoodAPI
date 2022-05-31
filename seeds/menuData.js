const SAUCE = 0;
const SINOD = 1;
const LAXAN = 2;
const ALLNT = 3;
const SYNTI = 4;

const OREKT = 0;
const ALOIF = 1;
const SALAT = 2;
const TEMAX = 3;
const TYLXT = 4;
const SANCH = 5;
const SKEPA = 6;
const MERID = 7;
const BRGRS = 8;
const ANAPS = 9;

const baseUrl = ``;

const Product = function( name, price, description, tiers, category, quantity, minQuantity ) {

  randomNumber = Math.floor( Math.random() * 100 );

  const available = !(randomNumber >= 60 && randomNumber <= 72);

  return { name, price, description, tiers, category, quantity, minQuantity, available };

}

module.exports.products = [
  [
    Product( 'Πατάτες τηγανητές',  2.5,  '',  [ SAUCE ],  OREKT,  1, 1 ),
    Product( 'Πατάτες τηγανητές με gouda',  3,  '',  [ SAUCE ],  OREKT,  1, 1 ),
    Product( 'Φέτα',  2.5,  '',  [  ],  OREKT,  1, 1 ),
    Product( 'Φέτα ψητή',  3,  '',  [  ],  OREKT,  1, 1 ),
    Product( 'Κασεροκροκέτες',  3,  '',  [ SAUCE ],  OREKT,  1, 1 ),
    Product( 'Φλογέρες με ζαμπόν & gouda',  3,  '',  [ SAUCE ],  OREKT,  1, 1 ),
    Product( 'Κοτομπουκιές',  3,  '',  [ SAUCE ],  OREKT,  1, 1 ),
    Product( 'Πίτα παραδοσιακή σκέτη',  0.2,  '',  [ SAUCE ],  OREKT,  1, 1 )
  ],
  [
    Product( 'Ketchup',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Μουστάρδα',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Σως γιαουρτιού',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Τζατζίκι',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'BBQ σως',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Σως μουστάρδας',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Σως σεφ',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Ουγγαρέζα',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Τυροκαυτερή',  2.5,  '',  [  ],  ALOIF,  1, 1 ),
    Product( 'Χτυπητή',  2.5,  '',  [  ],  ALOIF,  1, 1 )
  ],
  [
    Product( 'Αγγουροντομάτα',  3.5,  '',  [  ],  SALAT,  1, 1 ),
    Product( 'Μαρούλι',  3,  '',  [  ],  SALAT,  1, 1 ),
    Product( 'Σεφ',  4.5,  '',  [  ],  SALAT,  1, 1 ),
    Product( 'Caesar`s',  5,  '',  [  ],  SALAT,  1, 1, 'ceasers.jpg' ),
    Product( 'Χωριάτικη',  5,  '',  [  ],  SALAT,  1, 1 )
  ],
  [
    Product( 'Σουβλάκι χοιρινό',  1.7,  '',  [ SAUCE ],  TEMAX,  1, 1 ),
    Product( 'Σουβλάκι κοτόπουλο',  1.7,  '',  [ SAUCE ],  TEMAX,  1, 1 ),
    Product( 'Σουβλάκι πρόβειο',  1.9,  '',  [ SAUCE ],  TEMAX,  1, 1 ),
    Product( 'Λουκάνικο χωριάτικο',  1.7,  '',  [ SAUCE ],  TEMAX,  1, 1 ),
    Product( 'Κεμπάπ',  1.7,  '',  [ SAUCE ],  TEMAX,  1, 1 ),
    Product( 'Μπιφτέκι μοσχαρίσιο',  1.7,  '',  [ SAUCE ],  TEMAX,  1, 1 ),
    Product( 'Μπιφτέκι κοτόπουλο',  1.7,  '',  [ SAUCE ],  TEMAX,  1, 1 )
  ],
  [
    Product( 'Γύρος χοιρινός σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Γύρος κοτόπουλο σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Σουβλάκι χοιρινό σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Σουβλάκι κοτόπουλο σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Λουκάνικο χωριάτικο σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Μπιφτέκι μοσχαρίσιο σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Μπιφτέκι κοτόπουλο σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Κεμπάπ σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Οικολογικό σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 ),
    Product( 'Κολοκυθοκεφτέδες σε πίτα',  2.7,  '',  [ SAUCE, LAXAN ],  TYLXT,  1, 1 )
  ],
  [
    Product( 'Γύρος χοιρινός σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Γύρος κοτόπουλο σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Σουβλάκι χοιρινό σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Σουβλάκι κοτόπουλο σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Λουκάνικο χωριάτικο σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Μπιφτέκι μοσχαρίσιο σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Μπιφτέκι κοτόπουλο σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Κεμπάπ σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Οικολογικό σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 ),
    Product( 'Καλαμάρι σε σάντουιτς',  3.2,  '',  [ SAUCE, LAXAN ],  SANCH,  1, 1 )
  ],
  [
    Product( 'Σκεπαστή γύρος χοιρινός',  4.5,  '',  [ SAUCE, LAXAN ],  SKEPA,  1, 1 ),
    Product( 'Σκεπαστή γύρος κοτόπουλο',  4.5,  '',  [ SAUCE, LAXAN ],  SKEPA,  1, 1 )
  ],
  [
    Product( 'Γύρος χοιρινός μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Γύρος κοτόπουλο μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Σουβλάκι χοιρινό μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Σουβλάκι κοτόπουλο μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Λουκάνικο χωριάτικο μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Μπιφτέκι μοσχαρίσιο μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Μπιφτέκι κοτόπουλο μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Κεμπάπ μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product( 'Μπριζόλα χοιρινή μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 ),
    Product(  'Πανσέτα χοιρινή μερίδα',  6.9,  '',  [ SAUCE ],  MERID,  1, 1 )
  ],
  [
    Product( 'Club sandwich κλασικό',  4,  '',  [ SAUCE, LAXAN ],  BRGRS,  1, 1 ),
    Product( 'Club sandwich κοτόπουλο',  4.5,  '',  [ SAUCE, LAXAN ],  BRGRS,  1, 1 )
  ],
  [
    Product( 'Coca-Cola 330ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Coca-Cola light 330ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Coca-Cola zero 330ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Fanta κόκκινη 330ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Fanta λεμόνι 330ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Sprite 330ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Σόδα Tuborg 330ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Coca-Cola 500ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Coca-Cola light 500ml',  1.2,  '',  [  ],  ANAPS,  1, 1 ),
    Product( 'Coca-Cola zero 500ml',  1.2,  '',  [  ],  ANAPS,  1, 1 )
  ]
];

module.exports.categories = [
  { name: 'Ορεκτικά', items: [] },
  { name: 'Αλοιφές', items: [] },
  { name: 'Σαλάτες', items: [] },
  { name: 'Τεμάχια', items: [] },
  { name: 'Τυλιχτά', items: [] },
  { name: 'Σάντουιτς', items: [] },
  { name: 'Σκεπαστές', items: [] },
  { name: 'Μερίδες', items: [] },
  { name: 'Burgers', items: [] },
  { name: 'Αναψυκτικά', items: [] }
];

module.exports.ingredients = [
  [
    { name: 'Ketchup', price: 0.5, description: '' },
    { name: 'Μουστάρδα', price: 0.5, description: '' },
    { name: 'Σως γιαουρτιού', price: 0.5, description: '' },
    { name: 'Τζατζίκι', price: 0.5, description: '' },
    { name: 'BBQ σως', price: 0.5, description: '' },
    { name: 'Σως μουστάρδας', price: 0.5, description: '' },
    { name: 'Σως σεφ', price: 0.5, description: '' },
    { name: 'Ουγγαρέζα', price: 0.5, description: '' },
    { name: 'Τυροκαυτερή', price: 0.5, description: '' },
    { name: 'Χτυπητή', price: 0.5, description: '' }
  ],
  [
    { name: 'Πατάτες τηγανητές', price: 1, shortage: false }
  ],
  [
    { name: 'Ντομάτα', price: 0.2, shortage: false },
    { name: 'Κρεμύδι', price: 0.2, shortage: false },
    { name: 'Μαρούλι', price: 0.2, shortage: false },
    { name: 'Αγγουράκι', price: 0.2, shortage: false },
    { name: 'Λάχανο', price: 0.2, shortage: false }
  ],
  [
    { name: 'Γαλοπούλα', price: 0.4, shortage: false },
    { name: 'Κασέρι', price: 0.2, shortage: false },
    { name: 'Μπέικον', price: 0.5, shortage: false }
  ],
  [
    { name: 'Παγάκια', price: 0, shortage: false }
  ]
];

module.exports.tiers = [
  { name: 'Sauce', ingredients: [ SAUCE ], selectedIngredients: [  ], maxSelections: 2, minSelections: 0, type: "checkbox" },
  { name: 'Συνοδευτικά', ingredients: [ SINOD ], selectedIngredients: [  ], maxSelections: 1, minSelections: 0, type: "checkbox" },
  { name: 'Λαχανικά', ingredients: [ LAXAN ], selectedIngredients: [  ], maxSelections: 5, minSelections: 0, type: "checkbox" },
  { name: 'Αλλαντικά', ingredients: [ ALLNT ], selectedIngredients: [  ], maxSelections: 3, minSelections: 0, type: "checkbox" },
  { name: 'Συντήρηση', ingredients: [ SYNTI ], selectedIngredients: [  ], maxSelections: 1, minSelections: 0, type: "checkbox" }
];