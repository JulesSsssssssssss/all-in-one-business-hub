/**
 * Script de test pour les endpoints d'authentification Better Auth
 * Usage: ts-node test-auth-endpoints.ts
 */

async function testAuthEndpoints() {
  const BASE_URL = 'http://localhost:5000';
  
  console.log('\n=== Test 1: Health Check ===');
  try {
    const response = await fetch(`${BASE_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ Erreur:', error);
  }

  console.log('\n=== Test 2: Sign Up (Inscription) ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-up/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test1234',
        name: 'Test User',
      }),
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    // Sauvegarder les cookies pour le prochain test
    const cookies = response.headers.get('set-cookie');
    console.log('Cookies:', cookies);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }

  console.log('\n=== Test 3: Sign In (Connexion) ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/sign-in/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Test1234',
      }),
    });
    
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    const cookies = response.headers.get('set-cookie');
    console.log('Cookies:', cookies);
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }

  console.log('\n=== Test 4: Get Session ===');
  try {
    const response = await fetch(`${BASE_URL}/api/auth/get-session`, {
      method: 'GET',
      credentials: 'include',
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }

  console.log('\n=== Tests terminés ===\n');
}

// Exécuter les tests
testAuthEndpoints().catch(console.error);
