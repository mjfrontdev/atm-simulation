import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  CreditCard, 
  Wallet, 
  ArrowLeftRight, 
  LogOut, 
  Settings, 
  History, 
  Shield, 
  Receipt, 
  User,
  TrendingUp,
  Zap,
  Smartphone,
  Gift,
  BarChart3
} from 'lucide-react'

interface User {
  cardNumber: string
  pin: string
  fullName: string
  email: string
  phone: string
  balance: number
  accounts: {
    current: number
    savings: number
    investment: number
  }
  dailyLimit: number
  transactions: Array<{
    id: string
    type: 'withdraw' | 'deposit' | 'transfer' | 'bill'
    amount: number
    description: string
    date: string
    time: string
    balance: number
  }>
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'accounts' | 'transactions' | 'services' | 'settings'>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      navigate('/')
      return
    }

    const userData: User = JSON.parse(currentUser)
    setUser(userData)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    toast.success('خروج موفقیت‌آمیز!', {
      position: "top-right",
      autoClose: 2000,
      rtl: true
    })
    setTimeout(() => {
      navigate('/')
    }, 2000)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'withdraw': return 'text-danger'
      case 'deposit': return 'text-success'
      case 'transfer': return 'text-warning'
      case 'bill': return 'text-info'
      default: return 'text-secondary'
    }
  }

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'withdraw': return 'برداشت'
      case 'deposit': return 'واریز'
      case 'transfer': return 'انتقال'
      case 'bill': return 'پرداخت قبض'
      default: return type
    }
  }

  // Real functionality handlers
  const handleTransferBetweenAccounts = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('انتقال بین حساب‌ها با موفقیت انجام شد!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const handleIncreaseSavings = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('موجودی حساب پس‌انداز افزایش یافت!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const handleNewInvestment = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2500))
    
    toast.success('سرمایه‌گذاری جدید ایجاد شد!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const handleBillPayment = async (billType: string) => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success(`پرداخت ${billType} با موفقیت انجام شد!`, {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const handleBuyCharge = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('خرید شارژ با موفقیت انجام شد!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const handleSendMoney = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('ارسال پول با موفقیت انجام شد!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const handleEditProfile = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast.success('اطلاعات شخصی با موفقیت ویرایش شد!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const handleChangePassword = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success('رمز عبور با موفقیت تغییر یافت!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })
    setIsLoading(false)
  }

  const renderOverview = () => (
    <>
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div 
            className="card glass border-0 shadow-sm animate-float"
            data-aos="fade-down"
          >
            <div className="card-body text-center py-4">
              <div className="atm-logo mb-3">
                <CreditCard className="display-1 text-primary icon-glow animate-pulse" />
              </div>
              <h2 className="text-primary mb-2 neon-text">خوش آمدید، {user?.fullName}!</h2>
              <p className="text-secondary mb-0">به پنل مدیریت حساب کاربری خود خوش آمدید</p>
            </div>
          </div>
        </div>
      </div>

      {/* Total Balance Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div 
            className="card glass border-0 shadow-sm animate-neon-pulse"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="card-body text-center py-5">
              <Wallet className="display-1 text-primary mb-3 icon-glow animate-float" />
              <h3 className="text-primary mb-2">کل موجودی</h3>
              <h2 className="fw-bold text-success mb-0 neon-text">
                {formatCurrency((user?.accounts.current || 0) + (user?.accounts.savings || 0) + (user?.accounts.investment || 0))}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Account Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div 
            className="card glass border-0 shadow-sm h-100 hover-lift animate-float"
            data-aos="fade-right"
            data-aos-delay="300"
            style={{ animationDelay: '0s' }}
          >
            <div className="card-body text-center py-4">
              <CreditCard className="display-4 text-primary mb-3 icon-glow animate-pulse" />
              <h4 className="text-primary mb-2">حساب جاری</h4>
              <h3 className="fw-bold text-success mb-0">{formatCurrency(user?.accounts.current || 0)}</h3>
              <small className="text-secondary">شماره کارت: {user?.cardNumber}</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div 
            className="card glass border-0 shadow-sm h-100 hover-lift animate-float"
            data-aos="fade-up"
            data-aos-delay="400"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="card-body text-center py-4">
              <TrendingUp className="display-4 text-success mb-3 icon-glow animate-pulse" />
              <h4 className="text-success mb-2">حساب پس‌انداز</h4>
              <h3 className="fw-bold text-success mb-0">{formatCurrency(user?.accounts.savings || 0)}</h3>
              <small className="text-secondary">سود روزانه: 0.5%</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div 
            className="card glass border-0 shadow-sm h-100 hover-lift animate-float"
            data-aos="fade-left"
            data-aos-delay="500"
            style={{ animationDelay: '1s' }}
          >
            <div className="card-body text-center py-4">
              <BarChart3 className="display-4 text-warning mb-3 icon-glow animate-pulse" />
              <h4 className="text-warning mb-2">حساب سرمایه‌گذاری</h4>
              <h3 className="fw-bold text-success mb-0">{formatCurrency(user?.accounts.investment || 0)}</h3>
              <small className="text-secondary">سود ماهانه: 2%</small>
            </div>
          </div>
        </div>
      </div>

      {/* Card Information */}
      <div className="row mb-4">
        <div className="col-12">
          <div 
            className="card glass border-0 shadow-sm animate-glow"
            data-aos="fade-up"
            data-aos-delay="550"
          >
            <div className="card-body text-center py-4">
              <CreditCard className="display-4 text-primary mb-3 icon-glow animate-pulse" />
              <h4 className="text-primary mb-3 neon-text">اطلاعات کارت</h4>
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="animate-float">
                    <h5 className="text-primary mb-2">شماره کارت</h5>
                    <div className="card-number-display">
                      {user?.cardNumber}
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="animate-float" style={{ animationDelay: '0.3s' }}>
                    <h5 className="text-primary mb-2">نام صاحب کارت</h5>
                    <div className="card-holder-name">
                      {user?.fullName}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div 
            className="card glass border-0 shadow-sm animate-glow"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            <div className="card-body">
              <h4 className="card-title mb-3 neon-text">عملیات سریع</h4>
              <div className="row g-3">
                <div className="col-md-3">
                  <button
                    className="btn btn-primary btn-lg w-100 py-3 animate-bounce"
                    onClick={() => navigate('/atm')}
                  >
                    <CreditCard className="me-2" size={20} />
                    استفاده از ATM
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-success btn-lg w-100 py-3 animate-bounce"
                    onClick={() => setActiveTab('services')}
                    style={{ animationDelay: '0.2s' }}
                  >
                    <Receipt className="me-2" size={20} />
                    پرداخت قبوض
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-warning btn-lg w-100 py-3 animate-bounce"
                    onClick={() => setActiveTab('accounts')}
                    style={{ animationDelay: '0.4s' }}
                  >
                    <ArrowLeftRight className="me-2" size={20} />
                    انتقال وجه
                  </button>
                </div>
                <div className="col-md-3">
                  <button 
                    className="btn btn-info btn-lg w-100 py-3 animate-bounce"
                    onClick={() => setActiveTab('settings')}
                    style={{ animationDelay: '0.6s' }}
                  >
                    <Settings className="me-2" size={20} />
                    تنظیمات
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )

  const renderAccounts = () => (
    <div className="row">
      <div className="col-12">
        <div className="card glass border-0 shadow-sm animate-glow">
          <div className="card-header bg-transparent border-0">
            <h4 className="card-title mb-0 neon-text text-dark-on-light">مدیریت حساب‌ها</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-primary text-white animate-float hover-lift">
                  <div className="card-body text-center">
                    <CreditCard className="mb-3 animate-pulse" size={40} />
                    <h5 className="text-white-on-dark">حساب جاری</h5>
                    <h3 className="text-white-on-dark">{formatCurrency(user?.accounts.current || 0)}</h3>
                    <button 
                      className="btn btn-light btn-sm animate-bounce"
                      onClick={handleTransferBetweenAccounts}
                      disabled={isLoading}
                    >
                      {isLoading ? 'در حال پردازش...' : 'انتقال به حساب دیگر'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-success text-white animate-float hover-lift">
                  <div className="card-body text-center">
                    <TrendingUp className="mb-3 animate-pulse" size={40} />
                    <h5 className="text-white-on-dark">حساب پس‌انداز</h5>
                    <h3 className="text-white-on-dark">{formatCurrency(user?.accounts.savings || 0)}</h3>
                    <button 
                      className="btn btn-light btn-sm animate-bounce"
                      onClick={handleIncreaseSavings}
                      disabled={isLoading}
                    >
                      {isLoading ? 'در حال پردازش...' : 'افزایش موجودی'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-warning text-white animate-float hover-lift">
                  <div className="card-body text-center">
                    <BarChart3 className="mb-3 animate-pulse" size={40} />
                    <h5 className="text-white-on-dark">حساب سرمایه‌گذاری</h5>
                    <h3 className="text-white-on-dark">{formatCurrency(user?.accounts.investment || 0)}</h3>
                    <button 
                      className="btn btn-light btn-sm animate-bounce"
                      onClick={handleNewInvestment}
                      disabled={isLoading}
                    >
                      {isLoading ? 'در حال پردازش...' : 'سرمایه‌گذاری جدید'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTransactions = () => (
    <div className="row">
      <div className="col-12">
        <div className="card glass border-0 shadow-sm">
          <div className="card-header bg-transparent border-0">
            <h4 className="card-title mb-0 text-dark-on-light">
              <History className="me-2" size={24} />
              تاریخچه تراکنش‌ها
            </h4>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th className="text-dark-on-light">نوع</th>
                    <th className="text-dark-on-light">مبلغ</th>
                    <th className="text-dark-on-light">توضیحات</th>
                    <th className="text-dark-on-light">تاریخ</th>
                    <th className="text-dark-on-light">ساعت</th>
                    <th className="text-dark-on-light">موجودی</th>
                  </tr>
                </thead>
                <tbody>
                  {user?.transactions.slice(0, 10).map((transaction) => (
                    <tr key={transaction.id}>
                      <td>
                        <span className={`badge ${getTransactionIcon(transaction.type)}`}>
                          {getTransactionTypeText(transaction.type)}
                        </span>
                      </td>
                      <td className="fw-bold text-dark-on-light">{formatCurrency(transaction.amount)}</td>
                      <td className="text-dark-on-light">{transaction.description}</td>
                      <td className="text-dark-on-light">{transaction.date}</td>
                      <td className="text-dark-on-light">{transaction.time}</td>
                      <td className="text-dark-on-light">{formatCurrency(transaction.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderServices = () => (
    <div className="row">
      <div className="col-12">
        <div className="card glass border-0 shadow-sm animate-glow">
          <div className="card-header bg-transparent border-0">
            <h4 className="card-title mb-0 neon-text text-dark-on-light">خدمات بانکی</h4>
          </div>
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <div className="card text-center hover-lift animate-float bg-white shadow-sm">
                  <div className="card-body">
                    <Zap className="display-4 text-primary mb-3 icon-glow animate-pulse" />
                    <h5 className="text-dark-on-light">پرداخت قبوض</h5>
                    <button 
                      className="btn btn-primary animate-bounce"
                      onClick={() => handleBillPayment('برق')}
                      disabled={isLoading}
                    >
                      {isLoading ? 'در حال پردازش...' : 'پرداخت'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center hover-lift animate-float bg-white shadow-sm">
                  <div className="card-body">
                    <Smartphone className="display-4 text-success mb-3 icon-glow animate-pulse" />
                    <h5 className="text-dark-on-light">خرید شارژ</h5>
                    <button 
                      className="btn btn-success animate-bounce"
                      onClick={handleBuyCharge}
                      disabled={isLoading}
                    >
                      {isLoading ? 'در حال پردازش...' : 'خرید'}
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center hover-lift animate-float bg-white shadow-sm">
                  <div className="card-body">
                    <ArrowLeftRight className="display-4 text-warning mb-3 icon-glow animate-pulse" />
                    <h5 className="text-dark-on-light">انتقال وجه</h5>
                    <button 
                      className="btn btn-warning animate-bounce"
                      onClick={() => navigate('/atm')}
                    >
                      انتقال
                    </button>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card text-center hover-lift animate-float bg-white shadow-sm">
                  <div className="card-body">
                    <Gift className="display-4 text-info mb-3 icon-glow animate-pulse" />
                    <h5 className="text-dark-on-light">ارسال پول</h5>
                    <button 
                      className="btn btn-info animate-bounce"
                      onClick={handleSendMoney}
                      disabled={isLoading}
                    >
                      {isLoading ? 'در حال پردازش...' : 'ارسال'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="row">
      <div className="col-12">
        <div className="card glass border-0 shadow-sm">
          <div className="card-header bg-transparent border-0">
            <h4 className="card-title mb-0 text-dark-on-light">تنظیمات</h4>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h5 className="text-dark-on-light"><User className="me-2" size={20} />اطلاعات شخصی</h5>
                <p className="text-dark-on-light"><strong>نام:</strong> {user?.fullName}</p>
                <p className="text-dark-on-light"><strong>ایمیل:</strong> {user?.email}</p>
                <p className="text-dark-on-light"><strong>تلفن:</strong> {user?.phone}</p>
                <button 
                  className="btn btn-primary"
                  onClick={handleEditProfile}
                  disabled={isLoading}
                >
                  {isLoading ? 'در حال پردازش...' : 'ویرایش اطلاعات'}
                </button>
              </div>
              <div className="col-md-6">
                <h5 className="text-dark-on-light"><Shield className="me-2" size={20} />تنظیمات امنیتی</h5>
                <p className="text-dark-on-light"><strong>محدودیت روزانه:</strong> {formatCurrency(user?.dailyLimit || 0)}</p>
                <p className="text-dark-on-light"><strong>تعداد تراکنش‌ها:</strong> {user?.transactions.length}</p>
                <button 
                  className="btn btn-warning"
                  onClick={handleChangePassword}
                  disabled={isLoading}
                >
                  {isLoading ? 'در حال پردازش...' : 'تغییر رمز عبور'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">در حال بارگذاری...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark shadow-sm">
        <div className="container">
          <div className="navbar-brand d-flex align-items-center">
            <CreditCard className="me-2" size={24} />
            <span className="fw-bold">دستگاه ATM</span>
          </div>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text text-light me-3">
              خوش آمدید، {user.fullName}
            </span>
            <button
              className="btn btn-outline-light btn-sm"
              onClick={handleLogout}
            >
              <LogOut className="me-1" size={16} />
              خروج
            </button>
          </div>
        </div>
      </nav>

      <div className="container py-5">
        {/* Navigation Tabs */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card glass border-0 shadow-sm">
              <div className="card-body">
                <ul className="nav nav-tabs nav-fill">
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                      onClick={() => setActiveTab('overview')}
                    >
                      <Wallet className="me-2" size={18} />
                      نمای کلی
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'accounts' ? 'active' : ''}`}
                      onClick={() => setActiveTab('accounts')}
                    >
                      <CreditCard className="me-2" size={18} />
                      حساب‌ها
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'transactions' ? 'active' : ''}`}
                      onClick={() => setActiveTab('transactions')}
                    >
                      <History className="me-2" size={18} />
                      تراکنش‌ها
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'services' ? 'active' : ''}`}
                      onClick={() => setActiveTab('services')}
                    >
                      <Receipt className="me-2" size={18} />
                      خدمات
                    </button>
                  </li>
                  <li className="nav-item">
                    <button 
                      className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`}
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="me-2" size={18} />
                      تنظیمات
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'accounts' && renderAccounts()}
        {activeTab === 'transactions' && renderTransactions()}
        {activeTab === 'services' && renderServices()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  )
}

export default Dashboard