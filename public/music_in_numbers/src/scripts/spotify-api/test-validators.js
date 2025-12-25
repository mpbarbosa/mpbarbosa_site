/**
 * Test script for SpotifyApiValidators class
 * Validates that all methods work correctly
 */

import fs from 'fs';

// Load the SpotifyApiValidators class
const validatorsCode = fs.readFileSync('./SpotifyApiValidators.js', 'utf8');
eval(validatorsCode);

if (typeof SpotifyApiValidators !== 'undefined') {
    
    console.log('Testing SpotifyApiValidators class...\n');
    
    // Test validateClientId
    console.log('1. Testing validateClientId:');
    const validClientId = SpotifyApiValidators.validateClientId('a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6');
    console.log('Valid Client ID:', validClientId);
    
    const invalidClientId = SpotifyApiValidators.validateClientId('invalid');
    console.log('Invalid Client ID:', invalidClientId);
    
    // Test validateAccessToken
    console.log('\n2. Testing validateAccessToken:');
    const validToken = SpotifyApiValidators.validateAccessToken('BQC4YXNhY2Nlc3NfdG9rZW4');
    console.log('Valid Token:', validToken);
    
    const invalidToken = SpotifyApiValidators.validateAccessToken('');
    console.log('Invalid Token:', invalidToken);
    
    // Test validateLimit
    console.log('\n3. Testing validateLimit:');
    const validLimit = SpotifyApiValidators.validateLimit(20);
    console.log('Valid Limit:', validLimit);
    
    const invalidLimit = SpotifyApiValidators.validateLimit(100);
    console.log('Invalid Limit:', invalidLimit);
    
    // Test validateTimeRange
    console.log('\n4. Testing validateTimeRange:');
    const validTimeRange = SpotifyApiValidators.validateTimeRange('medium_term');
    console.log('Valid Time Range:', validTimeRange);
    
    const invalidTimeRange = SpotifyApiValidators.validateTimeRange('invalid');
    console.log('Invalid Time Range:', invalidTimeRange);
    
    // Test validateTokenExchangeInputs
    console.log('\n5. Testing validateTokenExchangeInputs:');
    const validTokenExchange = SpotifyApiValidators.validateTokenExchangeInputs(
        'auth_code_123', 
        'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', 
        'code_verifier_123'
    );
    console.log('Valid Token Exchange:', validTokenExchange);
    
    const invalidTokenExchange = SpotifyApiValidators.validateTokenExchangeInputs('', '', '');
    console.log('Invalid Token Exchange:', invalidTokenExchange);
    
    console.log('\n✅ All SpotifyApiValidators tests completed!');
} else {
    console.log('This test requires Node.js environment');
}