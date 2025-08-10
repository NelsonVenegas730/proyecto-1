function getInitials(name, last_names) {
  const nameInitial = name.trim().charAt(0).toUpperCase() || '';
  const lastNameInitial = last_names.trim().charAt(0).toUpperCase() || '';
  return nameInitial + lastNameInitial;
}

module.exports = { getInitials };