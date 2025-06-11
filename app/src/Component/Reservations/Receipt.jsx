import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Printer, FileDown, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

// Format the price with better handling of invalid values
const formatPrice = (price) => {
  // Ensure price is a number
  let numPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // If it's not a valid number, return a fallback
  if (isNaN(numPrice)) return '100.00';
  
  // If the price is in cents (e.g., 20000), convert it to the actual price (200.00)
  if (numPrice >= 1000) {
    numPrice = numPrice / 100;
  }
  
  // Format with 2 decimal places and thousand separators
  return numPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

// Helper function to extract the price
const getPrice = (data) => {
  // Try various possible field names where price might be stored
  return data.prix || data.price || 100;
};

// Helper function to get status text based on etat value
const getStatusText = (etat) => {
  switch(etat) {
    case 'reserver':
      return 'CONFIRMED';
    case 'en attente':
      return 'PARTIALLY PAID';
    case 'annuler':
      return 'CANCELLED';
    default:
      return 'PENDING';
  }
};

// Add better data inspection and logging
export default function Receipt({ isVisible, onClose, data }) {
  const receiptRef = useRef(null);
  
  // Debug data immediately
  React.useEffect(() => {
    if (data) {
      console.log('Receipt data received:', data);
      console.log('Receipt data types:', {
        num_res: typeof data.num_res,
        date: typeof data.date,
        heure: typeof data.heure,
        Name: typeof data.Name,
        id_terrain: typeof data.id_terrain,
        prix: typeof data.prix,
        advance_payment: typeof data.advance_payment
      });
    }
  }, [data]);
  
  const handlePrintReceipt = () => {
    if (receiptRef.current) {
      const originalContents = document.body.innerHTML;
      const printContents = receiptRef.current.innerHTML;
      
      document.body.innerHTML = `
        <style>
          @page { size: 80mm 150mm; margin: 0; }
          body { margin: 5mm; font-family: Arial, sans-serif; color: #000; background: #fff; }
          .receipt-header { text-align: center; margin-bottom: 5mm; }
          .receipt-header h1 { font-size: 5mm; margin: 0; }
          .receipt-header p { font-size: 3mm; margin: 1mm 0; }
          .receipt-details { font-size: 3mm; }
          .receipt-details div { margin-bottom: 2mm; }
          .receipt-footer { text-align: center; margin-top: 5mm; font-size: 3mm; }
        </style>
        <div>${printContents}</div>
      `;
      
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };
  
  const handleDownloadPDF = () => {
    if (receiptRef.current) {
      html2canvas(receiptRef.current, {
        scale: 2, // Increase quality
        logging: false,
        useCORS: true,
        allowTaint: true
      }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: [80, 150] // Receipt-sized format (80mm width)
        });
        
        const imgWidth = 70;
        const imgHeight = canvas.height * imgWidth / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 5, 5, imgWidth, imgHeight);
        pdf.save(`receipt-${data.num_res || 'reservation'}.pdf`);
      });
    }
  };
  
  // Improved ReceiptContent to handle different data formats
  const ReceiptContent = React.forwardRef(({ data }, ref) => {
    if (!data) return null;
    
    // Extract and sanitize all data
    const sanitizedData = {
      num_res: data.num_res || 'N/A',
      date: data.date || new Date().toISOString().split('T')[0],
      heure: data.heure || '00:00:00',
      Name: data.Name || 'Guest',
      terrain_name: data.terrain_name || `Terrain ${data.id_terrain || '?'}`,
      id_terrain: data.id_terrain || '?',
      prix: getPrice(data),
      advance_payment: data.advance_payment ? parseFloat(data.advance_payment) : 0,
      etat: data.etat || 'reserver'
    };
    
    // Calculate derived values
    const hasAdvancePayment = sanitizedData.advance_payment > 0;
    const remainingAmount = hasAdvancePayment ? 
      (parseFloat(sanitizedData.prix) - sanitizedData.advance_payment) : 0;
    const hasExpirationWarning = !!data.expiration_warning;
    
    // Format time to display nicely
    const formattedTime = sanitizedData.heure.substring(0, 5); // Show only HH:MM
    
    console.log('Sanitized data for receipt:', sanitizedData);
    
    return (
      <div 
        ref={ref} 
        className="bg-white text-black p-5 mx-auto rounded-lg receipt-container"
        style={{ width: '76mm', fontSize: '11px' }}
      >
        <div className="receipt-header text-center mb-4">
          <h1 className="text-xl font-bold mb-1">RESERVATION RECEIPT</h1>
          <p className="text-sm">MyTerrain</p>
          <p className="text-xs text-gray-600">123 Sports Avenue, City</p>
          <p className="text-xs text-gray-600">Tel: +212 600 000 000</p>
          <div className="border-b border-gray-300 my-2"></div>
        </div>
        
        <div className="receipt-details space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="font-semibold">Receipt No:</span>
            <span>{sanitizedData.num_res}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Date:</span>
            <span>{formatDate(sanitizedData.date)}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Time:</span>
            <span>{formattedTime}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Client:</span>
            <span>{sanitizedData.Name}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="font-semibold">Terrain:</span>
            <span>{sanitizedData.terrain_name}</span>
          </div>
          
          <div className="border-b border-gray-300 my-2"></div>
          
          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>{formatPrice(sanitizedData.prix)} MAD</span>
          </div>
          
          {hasAdvancePayment && (
            <>
              <div className="flex justify-between">
                <span className="font-semibold">Advance Paid:</span>
                <span>{formatPrice(sanitizedData.advance_payment)} MAD</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-semibold">Remaining:</span>
                <span>{formatPrice(remainingAmount)} MAD</span>
              </div>
              
              <div className="bg-yellow-100 p-2 text-xs rounded-md mt-2 text-center">
                <p className="font-semibold">Status: {getStatusText(sanitizedData.etat)}</p>
                <p>Please collect the remaining amount before the session</p>
              </div>
            </>
          )}
          
          {!hasAdvancePayment && (
            <div className={`${sanitizedData.etat === 'reserver' ? 'bg-green-100' : 'bg-yellow-100'} p-2 text-xs rounded-md mt-2 text-center`}>
              <p className="font-semibold">Status: {getStatusText(sanitizedData.etat)}</p>
              {sanitizedData.etat !== 'reserver' && (
                <p>Reservation pending confirmation</p>
              )}
            </div>
          )}
          
          {/* Display expiration warning if present */}
          {hasExpirationWarning && (
            <div className="bg-red-100 p-2 text-xs rounded-md mt-2 text-center border border-red-300">
              <p className="font-semibold text-red-800">{data.expiration_warning}</p>
            </div>
          )}
          
          <div className="border-b border-gray-300 my-2"></div>
          
          <div className="text-center text-xs mt-4">
            <p>Generated on {new Date().toLocaleString()}</p>
            <p className="font-semibold mt-1">Thank you for your reservation!</p>
            <p>www.myterrain.com</p>
          </div>
        </div>
      </div>
    );
  });
  
  if (!isVisible || !data) return null;
  
  // Show raw data for debugging
  console.log('Raw receipt data:', JSON.stringify(data, null, 2));
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <motion.div
        className="bg-gray-900 rounded-xl p-6 max-w-md shadow-xl border border-gray-800"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-green-400">Reservation Receipt</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="mb-5 overflow-auto max-h-[60vh] flex justify-center">
          <ReceiptContent ref={receiptRef} data={data} />
        </div>
        
        <div className="flex gap-3 justify-center mt-4">
          <button
            onClick={handlePrintReceipt}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Printer size={18} className="mr-2" />
            Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <FileDown size={18} className="mr-2" />
            Save PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
} 