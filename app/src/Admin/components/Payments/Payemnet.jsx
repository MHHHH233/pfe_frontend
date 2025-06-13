import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Filter, Download, CreditCard, TrendingUp, DollarSign, Calendar, CheckCircle, Clock, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import * as XLSX from 'xlsx';

// Import your actual payment service
import paymentService from '../../../lib/services/admin/paymentService';

// For demo purposes, I'll create a wrapper that uses your service structure


const PaymentManagement = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('view'); // 'view', 'edit', 'delete'
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [tableLoading, setTableLoading] = useState(false);

  // Debounce function to limit API calls
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Memoize filtered payments to prevent unnecessary recalculations
  const filteredPayments = React.useMemo(() => {
    let filtered = [...payments];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(payment => 
        payment.paymentType?.toLowerCase() === typeFilter.toLowerCase()
      );
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const today = new Date();
      const startDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          startDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          startDate.setDate(today.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(today.getMonth() - 1);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= startDate && paymentDate <= today;
      });
    }
    
    // Apply search term
    if (searchTerm.trim()) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(payment => {
        return (
          payment.customerName.toLowerCase().includes(lowerCaseSearch) ||
          payment.email.toLowerCase().includes(lowerCaseSearch) ||
          payment.description.toLowerCase().includes(lowerCaseSearch) ||
          payment.id.toString().includes(lowerCaseSearch)
        );
      });
    }
    
    return filtered;
  }, [payments, statusFilter, typeFilter, dateFilter, searchTerm]);

  // Memoize paginated items
  const currentItems = React.useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredPayments, currentPage, itemsPerPage]);

  // Debounced search handler
  const debouncedSearch = React.useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1); // Reset to first page on new search
    }, 300),
    []
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTableLoading(true);
    debouncedSearch(value);
  };

  // Effect to handle table loading state
  React.useEffect(() => {
    if (tableLoading) {
      const timer = setTimeout(() => {
        setTableLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [tableLoading]);

  useEffect(() => {
    fetchPayments();
  }, []);
  
  // Separate effect for filters to prevent unnecessary API calls
  useEffect(() => {
    // Apply filters locally instead of fetching from API again
    setTableLoading(true);
    const timer = setTimeout(() => {
      setTableLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, typeFilter, dateFilter]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getAllPayments({});
      
      // Transform the API response to match the component's expected data structure
      const transformedData = response.data.map(payment => {
        // Format customer name properly
        const firstName = payment.compte?.prenom && payment.compte.prenom !== 'undefined' ? payment.compte.prenom : '';
        const lastName = payment.compte?.nom || '';
        const customerName = `${lastName} ${firstName}`.trim() || 'Unknown';
        
        // Determine payment type and description
        let paymentType = 'Other';
        let description = 'Payment';
        
        if (payment.id_reservation) {
          paymentType = 'Reservation';
          if (payment.reservation) {
            description = `Reservation #${payment.reservation.num_res} - ${payment.reservation.date} at ${payment.reservation.heure?.substring(0, 5) || ''}`;
          } else {
            description = `Reservation #${payment.id_reservation}`;
          }
        } else if (payment.id_academie) {
          paymentType = 'Academy';
          const planType = payment.payment_details?.subscription_plan || '';
          if (payment.academie) {
            description = `${payment.academie.nom} - ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`;
          } else {
            description = `Academy #${payment.id_academie} - ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`;
          }
        }
        
        // Format amount (convert from cents to currency format)
        const amount = parseFloat(payment.amount);
        
        return {
          id: payment.id,
          customerName,
          email: payment.compte?.email || '',
          amount,
          method: payment.payment_method,
          status: payment.status,
          date: payment.created_at ? payment.created_at.split('T')[0] : '',
          description,
          paymentType,
          paymentDetails: payment.payment_details,
          currency: payment.currency || 'mad',
          stripeId: payment.stripe_payment_intent_id,
          reservation: payment.reservation,
          academie: payment.academie
        };
      });
      
      setPayments(transformedData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      
      // Set payments to empty array to avoid using stale data
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await paymentService.updatePaymentStatus(id, { status: newStatus });
      fetchPayments();
      setShowModal(false);
    } catch (error) {
      console.error(`Error updating payment status for ID ${id}:`, error);
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      // Could add a toast notification here for user feedback
    }
  };

  const handleDelete = async (id) => {
    try {
      await paymentService.deletePayment(id);
      fetchPayments();
      setShowModal(false);
    } catch (error) {
      console.error(`Error deleting payment ID ${id}:`, error);
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      // Could add a toast notification here for user feedback
    }
  };

  const handleViewPayment = async (id) => {
    try {
      const response = await paymentService.getPayment(id);
      
      if (!response.success || !response.data) {
        console.error(`Invalid payment data for ID ${id}:`, response);
        return;
      }
      
      const paymentData = response.data;
      
      // Format customer name properly
      const firstName = paymentData.compte?.prenom && paymentData.compte.prenom !== 'undefined' ? paymentData.compte.prenom : '';
      const lastName = paymentData.compte?.nom || '';
      const customerName = `${lastName} ${firstName}`.trim() || 'Unknown';
      
      // Determine payment type and description
      let paymentType = 'Unknown';
      let description = 'Payment';
      
      if (paymentData.reservation) {
        paymentType = 'Reservation';
        description = `Reservation #${paymentData.reservation.num_res} - ${paymentData.reservation.date} at ${paymentData.reservation.heure?.substring(0, 5) || ''}`;
      } else if (paymentData.academie) {
        paymentType = 'Academy';
        const planType = paymentData.payment_details?.subscription_plan || '';
        description = `${paymentData.academie.nom} - ${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan`;
      }
      
      // Format amount
      const amount = parseFloat(paymentData.amount);
      
      // Transform the API response to match the component's expected structure
      const transformedData = {
        id: paymentData.id,
        customerName,
        email: paymentData.compte?.email || '',
        amount,
        method: paymentData.payment_method || 'unknown',
        status: paymentData.status || 'unknown',
        date: paymentData.created_at ? paymentData.created_at.split('T')[0] : '',
        description,
        paymentType,
        paymentDetails: paymentData.payment_details,
        currency: paymentData.currency || 'mad',
        stripeId: paymentData.stripe_payment_intent_id,
        reservation: paymentData.reservation,
        academie: paymentData.academie
      };
      
      setSelectedPayment(transformedData);
      setModalType('view');
      setShowModal(true);
    } catch (error) {
      console.error(`Error fetching payment details for ID ${id}:`, error);
      // Log detailed error information
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
      } else if (error.request) {
        console.error('Error request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      // Could add a toast notification here for user feedback
    }
  };

  // Calculate statistics for dashboard
  const totalRevenue = payments.reduce((sum, payment) => {
    // Count all payments for total revenue, not just completed ones
    const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
    return sum + amount;
  }, 0);
  
  const completedRevenue = payments.reduce((sum, payment) => {
    if (payment.status === 'completed') {
      const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
      return sum + amount;
    }
    return sum;
  }, 0);
  
  const pendingRevenue = payments.reduce((sum, payment) => {
    if (payment.status === 'pending') {
      const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
      return sum + amount;
    }
    return sum;
  }, 0);
  
  const completedPayments = payments.filter(p => p.status === 'completed').length;
  const pendingPayments = payments.filter(p => p.status === 'pending').length;
  const failedPayments = payments.filter(p => p.status === 'failed').length;
  const failedAmount = payments.reduce((sum, payment) => {
    if (payment.status === 'failed') {
      const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
      return sum + amount;
    }
    return sum;
  }, 0);
  
  // Calculate percentages for better visualization
  const totalCount = payments.length;
  const completedPercentage = totalCount > 0 ? Math.round((completedPayments / totalCount) * 100) : 0;
  const pendingPercentage = totalCount > 0 ? Math.round((pendingPayments / totalCount) * 100) : 0;
  const failedPercentage = totalCount > 0 ? Math.round((failedPayments / totalCount) * 100) : 0;

  // Prepare chart data
  const statusData = [
    { name: 'Completed', value: completedPayments, color: '#10b981', percentage: completedPercentage },
    { name: 'Pending', value: pendingPayments, color: '#f59e0b', percentage: pendingPercentage },
    { name: 'Failed', value: failedPayments, color: '#ef4444', percentage: failedPercentage }
  ];

  // Group payments by date for the chart
  const paymentsByDate = payments.reduce((acc, payment) => {
    const date = payment.date;
    if (!acc[date]) {
      acc[date] = { 
        date, 
        total: 0, 
        completed: 0, 
        pending: 0, 
        failed: 0,
        count: 0 
      };
    }
    
    const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
    acc[date].total += amount;
    acc[date].count += 1;
    
    // Track amounts by status
    if (payment.status === 'completed') {
      acc[date].completed += amount;
    } else if (payment.status === 'pending') {
      acc[date].pending += amount;
    } else if (payment.status === 'failed') {
      acc[date].failed += amount;
    }
    
    return acc;
  }, {});

  // Convert to array and sort by date
  const revenueChartData = Object.values(paymentsByDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    // Take only the last 7 days if we have more data
    .slice(-7);
    
  // Group payments by payment type for pie chart
  const paymentsByType = payments.reduce((acc, payment) => {
    const type = payment.paymentType || 'Other';
    if (!acc[type]) {
      acc[type] = { name: type, value: 0, color: type === 'Reservation' ? '#3b82f6' : type === 'Academy' ? '#8b5cf6' : '#ec4899' };
    }
    acc[type].value += 1;
    return acc;
  }, {});
  
  const paymentTypeData = Object.values(paymentsByType);

  // Function to export payments to Excel
  const exportToExcel = () => {
    // Prepare data for export
    const exportData = filteredPayments.map(payment => ({
      'Payment ID': payment.id,
      'Customer Name': payment.customerName,
      'Email': payment.email,
      'Amount': typeof payment.amount === 'number' ? payment.amount.toFixed(2) : parseFloat(payment.amount).toFixed(2),
      'Currency': payment.currency.toUpperCase(),
      'Payment Method': payment.method.charAt(0).toUpperCase() + payment.method.slice(1),
      'Status': payment.status.charAt(0).toUpperCase() + payment.status.slice(1),
      'Date': new Date(payment.date).toLocaleDateString(),
      'Payment Type': payment.paymentType,
      'Description': payment.description,
      'Stripe ID': payment.stripeId || 'N/A'
    }));

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    const wscols = [
      { wch: 10 }, // Payment ID
      { wch: 20 }, // Customer Name
      { wch: 25 }, // Email
      { wch: 12 }, // Amount
      { wch: 8 },  // Currency
      { wch: 15 }, // Payment Method
      { wch: 12 }, // Status
      { wch: 12 }, // Date
      { wch: 15 }, // Payment Type
      { wch: 40 }, // Description
      { wch: 30 }  // Stripe ID
    ];
    ws['!cols'] = wscols;

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Payments');

    // Generate Excel file
    const fileName = `payments_export_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  // Function to reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setTypeFilter('all');
    setDateFilter('all');
    setCurrentPage(1);
    setShowFilters(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="w-4 h-4" />;
      case 'paypal': return <DollarSign className="w-4 h-4" />;
      case 'bank_transfer': return <TrendingUp className="w-4 h-4" />;
      default: return <CreditCard className="w-4 h-4" />;
    }
  };

  // Helper function to get currency symbol
  const getCurrencySymbol = (currencyCode) => {
    switch(currencyCode.toLowerCase()) {
      case 'mad':
        return 'MAD';
      case 'usd':
        return '$';
      case 'eur':
        return '€';
      case 'gbp':
        return '£';
      default:
        return currencyCode.toUpperCase();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#07f468] mb-2">Payment Management</h1>
        <p className="text-gray-400">Manage and monitor all payment transactions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-white">MAD {totalRevenue.toFixed(2)}</p>
              <p className="text-xs text-gray-400 mt-1">{payments.length} total payments</p>
            </div>
            <div className="h-12 w-12 bg-[#07f468]/10 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-[#07f468]" />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Completed</p>
              <p className="text-2xl font-bold text-green-400">MAD {completedRevenue.toFixed(2)}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-400">{completedPayments} payments</span>
                <span className="text-xs text-green-400 ml-2">({completedPercentage}%)</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-400">MAD {pendingRevenue.toFixed(2)}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-400">{pendingPayments} payments</span>
                <span className="text-xs text-yellow-400 ml-2">({pendingPercentage}%)</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-yellow-900/30 rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Failed</p>
              <p className="text-2xl font-bold text-red-400">MAD {failedAmount.toFixed(2)}</p>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-400">{failedPayments} payments</span>
                <span className="text-xs text-red-400 ml-2">({failedPercentage}%)</span>
              </div>
            </div>
            <div className="h-12 w-12 bg-red-900/30 rounded-full flex items-center justify-center">
              <X className="h-6 w-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <TrendingUp className="h-5 w-5 text-[#07f468] mr-2" />
            Revenue Trend
          </h3>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getDate()}/${date.getMonth() + 1}`;
                  }}
                />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  formatter={(value) => [`MAD ${value.toFixed(2)}`, 'Amount']}
                />
                <Legend />
                <Line type="monotone" dataKey="total" name="Total Revenue" stroke="#07f468" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" name="Completed" stroke="#10b981" strokeWidth={1.5} />
                <Line type="monotone" dataKey="pending" name="Pending" stroke="#f59e0b" strokeWidth={1.5} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] bg-gray-800/50 rounded-lg">
              <p className="text-gray-400">No revenue data available</p>
            </div>
          )}
        </div>

        {/* Payment Distribution */}
        <div className="grid grid-cols-1 gap-6">
          {/* Status Distribution */}
          <div className="bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <PieChart className="h-5 w-5 text-[#07f468] mr-2" />
              Payment Status
            </h3>
            {statusData.some(item => item.value > 0) ? (
              <div className="flex items-center">
                <div className="w-1/2">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                        formatter={(value, name) => [`${value} payments`, name]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-1/2 pl-4">
                  {statusData.map((status, index) => (
                    <div key={index} className="flex items-center mb-3">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                      <div className="flex-1 text-sm text-gray-300">{status.name}</div>
                      <div className="text-sm font-medium text-white">{status.value}</div>
                      <div className="text-xs text-gray-400 ml-2">({status.percentage}%)</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-[200px] bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">No status data available</p>
              </div>
            )}
          </div>
          
          {/* Payment Type Distribution */}
          <div className="bg-gray-700 rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300">
            <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
              <CreditCard className="h-5 w-5 text-[#07f468] mr-2" />
              Payment Types
            </h3>
            {paymentTypeData.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {paymentTypeData.map((type, index) => (
                  <div key={index} className="flex-1 min-w-[120px] bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }}></div>
                      <div className="text-sm text-gray-300">{type.name}</div>
                    </div>
                    <div className="text-xl font-bold text-white">{type.value}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {Math.round((type.value / totalCount) * 100)}% of total
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-[100px] bg-gray-800/50 rounded-lg">
                <p className="text-gray-400">No payment type data available</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-700 rounded-lg shadow mb-6">
        <div className="p-6 border-b border-gray-600">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by customer, email, or payment ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-[#07f468] focus:border-transparent"
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters {filteredPayments.length !== payments.length && <span className="ml-1 bg-[#07f468] text-gray-900 text-xs px-1.5 py-0.5 rounded-full">{filteredPayments.length}</span>}
              </button>
              
              <button 
                onClick={resetFilters}
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-600 transition-colors border border-gray-600"
                disabled={!searchTerm && statusFilter === 'all' && typeFilter === 'all' && dateFilter === 'all'}
              >
                <X className="w-4 h-4 mr-2" />
                Clear
              </button>
              
              <button 
                onClick={exportToExcel}
                className="flex items-center px-4 py-2 bg-[#07f468] text-gray-900 rounded-lg hover:bg-[#06d35a] transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>
          
          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-600">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                <select
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-[#07f468]"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Payment Type</label>
                <select
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-[#07f468]"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="reservation">Reservations</option>
                  <option value="academy">Academy</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Date Range</label>
                <select
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white rounded-lg focus:ring-2 focus:ring-[#07f468]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Payment Table */}
        <div className="overflow-x-auto">
          {tableLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#07f468]"></div>
            </div>
          ) : filteredPayments.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payment ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {currentItems.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-600 cursor-pointer" onClick={() => handleViewPayment(payment.id)}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      <div className="flex flex-col">
                        <span>#{payment.id}</span>
                        <span className="text-xs text-gray-400 truncate max-w-[120px]" title={payment.stripeId}>
                          {payment.stripeId?.substring(0, 12)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{payment.customerName}</div>
                        <div className="text-xs text-gray-400">{payment.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-blue-400 mb-1">
                          {payment.paymentType}
                        </span>
                        <span className="text-sm text-gray-300 truncate max-w-[200px]" title={payment.description}>
                          {payment.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">
                          {getCurrencySymbol(payment.currency)} {typeof payment.amount === 'number' ? payment.amount.toFixed(2) : parseFloat(payment.amount).toFixed(2)}
                        </span>
                        <span className="text-xs flex items-center text-gray-400">
                          {getPaymentMethodIcon(payment.method)}
                          <span className="ml-1 capitalize">{payment.method.replace('_', ' ')}</span>
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        payment.status === 'completed' ? 'bg-green-900/50 text-green-400 border border-green-500/30' :
                        payment.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                        'bg-red-900/50 text-red-400 border border-red-500/30'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(payment.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleViewPayment(payment.id)}
                          className="p-1.5 bg-blue-900/30 text-blue-400 rounded-md hover:bg-blue-900/50 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setModalType('edit');
                            setShowModal(true);
                          }}
                          className="p-1.5 bg-yellow-900/30 text-yellow-400 rounded-md hover:bg-yellow-900/50 transition-colors"
                          title="Edit Status"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPayment(payment);
                            setModalType('delete');
                            setShowModal(true);
                          }}
                          className="p-1.5 bg-red-900/30 text-red-400 rounded-md hover:bg-red-900/50 transition-colors"
                          title="Delete Payment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-800/50 rounded-lg">
              <div className="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No payments found</h3>
              <p className="text-gray-400 text-center max-w-md mb-6">
                No payments match your current filters. Try adjusting your search criteria or clear the filters to see all payments.
              </p>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 bg-[#07f468] text-gray-900 rounded-lg hover:bg-[#06d35a] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredPayments.length > 0 && (
          <div className="px-6 py-3 border-t border-gray-600">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-400">
                Showing {currentPage * itemsPerPage - itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredPayments.length)} of {filteredPayments.length} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-600 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredPayments.length / itemsPerPage)))}
                  disabled={currentPage === Math.ceil(filteredPayments.length / itemsPerPage)}
                  className="px-3 py-1 text-sm border border-gray-600 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-700">
            <div className="p-6">
              {modalType === 'view' && (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-white">Payment Details</h3>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedPayment.status === 'completed' ? 'bg-green-900/50 text-green-400 border border-green-500/30' :
                      selectedPayment.status === 'pending' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-500/30' :
                      'bg-red-900/50 text-red-400 border border-red-500/30'
                    }`}>
                      {selectedPayment.status ? selectedPayment.status.toUpperCase() : 'UNKNOWN'}
                    </span>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600/50">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-400">Amount</div>
                      <div className="text-xl font-bold text-white">
                        {getCurrencySymbol(selectedPayment.currency)} {typeof selectedPayment.amount === 'number' ? selectedPayment.amount.toFixed(2) : parseFloat(selectedPayment.amount).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Payment ID</div>
                      <div className="text-sm text-white font-medium">#{selectedPayment.id}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Date</div>
                      <div className="text-sm text-white font-medium">{new Date(selectedPayment.date).toLocaleDateString()}</div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Payment Method</div>
                      <div className="text-sm text-white font-medium flex items-center">
                        {getPaymentMethodIcon(selectedPayment.method)}
                        <span className="ml-2 capitalize">{selectedPayment.method.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <div className="bg-gray-700/30 p-3 rounded-lg">
                      <div className="text-xs text-gray-400 mb-1">Payment Type</div>
                      <div className="text-sm text-white font-medium">{selectedPayment.paymentType}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-400 mb-2">Customer Information</div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="text-sm font-medium text-white mb-1">{selectedPayment.customerName}</div>
                      <div className="text-sm text-gray-400">{selectedPayment.email}</div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm font-medium text-gray-400 mb-2">Payment Details</div>
                    <div className="bg-gray-700/30 p-4 rounded-lg">
                      <div className="text-sm text-white mb-2">{selectedPayment.description}</div>
                      
                      {/* Payment breakdown section */}
                      {selectedPayment.paymentDetails && selectedPayment.paymentDetails.full_price && (
                        <div className="mt-3 pt-3 border-t border-gray-600/50">
                          <div className="text-xs text-gray-400 mb-2 font-semibold">Payment Breakdown</div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-400">Full Price:</span>
                              <span className="text-sm text-white">
                                {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.full_price).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-400">Amount Paid:</span>
                              <span className="text-sm text-green-400">
                                {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.advance_payment).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-400">Remaining Balance:</span>
                              <span className={`text-sm font-medium ${selectedPayment.paymentDetails.remaining > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.remaining).toFixed(2)}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-400">Payment Type:</span>
                              <span className="text-sm text-white capitalize">
                                {selectedPayment.paymentDetails.type?.replace('_', ' ') || 'Standard'}
                              </span>
                            </div>
                          </div>
                          
                          {/* Payment progress bar */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-600 rounded-full h-2.5">
                              <div 
                                className="bg-green-400 h-2.5 rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, (selectedPayment.paymentDetails.advance_payment / selectedPayment.paymentDetails.full_price) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-xs text-gray-400">
                                {Math.round((selectedPayment.paymentDetails.advance_payment / selectedPayment.paymentDetails.full_price) * 100)}% paid
                              </span>
                              {selectedPayment.paymentDetails.remaining > 0 && (
                                <span className="text-xs text-gray-400">
                                  {Math.round((selectedPayment.paymentDetails.remaining / selectedPayment.paymentDetails.full_price) * 100)}% remaining
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Warning for completed payments with remaining balance */}
                      {selectedPayment.status === 'completed' && selectedPayment.paymentDetails.remaining > 0 && (
                        <div className="mt-3 p-2 bg-yellow-900/30 border border-yellow-500/30 rounded text-xs text-yellow-400">
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span>
                              This payment is marked as completed but still has a remaining balance of {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.remaining).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {modalType === 'edit' && (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-white">Update Payment Status</h3>
                  <div className="space-y-4">
                    <div className="bg-gray-700/50 rounded-lg p-4 mb-4 border border-gray-600/50">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-400">Payment #</div>
                          <div className="text-white font-medium">#{selectedPayment.id}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-400 text-right">Amount</div>
                          <div className="text-white font-medium">
                            {getCurrencySymbol(selectedPayment.currency)} {typeof selectedPayment.amount === 'number' ? selectedPayment.amount.toFixed(2) : parseFloat(selectedPayment.amount).toFixed(2)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Payment breakdown for edit view */}
                      {selectedPayment.paymentDetails && selectedPayment.paymentDetails.full_price && (
                        <div className="mt-3 pt-3 border-t border-gray-600/50">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="text-xs text-gray-400">Full Price</div>
                              <div className="text-sm font-medium text-white">
                                {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.full_price).toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Paid Amount</div>
                              <div className="text-sm font-medium text-green-400">
                                {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.advance_payment).toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Remaining</div>
                              <div className={`text-sm font-medium ${selectedPayment.paymentDetails.remaining > 0 ? 'text-yellow-400' : 'text-green-400'}`}>
                                {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.remaining).toFixed(2)}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-400">Payment Type</div>
                              <div className="text-sm text-white capitalize">
                                {selectedPayment.paymentDetails.type?.replace('_', ' ') || 'Standard'}
                              </div>
                            </div>
                          </div>
                          
                          {/* Payment progress bar */}
                          <div className="mt-3">
                            <div className="w-full bg-gray-600 rounded-full h-2 mb-1">
                              <div 
                                className="bg-green-400 h-2 rounded-full" 
                                style={{ 
                                  width: `${Math.min(100, (selectedPayment.paymentDetails.advance_payment / selectedPayment.paymentDetails.full_price) * 100)}%` 
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-400">
                                {Math.round((selectedPayment.paymentDetails.advance_payment / selectedPayment.paymentDetails.full_price) * 100)}% paid
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Payment Status
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-white rounded-md focus:ring-2 focus:ring-[#07f468]"
                        value={selectedPayment.status}
                        onChange={(e) => setSelectedPayment({...selectedPayment, status: e.target.value})}
                      >
                        <option value="completed">Completed</option>
                        <option value="pending">Pending</option>
                        <option value="failed">Failed</option>
                      </select>
                      
                      <div className="mt-4 text-sm text-gray-400">
                        <p>Changing the status to "completed" will mark the payment as successful.</p>
                        <p className="mt-1">Changing to "failed" will mark the payment as unsuccessful.</p>
                      </div>
                      
                      {/* Warning for completing payment with remaining balance */}
                      {selectedPayment.status === 'completed' && selectedPayment.paymentDetails && selectedPayment.paymentDetails.remaining > 0 && (
                        <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-md">
                          <div className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mr-2 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div className="text-sm text-yellow-400">
                              <p className="font-medium">Warning: Remaining Balance</p>
                              <p className="mt-1">
                                You are marking this payment as completed, but there is still a remaining balance of {getCurrencySymbol(selectedPayment.currency)} {parseFloat(selectedPayment.paymentDetails.remaining).toFixed(2)}
                              </p>
                              <p className="mt-1">
                                Make sure the customer has made arrangements to pay the remaining amount.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {modalType === 'delete' && (
                <>
                  <h3 className="text-lg font-semibold mb-4 text-red-400">Delete Payment</h3>
                  
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 mb-6">
                    <div className="flex items-start">
                      <div className="mr-3 mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-white font-medium">Warning: This action cannot be undone</p>
                        <p className="text-gray-300 mt-1">
                          Deleting this payment will permanently remove it from the system.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700/50 rounded-lg p-4 mb-6 border border-gray-600/50">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Payment ID</div>
                        <div className="text-white font-medium">#{selectedPayment.id}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Amount</div>
                        <div className="text-white font-medium">
                          {getCurrencySymbol(selectedPayment.currency)} {typeof selectedPayment.amount === 'number' ? selectedPayment.amount.toFixed(2) : parseFloat(selectedPayment.amount).toFixed(2)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Customer</div>
                        <div className="text-white font-medium">{selectedPayment.customerName}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Date</div>
                        <div className="text-white font-medium">{new Date(selectedPayment.date).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Are you sure you want to delete payment #{selectedPayment.id}?
                  </p>
                </>
              )}

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-white border border-gray-600 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
                {modalType === 'edit' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedPayment.id, selectedPayment.status)}
                    className="px-4 py-2 bg-[#07f468] text-gray-900 rounded-md hover:bg-[#06d35a]"
                  >
                    Update Status
                  </button>
                )}
                {modalType === 'delete' && (
                  <button
                    onClick={() => handleDelete(selectedPayment.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentManagement;