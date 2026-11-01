const LoginForm = ({ user, handleSubmit }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const loginForm = () => (
    <form onSubmit={handleSubmit}>
      <h2>log in to application</h2>
      <div>
        <label>
          username:
          <input
            value={username}
            onChange={(event) => {
              setUsername(event.target.value)
            }}
            type="text"
          ></input>
        </label>
      </div>

      <div>
        <label>
          password:
          <input
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
            }}
            type="text"
          ></input>
        </label>
      </div>

      <button type="submit">Login</button>
    </form>
  )
  const loggedInUI = () => (
    <div>
      <p>{user.name} logged in</p>
      <button
        onClick={() => {
          window.localStorage.removeItem('loggedBlogAppUser')
          setUser(null)
        }}
      >
        Logout
      </button>
    </div>
  )
  return (
    <div>
      {user && loggedInUI()}
      {!user && loginForm()}
    </div>
  )
}

export default LoginForm
