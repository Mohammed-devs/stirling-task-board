export {};

declare global {
  interface Env {
        DB: any; // <-- ADD THIS LINE
    // If your worker uses environment variables or bindings (like KV, D1),
    // you would define them here. For now, an empty interface is enough
    // to fix the error.
    // Example: MY_VARIABLE: string;
  }
}
