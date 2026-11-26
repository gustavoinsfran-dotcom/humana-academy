/* Datos de prueba: personas ficticias y estado inicial de la base simulada. */
const PERSONAS = {
  alumna:  { uid: 'alumna',  email: 'ana.perez@humanahc.com.ar',             name: 'Ana Pérez' },
  espana:  { uid: 'espana',  email: 'lucia.gomez@humanahc.com',              name: 'Lucía Gómez' },
  medico:  { uid: 'medico',  email: 'pablo.ruiz@humanahc.com.ar',            name: 'Pablo Ruiz', escuela: 'medicos' },
  cuidadora:{ uid: 'cuidadora', email: 'marta.diaz@humanahc.com.ar',         name: 'Marta Díaz', escuela: 'cuidadores' },
  editora: { uid: 'karina',  email: 'k.ojanguren@humanahc.com',              name: 'Karina Ojanguren' },
  admin:   { uid: 'gus',     email: 'gustavo.insfran@infinitypharma.com.ar', name: 'Gustavo Insfran' }
};

function estado(quien, dbExtra) {
  const db = {};
  Object.values(PERSONAS).forEach(p => {
    const d = { email: p.email, name: p.name, scores: {} };
    if (p.escuela) d.escuela = p.escuela;
    db['users/' + p.uid] = d;
  });
  Object.assign(db, dbExtra || {});
  const cuentas = {};
  Object.values(PERSONAS).forEach(p => { cuentas[p.email] = { uid: p.uid, pass: 'clave-prueba' }; });
  const p = quien ? PERSONAS[quien] : null;
  return { user: p ? { uid: p.uid, email: p.email } : null, db, cuentas };
}

module.exports = { PERSONAS, estado };
