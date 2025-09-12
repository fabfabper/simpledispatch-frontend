// Utility function from shadcn/ui for conditional class names
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}
