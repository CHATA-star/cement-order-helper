
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anonymous key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if required configuration is available
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing. Using a mock client.');
}

// Create and export the Supabase client
// If configuration is missing, we'll use dummy values and handle operations gracefully
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createMockSupabaseClient();

// Mock Supabase client that doesn't cause errors but logs operations
function createMockSupabaseClient() {
  const mockOperations = (operationName: string) => ({
    select: () => mockOperations(`${operationName}.select`),
    insert: () => mockOperations(`${operationName}.insert`),
    update: () => mockOperations(`${operationName}.update`),
    delete: () => mockOperations(`${operationName}.delete`),
    eq: () => mockOperations(`${operationName}.eq`),
    neq: () => mockOperations(`${operationName}.neq`),
    order: () => mockOperations(`${operationName}.order`),
    single: () => mockOperations(`${operationName}.single`),
    then: (callback: Function) => {
      console.warn(`Mock Supabase operation: ${operationName} - would execute in real environment`);
      return Promise.resolve(callback({ data: [], error: null }));
    }
  });

  return {
    from: (table: string) => {
      console.warn(`Mock Supabase: operation on table '${table}'. Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for real functionality.`);
      return mockOperations(`from(${table})`);
    },
    // Add other methods as needed
    auth: {
      signIn: () => {
        console.warn('Mock Supabase: signIn operation would execute in real environment');
        return Promise.resolve({ data: null, error: null });
      },
      signOut: () => {
        console.warn('Mock Supabase: signOut operation would execute in real environment');
        return Promise.resolve({ error: null });
      }
    }
  } as any;
}
