import bcrypt from 'bcryptjs';

const password = '123456';

bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error('Error al generar el hash:', err);
    return;
  }
  console.log('Hash generado para la contraseña:', password);
  console.log(hash);
});
