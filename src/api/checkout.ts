export const processPayment = async (reservationId: string, paymentDetails: any) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simulate successful payment
  if (paymentDetails.cardNumber === '0000 0000 0000 0000') {
    // throw new Error('Tarjeta rechazada');
  }

  return {
    success: true,
    data: {
      purchaseId: Math.random().toString(36).substr(2, 9).toUpperCase(),
      status: 'completed',
      timestamp: new Date().toISOString()
    }
  };
};
