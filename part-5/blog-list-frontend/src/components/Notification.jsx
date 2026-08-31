const Notification = ({ message, color }) => {
  if (message === null) return null
  const messageStyle = {
    border: `solid 2px ${color}`,
    color: `${color}`,
    padding: '5px',
    borderRadius: '5px',
    marginBottom: '20px',
    textAlign: 'center',
    fontSize: '20px',
    marginInline: '30px',
    backgroundColor: 'lightGray',
  }

  return <div style={messageStyle}>{message}</div>
}
export default Notification
