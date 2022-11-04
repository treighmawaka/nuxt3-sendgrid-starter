type NamePart = "first" | "last";

/**
 * Extracts the first or last name from the given full name.
 *
 * @param name 
 * @param part 
 * @returns 
 */
export function getNamePart(name: string, part: NamePart = "first") {
  const parts = name.split(" ");
  const lastName = parts.pop()
  const firstName = parts.join(" ");
  return part == "last" ? lastName : firstName;
}

/**
 * Checks if the given string is an email address.
 *
 * @param email 
 * @returns 
 */
export function isEmail(email: string) {
  let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,9}');
  return regex.test(email);
}