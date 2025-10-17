/**
 * Text formatting utilities for improved readability and wrapping
 */

/**
 * Adds zero-width spaces after commas to allow natural line breaks
 * This helps addresses wrap more cleanly without changing visual appearance
 * @param address - The address string to format
 * @returns Address with zero-width spaces for better wrapping
 */
export function formatAddressForWrap(address: string): string {
  // Allow natural line breaks right after commas (no visible change)
  return address.replaceAll(",", ",\u200B");
}

