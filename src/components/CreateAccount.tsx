import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { 
  Lock, 
  User, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff,
  UserPlus,
  ArrowLeft
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

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    pin: '',
    confirmPin: ''
  })
  const [showPin, setShowPin] = useState(false)
  const [showConfirmPin, setShowConfirmPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const generateCardNumber = () => {
    const numbers = '0123456789'
    let cardNumber = ''
    for (let i = 0; i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        cardNumber += '-'
      }
      cardNumber += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }
    return cardNumber
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate PIN length
    if (formData.pin.length !== 4) {
      toast.error('رمز عبور باید 4 رقم باشد!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      setIsLoading(false)
      return
    }

    // Validate PIN confirmation
    if (formData.pin !== formData.confirmPin) {
      toast.error('رمز عبور و تکرار آن یکسان نیستند!', {
        position: "top-right",
        autoClose: 3000,
        rtl: true
      })
      setIsLoading(false)
      return
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    const cardNumber = generateCardNumber()
    const newUser: User = {
      cardNumber,
      pin: formData.pin,
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      balance: 1000000,
      accounts: {
        current: 1000000,
        savings: 0,
        investment: 0
      },
      dailyLimit: 5000000,
      transactions: [
        {
          id: Date.now().toString(),
          type: 'deposit',
          amount: 1000000,
          description: 'واریز اولیه حساب',
          date: new Date().toLocaleDateString('fa-IR'),
          time: new Date().toLocaleTimeString('fa-IR'),
          balance: 1000000
        }
      ]
    }

    // Save to localStorage
    const users: User[] = JSON.parse(localStorage.getItem('users') || '[]')
    users.push(newUser)
    localStorage.setItem('users', JSON.stringify(users))

    // Auto login the new user
    localStorage.setItem('currentUser', JSON.stringify(newUser))

    toast.success('حساب کاربری با موفقیت ایجاد شد!', {
      position: "top-right",
      autoClose: 3000,
      rtl: true
    })

    setTimeout(() => {
      navigate('/dashboard')
    }, 3000)

    setIsLoading(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div 
              className="card glass border-0 shadow-lg"
              data-aos="fade-up"
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div className="atm-logo mb-3">
                    <UserPlus className="display-1 text-primary icon-glow animate-pulse" />
                  </div>
                  <h2 className="text-primary mb-2 neon-text animate-float">ایجاد حساب جدید</h2>
                  <p className="text-secondary">لطفاً اطلاعات خود را وارد کنید</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <User className="me-2" size={16} />
                        نام و نام خانوادگی
                      </label>
                      <input
                        type="text"
                        className="form-control animate-glow enhanced-form-control"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <Mail className="me-2" size={16} />
                        ایمیل
                      </label>
                      <input
                        type="email"
                        className="form-control animate-glow enhanced-form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <Phone className="me-2" size={16} />
                        شماره تلفن
                      </label>
                      <input
                        type="tel"
                        className="form-control animate-glow enhanced-form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        <Lock className="me-2" size={16} />
                        رمز عبور (4 رقم)
                      </label>
                      <div className="input-group">
                        <input
                          type={showPin ? "text" : "password"}
                          className="form-control animate-glow enhanced-form-control"
                          name="pin"
                          value={formData.pin}
                          onChange={handleInputChange}
                          maxLength={4}
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
                  </div>

                  <div className="mb-4">
                    <label className="form-label">
                      <Lock className="me-2" size={16} />
                      تکرار رمز عبور
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPin ? "text" : "password"}
                        className="form-control animate-glow enhanced-form-control"
                        name="confirmPin"
                        value={formData.confirmPin}
                        onChange={handleInputChange}
                        maxLength={4}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary animate-bounce"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                      >
                        {showConfirmPin ? <EyeOff size={16} /> : <Eye size={16} />}
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
                        در حال ایجاد حساب...
                      </>
                    ) : (
                      <>
                        <UserPlus className="me-2" size={20} />
                        ایجاد حساب
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <Link to="/" className="btn btn-outline-secondary btn-sm hover-lift animate-bounce">
                      <ArrowLeft className="me-2" size={16} />
                      بازگشت به ورود
                    </Link>
                  </div>
                </form>

                <div className="mt-4 p-3 bg-secondary rounded animate-float">
                  <h6 className="text-primary mb-2">مزایای حساب کاربری:</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-1 text-primary">• موجودی اولیه: 1,000,000 تومان</li>
                    <li className="mb-1 text-primary">• محدودیت برداشت روزانه: 5,000,000 تومان</li>
                    <li className="mb-1 text-primary">• دسترسی به تمام خدمات ATM</li>
                    <li className="mb-0 text-primary">• پشتیبانی 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateAccount