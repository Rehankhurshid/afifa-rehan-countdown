// Test MSG91 SMS Sending Directly
const https = require('https');

async function testMSG91SMS() {
  const authKey = '473977AMhCluCy68f1908cP1';
  const phoneNumber = '917010766135'; // With country code
  const message = '🔥 AFIFA & REHAN - TEST MESSAGE! 🔥\n\nTesting MSG91 SMS service for wedding countdown.\n\nafifaziya.com';
  
  console.log('📱 Testing MSG91 SMS Sending');
  console.log('Phone:', phoneNumber);
  console.log('Message:', message);
  console.log('Auth Key:', authKey.substring(0, 10) + '...\n');
  
  // Try the sendhttp.php endpoint (simple SMS)
  const smsData = JSON.stringify({
    "authkey": authKey,
    "mobiles": phoneNumber,
    "message": message,
    "sender": "MSGIND",
    "route": "4",
    "country": "91"
  });
  
  const smsOptions = {
    method: 'POST',
    hostname: 'control.msg91.com',
    port: null,
    path: '/api/sendhttp.php',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'content-length': smsData.length
    }
  };
  
  console.log('📤 Sending SMS via sendhttp.php endpoint...');
  
  return new Promise((resolve, reject) => {
    const req = https.request(smsOptions, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const response = body.toString();
        
        console.log('Status Code:', res.statusCode);
        console.log('Raw Response:', response);
        
        try {
          const jsonResponse = JSON.parse(response);
          console.log('Parsed Response:', jsonResponse);
          
          if (jsonResponse.type === 'success' || response.includes('success')) {
            console.log('✅ SMS sent successfully!');
            console.log('Message ID:', jsonResponse.request_id || 'unknown');
            resolve(true);
          } else {
            console.log('❌ SMS failed:', jsonResponse.message || response);
            resolve(false);
          }
        } catch (parseError) {
          console.log('Non-JSON response:', response);
          if (response.includes('success') || response.includes('sent')) {
            console.log('✅ SMS likely sent (non-JSON success)');
            resolve(true);
          } else {
            console.log('❌ SMS failed');
            resolve(false);
          }
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request Error:', error);
      reject(error);
    });
    
    req.write(smsData);
    req.end();
  });
}

testMSG91SMS().then(success => {
  if (success) {
    console.log('\n🎉 MSG91 is working! Ready for wedding messages.');
  } else {
    console.log('\n🔧 MSG91 needs troubleshooting.');
    console.log('Possible issues:');
    console.log('• Auth key format');
    console.log('• Account balance');
    console.log('• Sender ID approval');
    console.log('• Phone number format');
  }
}).catch(console.error);