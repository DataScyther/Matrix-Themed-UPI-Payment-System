<!DOCTYPE html>
<html>
<head>
  <style>
  /* Adjust QR code canvas size */
  #qrcode {
    max-width: 200px;
    max-height: 200px;
    margin: 0 auto;
  }

  #qrcode canvas {
    width: 100% !important;
    height: auto !important;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  </style>
</head>
<body>

<script>
  const VALID_UPI_HANDLES = {
    'okaxis': 'Axis Bank',
    'okhdfcbank': 'HDFC Bank',
    'okicici': 'ICICI Bank',
    'oksbi': 'State Bank of India',
    'hdfc': 'HDFC Bank',
    'sbi': 'State Bank of India',
    'ybl': 'Yes Bank',
    'paytm': 'Paytm Payments Bank',
    'apl': 'Amazon Pay',
    'gpay': 'Google Pay',
    'axl': 'Axis Bank',
    'ibl': 'ICICI Bank',
    'ptyes': 'Yes Bank',
    'phonepe': 'PhonePe',
    'ptaxis': 'Axis Bank'
  };

  function validateUPIIdRealTime(upiId) {
    const input = document.getElementById('upiId');
    const feedback = document.getElementById('upiIdFeedback');
    
    // Clear previous styling
    input.classList.remove('valid-upi', 'invalid-upi');
    feedback.classList.remove('show', 'error');
    
    if (!upiId) {
      feedback.textContent = 'Please enter a UPI ID';
      feedback.classList.add('show', 'error');
      return false;
    }

    const [username, handle] = upiId.split('@');
    
    if (!handle) {
      feedback.textContent = 'UPI ID must contain @ symbol';
      feedback.classList.add('show', 'error');
      input.classList.add('invalid-upi');
      return false;
    }

    // Check username format
    if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
      feedback.textContent = 'Username can only contain letters, numbers, dots, underscores, and hyphens';
      feedback.classList.add('show', 'error');
      input.classList.add('invalid-upi');
      return false;
    }

    // Check if it's a phone number format
    if (/^\d{10}$/.test(username)) {
      const bankHandle = handle.toLowerCase();
      const validBank = Object.keys(VALID_UPI_HANDLES).find(h => bankHandle.includes(h));
      
      if (validBank) {
        feedback.textContent = `Valid UPI ID for ${VALID_UPI_HANDLES[validBank]}`;
        feedback.classList.add('show');
        input.classList.add('valid-upi');
        return true;
      }
    }

    // Check regular UPI ID format
    const bankHandle = handle.toLowerCase();
    const validBank = Object.keys(VALID_UPI_HANDLES).find(h => bankHandle.includes(h));
    
    if (!validBank) {
      feedback.textContent = 'Invalid bank handle. Please use a registered UPI bank handle';
      feedback.classList.add('show', 'error');
      input.classList.add('invalid-upi');
      return false;
    }

    feedback.textContent = `Valid UPI ID for ${VALID_UPI_HANDLES[validBank]}`;
    feedback.classList.add('show');
    input.classList.add('valid-upi');
    return true;
  }

  function validateUPIId(upiId) {
    return validateUPIIdRealTime(upiId);
  }

  async function generateQRCode() {
    const upiId = document.getElementById('upiId').value.trim();
    const recipientName = document.getElementById('recipientName').value.trim();
    const amount = document.getElementById('amount').value.trim();
    const message = document.getElementById('message').value.trim();
    
    const qrcodeContainer = document.getElementById('qrcode');
    qrcodeContainer.innerHTML = "";
    qrcodeContainer.classList.remove('show');
    
    if(!upiId || !recipientName) {
      speak("Please enter UPI ID and Recipient Name");
      return;
    }
    
    if (!validateUPIId(upiId)) {
      // The error message will be shown by the validateUPIId function
      speak("Invalid UPI ID. Please try again");
      return;
    }
    
    if(amount && (isNaN(amount) || amount < 0)) {
      speak("Please enter a valid amount");
      return;
    }

    const upiURL = `upi://pay?pa=${upiId}&pn=${recipientName}${amount ? `&am=${amount}` : ''}&cu=INR${message ? `&tn=${message}` : ''}`;
    
    try {
      new QRCode(qrcodeContainer, {
        text: upiURL,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
      });
      
      qrcodeContainer.classList.add('show');
      speak("QR code generation is successful");
    } catch(error) {
      console.error("QR Code generation failed:", error);
    }
  }
</script>
</body>
</html>

<script>
  function toggleDarkMode() {
    document.documentElement.setAttribute('data-theme', 
      document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
    );
  }
</script>

<script>
  function enhancedValidation() {
    const amount = document.getElementById('amount').value;
    
    // Add maximum amount limit
    if (amount > 100000) {
      speak("Amount exceeds maximum limit of ₹1,00,000");
      return false;
    }
    
    // Add minimum amount validation
    if (amount < 1) {
      speak("Amount should be at least ₹1");
      return false;
    }
    
    return true;
  }
</script>

<script>
  function generateCustomQR(options) {
    const qrOptions = {
      text: options.upiURL,
      width: options.size || 200,
      height: options.size || 200,
      colorDark: options.foreground || "#000000",
      colorLight: options.background || "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    };

    if (options.logo) {
      qrOptions.logo = options.logo;
      qrOptions.logoWidth = options.logoWidth;
      qrOptions.logoHeight = options.logoHeight;
    }

    try {
      new QRCode(document.getElementById("qrcode"), qrOptions);
    } catch (error) {
      console.error("QR Code generation failed:", error);
      speak("Failed to generate QR Code. Please try again.");
    }
  }
</script>