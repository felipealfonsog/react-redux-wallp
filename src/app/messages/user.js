const userMessages = {
  login: {
    error: {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña Invalida',
      'auth/invalid-email': 'El email tiene un formato invalido',
    },
  },
  register: {
    error: {
      'auth/email-already-in-use': 'El correo electronico que ha introducido, ya esta siendo usado',
      'auth/invalid-email': 'Formato de correo electronico incorrecto',
      'auth/weak-password': 'La contraseña es muy debil, por favor, ingrese una nueva',
    },
  },
};

export default userMessages;
