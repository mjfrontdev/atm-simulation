import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  ArrowLeftRight, 
  LogOut, 
  Receipt,
  DollarSign,
  X,
  RotateCcw
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

const ATM = () => {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'withdraw' | 'deposit' | 'balance' | 'transfer' | 'bill' | 'accounts'>('main')
  const [amount, setAmount] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transferData, setTransferData] = useState({
    cardNumber: '',
    amount: '',
    description: ''
  })
  const [billData, setBillData] = useState({
    billType: 'electricity',
    billNumber: '',
    amount: ''
  })
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

  const handleKeyPress = (key: string) => {
    if (key === 'C') {
      setAmount('')
    } else if (key === '←') {
      setAmount(prev => prev.slice(0, -1))
    } else if (key === '00') {
      setAmount(prev => prev + '00')
    } else if (amount.length < 8) {
      setAmount(prev => prev + key)
    }
  }

  const updateUserBalance = (newBalance: number, transaction: {
    id: string
    type: 'withdraw' | 'deposit' | 'transfer' | 'bill'
    amount: number
    description: string
    date: string
    time: string
    balance: number
  }) => {
    if (!user) return

    const updatedUser = { 
      ...user, 
      balance: newBalance,
      accounts: {
        ...user.accounts,
        current: newBalance
      },
      transactions: [transaction, ...user.transactions]
    }
    setUser(updatedUser)
    localStorage.setItem('currentUser', JSON.stringify(updatedUser))

    // Update in users array
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    const userIndex = users.findIndex(u => u.cardNumber === user.cardNumber)
    if (userIndex !== -1) {
      users[userIndex] = updatedUser
      localStorage.setItem('users', JSON.stringify(users))
    }
  }

  const handleWithdraw = async () => {
    if (!user) return

    if (!amount || parseInt(amount) === 0) {
      toast.error('لطفاً مبلغ معتبر وارد کنید!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    const withdrawAmount = parseInt(amount)
    if (withdrawAmount > user.accounts.current) {
      toast.error('موجودی کافی نیست!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    if (withdrawAmount > user.dailyLimit) {
      toast.error('مبلغ از محدودیت روزانه بیشتر است!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const newBalance = user.accounts.current - withdrawAmount
    const transaction = {
      id: Date.now().toString(),
      type: 'withdraw' as const,
      amount: withdrawAmount,
      description: 'برداشت وجه از ATM',
      date: new Date().toLocaleDateString('fa-IR'),
      time: new Date().toLocaleTimeString('fa-IR'),
      balance: newBalance
    }

    updateUserBalance(newBalance, transaction)

    toast.success(`برداشت ${new Intl.NumberFormat('fa-IR').format(withdrawAmount)} تومان موفقیت‌آمیز بود!`, {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })

    setAmount('')
    setCurrentScreen('main')
    setIsProcessing(false)
  }

  const handleDeposit = async () => {
    if (!user) return

    if (!amount || parseInt(amount) === 0) {
      toast.error('لطفاً مبلغ معتبر وارد کنید!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    const depositAmount = parseInt(amount)
    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newBalance = user.accounts.current + depositAmount
    const transaction = {
      id: Date.now().toString(),
      type: 'deposit' as const,
      amount: depositAmount,
      description: 'واریز وجه به حساب',
      date: new Date().toLocaleDateString('fa-IR'),
      time: new Date().toLocaleTimeString('fa-IR'),
      balance: newBalance
    }

    updateUserBalance(newBalance, transaction)

    toast.success(`واریز ${new Intl.NumberFormat('fa-IR').format(depositAmount)} تومان موفقیت‌آمیز بود!`, {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })

    setAmount('')
    setCurrentScreen('main')
    setIsProcessing(false)
  }

  const handleTransfer = async () => {
    if (!user) return

    if (!transferData.cardNumber || !transferData.amount) {
      toast.error('لطفاً تمام فیلدها را پر کنید!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    const transferAmount = parseInt(transferData.amount)
    if (transferAmount > user.accounts.current) {
      toast.error('موجودی کافی نیست!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 3000))

    const newBalance = user.accounts.current - transferAmount
    const transaction = {
      id: Date.now().toString(),
      type: 'transfer' as const,
      amount: transferAmount,
      description: `انتقال به کارت ${transferData.cardNumber}`,
      date: new Date().toLocaleDateString('fa-IR'),
      time: new Date().toLocaleTimeString('fa-IR'),
      balance: newBalance
    }

    updateUserBalance(newBalance, transaction)

    toast.success(`انتقال ${new Intl.NumberFormat('fa-IR').format(transferAmount)} تومان موفقیت‌آمیز بود!`, {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })

    setTransferData({ cardNumber: '', amount: '', description: '' })
    setCurrentScreen('main')
    setIsProcessing(false)
  }

  const handleBillPayment = async () => {
    if (!user) return

    if (!billData.billNumber || !billData.amount) {
      toast.error('لطفاً تمام فیلدها را پر کنید!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    const billAmount = parseInt(billData.amount)
    if (billAmount > user.accounts.current) {
      toast.error('موجودی کافی نیست!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      return
    }

    setIsProcessing(true)
    await new Promise(resolve => setTimeout(resolve, 2000))

    const newBalance = user.accounts.current - billAmount
    const transaction = {
      id: Date.now().toString(),
      type: 'bill' as const,
      amount: billAmount,
      description: `پرداخت قبض ${billData.billType} - شماره: ${billData.billNumber}`,
      date: new Date().toLocaleDateString('fa-IR'),
      time: new Date().toLocaleTimeString('fa-IR'),
      balance: newBalance
    }

    updateUserBalance(newBalance, transaction)

    toast.success(`پرداخت قبض ${new Intl.NumberFormat('fa-IR').format(billAmount)} تومان موفقیت‌آمیز بود!`, {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })

    setBillData({ billType: 'electricity', billNumber: '', amount: '' })
    setCurrentScreen('main')
    setIsProcessing(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان'
  }

  const renderMainScreen = () => (
    <div className="row g-3">
      <div className="col-6">
        <button
          className="btn btn-primary btn-lg w-100 py-4 hover-lift animate-bounce"
          onClick={() => setCurrentScreen('withdraw')}
        >
          <Wallet className="d-block mb-2 icon-glow animate-pulse" size={32} />
          برداشت وجه
        </button>
      </div>
      <div className="col-6">
        <button
          className="btn btn-success btn-lg w-100 py-4 hover-lift animate-bounce"
          onClick={() => setCurrentScreen('deposit')}
          style={{ animationDelay: '0.1s' }}
        >
          <CreditCard className="d-block mb-2 icon-glow animate-pulse" size={32} />
          واریز وجه
        </button>
      </div>
      <div className="col-6">
        <button
          className="btn btn-info btn-lg w-100 py-4 hover-lift animate-bounce"
          onClick={() => setCurrentScreen('balance')}
          style={{ animationDelay: '0.2s' }}
        >
          <DollarSign className="d-block mb-2 icon-glow animate-pulse" size={32} />
          مشاهده موجودی
        </button>
      </div>
      <div className="col-6">
        <button
          className="btn btn-warning btn-lg w-100 py-4 hover-lift animate-bounce"
          onClick={() => setCurrentScreen('transfer')}
          style={{ animationDelay: '0.3s' }}
        >
          <ArrowLeftRight className="d-block mb-2 icon-glow animate-pulse" size={32} />
          انتقال وجه
        </button>
      </div>
      <div className="col-6">
        <button
          className="btn btn-danger btn-lg w-100 py-4 hover-lift animate-bounce"
          onClick={() => setCurrentScreen('bill')}
          style={{ animationDelay: '0.4s' }}
        >
          <Receipt className="d-block mb-2 icon-glow animate-pulse" size={32} />
          پرداخت قبض
        </button>
      </div>
      <div className="col-6">
        <button
          className="btn btn-secondary btn-lg w-100 py-4 hover-lift animate-bounce"
          onClick={() => setCurrentScreen('accounts')}
          style={{ animationDelay: '0.5s' }}
        >
          <CreditCard className="d-block mb-2 icon-glow animate-pulse" size={32} />
          مدیریت حساب‌ها
        </button>
      </div>
    </div>
  )

  const renderKeypad = () => (
    <div className="row g-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num, index) => (
        <div key={num} className="col-4">
          <button
            className="btn btn-outline-secondary btn-lg w-100 py-3 hover-lift animate-bounce"
            onClick={() => handleKeyPress(num.toString())}
            disabled={isProcessing}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {num}
          </button>
        </div>
      ))}
      <div className="col-4">
        <button
          className="btn btn-outline-secondary btn-lg w-100 py-3 hover-lift animate-bounce"
          onClick={() => handleKeyPress('00')}
          disabled={isProcessing}
          style={{ animationDelay: '0.45s' }}
        >
          00
        </button>
      </div>
      <div className="col-4">
        <button
          className="btn btn-outline-secondary btn-lg w-100 py-3 hover-lift animate-bounce"
          onClick={() => handleKeyPress('0')}
          disabled={isProcessing}
          style={{ animationDelay: '0.5s' }}
        >
          0
        </button>
      </div>
      <div className="col-4">
        <button
          className="btn btn-outline-secondary btn-lg w-100 py-3 hover-lift animate-bounce"
          onClick={() => handleKeyPress('←')}
          disabled={isProcessing}
          style={{ animationDelay: '0.55s' }}
        >
          <RotateCcw size={20} />
        </button>
      </div>
      <div className="col-6">
        <button
          className="btn btn-danger btn-lg w-100 py-3 hover-lift animate-bounce"
          onClick={() => handleKeyPress('C')}
          disabled={isProcessing}
          style={{ animationDelay: '0.6s' }}
        >
          <X className="me-2" size={16} />
          پاک کردن
        </button>
      </div>
      <div className="col-6">
        <button
          className="btn btn-secondary btn-lg w-100 py-3 hover-lift animate-bounce"
          onClick={() => setCurrentScreen('main')}
          disabled={isProcessing}
          style={{ animationDelay: '0.65s' }}
        >
          <ArrowLeft className="me-2" size={16} />
          بازگشت
        </button>
      </div>
    </div>
  )

  const renderScreen = () => {
    if (!user) return null

    switch (currentScreen) {
      case 'withdraw':
        return (
          <div className="text-center">
            <h4 className="mb-4 neon-text animate-pulse">برداشت وجه</h4>
            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg text-center animate-glow"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="مبلغ را وارد کنید"
                readOnly
              />
            </div>
            {renderKeypad()}
            <div className="mt-4">
              <button
                className="btn btn-primary btn-lg w-100 hover-lift animate-bounce"
                onClick={handleWithdraw}
                disabled={!amount || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <Wallet className="me-2" size={20} />
                    برداشت وجه
                  </>
                )}
              </button>
            </div>
          </div>
        )

      case 'deposit':
        return (
          <div className="text-center">
            <h4 className="mb-4 neon-text animate-pulse">واریز وجه</h4>
            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg text-center animate-glow"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="مبلغ را وارد کنید"
                readOnly
              />
            </div>
            {renderKeypad()}
            <div className="mt-4">
              <button
                className="btn btn-success btn-lg w-100 hover-lift animate-bounce"
                onClick={handleDeposit}
                disabled={!amount || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <CreditCard className="me-2" size={20} />
                    واریز وجه
                  </>
                )}
              </button>
            </div>
          </div>
        )

      case 'balance':
        return (
          <div className="text-center">
            <h4 className="mb-4 neon-text animate-pulse">موجودی حساب‌ها</h4>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-primary text-white hover-lift animate-float">
                  <div className="card-body">
                    <CreditCard className="mb-2 animate-pulse" size={32} />
                    <h6>حساب جاری</h6>
                    <h4>{formatCurrency(user.accounts.current)}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-success text-white hover-lift animate-float">
                  <div className="card-body">
                    <Wallet className="mb-2 animate-pulse" size={32} />
                    <h6>حساب پس‌انداز</h6>
                    <h4>{formatCurrency(user.accounts.savings)}</h4>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-warning text-white hover-lift animate-float">
                  <div className="card-body">
                    <DollarSign className="mb-2 animate-pulse" size={32} />
                    <h6>حساب سرمایه‌گذاری</h6>
                    <h4>{formatCurrency(user.accounts.investment)}</h4>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg hover-lift animate-bounce"
              onClick={() => setCurrentScreen('main')}
            >
              <ArrowLeft className="me-2" size={20} />
              بازگشت
            </button>
          </div>
        )

      case 'transfer':
        return (
          <div className="text-center">
            <h4 className="mb-4 neon-text animate-pulse">انتقال وجه</h4>
            <div className="mb-3">
              <input
                type="text"
                className="form-control animate-glow"
                placeholder="شماره کارت مقصد"
                value={transferData.cardNumber}
                onChange={(e) => setTransferData(prev => ({ ...prev, cardNumber: e.target.value }))}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control animate-glow"
                placeholder="مبلغ"
                value={transferData.amount}
                onChange={(e) => setTransferData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control animate-glow"
                placeholder="توضیحات (اختیاری)"
                value={transferData.description}
                onChange={(e) => setTransferData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
            <div className="row">
              <div className="col-6">
                <button
                  className="btn btn-warning btn-lg w-100 hover-lift animate-bounce"
                  onClick={handleTransfer}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      در حال پردازش...
                    </>
                  ) : (
                    <>
                      <ArrowLeftRight className="me-2" size={20} />
                      انتقال وجه
                    </>
                  )}
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-secondary btn-lg w-100 hover-lift animate-bounce"
                  onClick={() => setCurrentScreen('main')}
                >
                  <ArrowLeft className="me-2" size={20} />
                  بازگشت
                </button>
              </div>
            </div>
          </div>
        )

      case 'bill':
        return (
          <div className="text-center">
            <h4 className="mb-4 neon-text animate-pulse">پرداخت قبض</h4>
            <div className="mb-3">
              <select
                className="form-control animate-glow"
                value={billData.billType}
                onChange={(e) => setBillData(prev => ({ ...prev, billType: e.target.value }))}
              >
                <option value="electricity">برق</option>
                <option value="water">آب</option>
                <option value="gas">گاز</option>
                <option value="phone">تلفن</option>
              </select>
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control animate-glow"
                placeholder="شماره قبض"
                value={billData.billNumber}
                onChange={(e) => setBillData(prev => ({ ...prev, billNumber: e.target.value }))}
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                className="form-control animate-glow"
                placeholder="مبلغ"
                value={billData.amount}
                onChange={(e) => setBillData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="row">
              <div className="col-6">
                <button
                  className="btn btn-danger btn-lg w-100 hover-lift animate-bounce"
                  onClick={handleBillPayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      در حال پردازش...
                    </>
                  ) : (
                    <>
                      <Receipt className="me-2" size={20} />
                      پرداخت قبض
                    </>
                  )}
                </button>
              </div>
              <div className="col-6">
                <button
                  className="btn btn-secondary btn-lg w-100 hover-lift animate-bounce"
                  onClick={() => setCurrentScreen('main')}
                >
                  <ArrowLeft className="me-2" size={20} />
                  بازگشت
                </button>
              </div>
            </div>
          </div>
        )

      case 'accounts':
        return (
          <div className="text-center">
            <h4 className="mb-4 neon-text animate-pulse">مدیریت حساب‌ها</h4>
            <div className="row">
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-primary text-white hover-lift animate-float">
                  <div className="card-body">
                    <CreditCard className="mb-2 animate-pulse" size={32} />
                    <h6>حساب جاری</h6>
                    <h4>{formatCurrency(user.accounts.current)}</h4>
                    <button className="btn btn-light btn-sm mt-2 animate-bounce">انتقال به حساب دیگر</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-success text-white hover-lift animate-float">
                  <div className="card-body">
                    <Wallet className="mb-2 animate-pulse" size={32} />
                    <h6>حساب پس‌انداز</h6>
                    <h4>{formatCurrency(user.accounts.savings)}</h4>
                    <button className="btn btn-light btn-sm mt-2 animate-bounce">افزایش موجودی</button>
                  </div>
                </div>
              </div>
              <div className="col-md-4 mb-3">
                <div className="card bg-gradient-warning text-white hover-lift animate-float">
                  <div className="card-body">
                    <DollarSign className="mb-2 animate-pulse" size={32} />
                    <h6>حساب سرمایه‌گذاری</h6>
                    <h4>{formatCurrency(user.accounts.investment)}</h4>
                    <button className="btn btn-light btn-sm mt-2 animate-bounce">سرمایه‌گذاری جدید</button>
                  </div>
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary btn-lg hover-lift animate-bounce"
              onClick={() => setCurrentScreen('main')}
            >
              <ArrowLeft className="me-2" size={20} />
              بازگشت
            </button>
          </div>
        )

      default:
        return renderMainScreen()
    }
  }

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
      <nav className="navbar navbar-dark shadow-sm">
        <div className="container">
          <button
            className="btn btn-outline-light btn-sm hover-lift"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="me-1" size={16} />
            بازگشت
          </button>
          <span className="navbar-brand mb-0 h1 neon-text">دستگاه ATM</span>
          <button
            className="btn btn-outline-light btn-sm hover-lift"
            onClick={() => navigate('/')}
          >
            <LogOut className="me-1" size={16} />
            خروج
          </button>
        </div>
      </nav>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div 
              className="card glass border-0 shadow-lg animate-glow"
              data-aos="zoom-in"
            >
              <div className="card-body p-5">
                {renderScreen()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ATM