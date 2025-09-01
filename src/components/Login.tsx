import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CreditCard, Lock, User, Eye, EyeOff } from 'lucide-react'

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

const Login = () => {
  const [cardNumber, setCardNumber] = useState('')
  const [pin, setPin] = useState('')
  const [showPin, setShowPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  // Default user data
  const defaultUser: User = {
    cardNumber: '1234-5678-9012-3456',
    pin: '1234',
    fullName: 'کاربر پیش‌فرض',
    email: 'default@atm.com',
    phone: '09123456789',
    balance: 5000000,
    accounts: {
      current: 5000000,
      savings: 2000000,
      investment: 1000000
    },
    dailyLimit: 5000000,
    transactions: [
      {
        id: '1',
        type: 'deposit',
        amount: 5000000,
        description: 'واریز اولیه',
        date: new Date().toLocaleDateString('fa-IR'),
        time: new Date().toLocaleTimeString('fa-IR'),
        balance: 5000000
      }
    ]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if default user exists in localStorage, if not add it
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    const defaultUserExists = users.find(user => user.cardNumber === defaultUser.cardNumber)
    
    if (!defaultUserExists) {
      users.push(defaultUser)
      localStorage.setItem('users', JSON.stringify(users))
    }

    // Check if user exists
    const user = users.find(u => u.cardNumber === cardNumber && u.pin === pin)
    
    if (user) {
      // Store current user
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      toast.success('ورود موفقیت‌آمیز!', {
        position: "top-right",
        autoClose: 2000,
        rtl: true
      })
      
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } else {
      toast.error('شماره کارت یا رمز عبور اشتباه است!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div 
              className="card glass border-0 shadow-lg"
              data-aos="fade-up"
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="atm-logo mb-3">
                    <CreditCard className="display-1 text-primary icon-glow animate-pulse" />
                  </div>
                  <h2 className="text-primary mb-2 neon-text animate-float">دستگاه ATM</h2>
                  <p className="text-secondary">لطفاً برای ورود اطلاعات خود را وارد کنید</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      <CreditCard className="me-2" size={16} />
                      شماره کارت
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg animate-glow enhanced-form-control"
                      placeholder="1234-5678-9012-3456"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      <Lock className="me-2" size={16} />
                      رمز عبور
                    </label>
                    <div className="input-group">
                      <input
                        type={showPin ? "text" : "password"}
                        className="form-control form-control-lg animate-glow enhanced-form-control"
                        placeholder="1234"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary animate-bounce"
                        onClick={() => setShowPin(!showPin)}
                      >
                        {showPin ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mb-3 hover-lift animate-bounce"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        در حال ورود...
                      </>
                    ) : (
                      <>
                        <User className="me-2" size={20} />
                        ورود
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-muted mb-0">
                      حساب کاربری ندارید؟{' '}
                      <Link to="/create-account" className="text-primary text-decoration-none animate-pulse">
                        ایجاد حساب جدید
                      </Link>
                    </p>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-secondary rounded animate-float">
                  <h6 className="text-primary mb-2">اطلاعات ورود پیش‌فرض:</h6>
                  <p className="mb-1 text-primary"><strong>شماره کارت:</strong> 1234-5678-9012-3456</p>
                  <p className="mb-0 text-primary"><strong>رمز عبور:</strong> 1234</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login