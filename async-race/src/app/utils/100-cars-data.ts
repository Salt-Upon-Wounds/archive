const names: { [name: string]: string[] } = {
  Audi: ['A3', 'A4', 'A6', 'A7', 'A8', 'Q3', 'Q5'],
  Lada: ['Largus', 'Niva', 'Niva Legend', 'Vesta', 'Granta'],
  Skoda: ['Citigo', 'Rapid', 'Octavia', 'Fabia', 'Superb', 'Kodiaq', 'Karoq'],
  Opel: ['Astra', 'Corsa', 'Mokka', 'Insignia', 'Vectra', 'Monterey'],
  Lamborghini: ['Diablo', 'Venero', 'Huracan', 'Centenario', 'Gallardo', 'Urus'],
};

// min and max included
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getName() {
  const keys = Object.keys(names);
  const randomName = keys[randomInt(0, keys.length - 1)];
  const randomModel = names[randomName][randomInt(0, names[randomName].length - 1)];
  return [randomName, randomModel].join(' ');
}

export function getColor() {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
}
