// Test MSG91 with GET method (alternative approach)
const https = require('https');

async function testMSG91GET() {
  const authKey = '473977AMhCluCy68f1908cP1';
  const phoneNumber = '7010766135';
  const message = encodeURIComponent('🎊 AFIFA & REHAN - Test! 🎊 Testing MSG91 for wedding SMS. afifaziya.com');
  
  console.log('📱 Testing MSG91 with GET method');
  console.log('Auth Key:', authKey);
  console.log('Phone:', phoneNumber);
  console.log('\n📤 Trying GET method...');
  
  // Build GET URL
  const getPath = `/api/sendhttp.php?authkey=${authKey}&mobiles=${phoneNumber}&message=${message}&sender=MSGIND&route=4&country=91`;
  
  const getOptions = {
    method: 'GET',
    hostname: 'control.msg91.com',
    port: null,
    path: getPath,
    headers: {
      'accept': 'application/json'
    }
  };
  
  console.log('URL:', `https://control.msg91.com${getPath}`);
  
  return new Promise((resolve, reject) => {
    const req = https.request(getOptions, (res) => {
      const chunks = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const response = body.toString();
        
        console.log('Status Code:', res.statusCode);
        console.log('Response:', response);
        
        if (response.includes('Authentication failure')) {
          console.log('\n❌ Authentication Failed');
          console.log('🔧 Possible solutions:');
          console.log('1. Verify auth key from MSG91 dashboard');
          console.log('2. Check if account needs verification');
          console.log('3. Try using different endpoint');
          console.log('4. Contact MSG91 support');
        } else if (response.includes('success') || response.includes('sent')) {
          console.log('\n✅ SMS sent successfully!');
        } else {
          console.log('\n⚠️ Unexpected response:', response);
        }
        
        resolve(response);
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Request Error:', error);
      reject(error);
    });
    
    req.end();
  });
}

async function checkMSG91Status() {
  console.log('🔍 MSG91 Account Diagnostics\n');
  
  try {
    await testMSG91GET();
    
    console.log('\n📋 Next Steps:');
    console.log('1. Login to https://control.msg91.com/');
    console.log('2. Verify your account status');
    console.log('3. Check if auth key is correct');
    console.log('4. Ensure account has credits');
    console.log('5. Verify sender ID is approved');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

checkMSG91Status();