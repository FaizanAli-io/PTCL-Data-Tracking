export const isValidPhone = (val: string) => /^03\d{9}$/.test(val);

export const isValidPSTN = (val: string) => val === "" || /^021\d{8}$/.test(val);
