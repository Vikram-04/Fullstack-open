import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import BlogForm from './BlogForm'

test('event handler is called on blog creation', async () => {
  const mockHandler = vi.fn()
  render(<BlogForm addBlog={mockHandler}></BlogForm>)

  const user = userEvent.setup()

  await user.type(
    screen.getByLabelText('title:'),
    'how-to-prepare-for-q4-planning',
  )
  await user.type(screen.getByLabelText('author:'), 'Daniel carnegie')
  await user.type(
    screen.getByLabelText('url:'),
    'https://www.dalecarnegie.com/blog/how-to-prep',
  )
  await user.type(screen.getByLabelText('likes:'), '3')
  await user.click(screen.getByText('Add'))
  expect(mockHandler.mock.calls).toHaveLength(1)
  expect(mockHandler.mock.calls[0][0].title).toBe(
    'how-to-prepare-for-q4-planning',
  )
  expect(mockHandler.mock.calls[0][0].author).toBe('Daniel carnegie')
  expect(mockHandler.mock.calls[0][0].url).toBe(
    'https://www.dalecarnegie.com/blog/how-to-prep',
  )
  expect(mockHandler.mock.calls[0][0].likes).toBe('3')
})
